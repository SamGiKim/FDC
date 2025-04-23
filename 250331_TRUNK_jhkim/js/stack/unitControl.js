// unitControl.js

import { getCurrentConfig } from "../config/fuelcellSelector.js";

export class UnitControl {
  constructor() {
    this.redisKey = null;  // Gateway 상태용
    this.refreshKey = null;  // 데이터 리프레시 제어용
    this.lastRefreshTime = null;
    this.consoleSection = document.querySelector(".console-section");
    if (!this.consoleSection) {
      console.error(".console-section 요소를 찾을 수 없습니다.");
    }
  }

  async initialize() {
    try {
      // fuelcellConfig 로딩 대기
      if (!window.isFuelcellConfigLoaded) {
        console.log('연료전지 설정 로드 대기 중...');
        await new Promise((resolve) => {
          document.addEventListener('fuelcellConfigLoaded', resolve, { once: true });
        });
      }

      console.log('연료전지 설정 로드 완료');

      // Redis 키 설정 확인
      await this.updateRedisKey();
      console.log('Redis Key 설정됨:', this.redisKey);

      if (!this.redisKey) {
        throw new Error('Redis 키가 설정되지 않았습니다.');
      }

      await this.loadAndDisplayRedisData();
      this.startPeriodicRefresh();
      this.listenForFuelcellChanges();
      
      console.log('UnitControl 초기화 완료');
    } catch (error) {
      console.error('초기화 중 오류:', error);
      this.resetDisplayData(); // 오류 발생 시 화면 초기화
    }
  }

  async updateRedisKey() {
    try {
      const config = await getCurrentConfig(); // getCurrentConfig가 Promise를 반환한다고 가정
      if (config && config.powerplant_id && config.fuelcell_id) {
        this.redisKey = `${config.powerplant_id}_${config.fuelcell_id}_fdu_prg`;
        this.refreshKey = `${config.powerplant_id}_${config.fuelcell_id}_fdu_uploaded`;
        console.log('Redis 키 업데이트됨:', {
          redisKey: this.redisKey,
          refreshKey: this.refreshKey
        });
      } else {
        throw new Error('설정 정보가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Redis 키 업데이트 중 오류:', error);
      throw error;
    }
  }

  // 데이터 로드 실패시, 컴포넌트 정리 시 초기화 
  resetDisplayData() {
    // PROGRESS step 리셋
    const stepElement = document.getElementById('progree-step');
    if(stepElement){
      stepElement.innerHTML = `-/- <sup>step</sup>`;
    }

    // PROGRESS Unit과 Total progress bar 리셋
    const progressBars = ['progress-unit-bar', 'progress-total-bar'];
    progressBars.forEach(id => {
      const bar = document.getElementById(id);
      if(bar){
        bar.style.width = '0%'
        bar.setAttribute('aria-valuenow', '0');
      }
    });

    // Unit, Total 값 리셋
    ['progress-unit', 'progress-total'].forEach(id =>{
      const element = document.getElementById(id);
      if(element){
        element.innerHTML=`0<sup>%</sup>`
      }
    })

    // STATUS 관련 값 리셋
    document.getElementById('fdu-status').textContent = '-';
    documnet.getElementById('dac-range').textContent = '-';
    document.getElementById('current-frequency').textContent = '-';
    document.getElementById('remaining-time').textContent = '-';
    document.getElementById('measurement-interval').textContent = '-';
  
    // frequency div 초기화
    const frequencyElement = document.getElementById('frequency');
    frequencyElement.innerHTML = `-<sup> Hz</sup>`;
  
    // 콘솔 섹션 초기화
    if (this.consoleSection) {
      this.consoleSection.innerHTML = '<pre> - </pre>';
    }
  
    console.log('Reset display data');
  }

  // 시간 문자열을 비교 가능한 형식으로 변환 (YYYY-MM-DD-HH-mm-ss -> Date)
  parseTimeString(timeStr) {
    const [year, month, day, hour, minute, second] = timeStr.split('-');
    return new Date(year, month - 1, day, hour, minute, second);
  }

  async loadAndDisplayRedisData() {
    try {
      // 리프레시 키 확인
      const refreshResponse = await fetch(`js/stack/unitControl_redis.php?key=${encodeURIComponent(this.refreshKey)}`);
      const refreshResult = await refreshResponse.json();
      
      if (refreshResult.data) {
        const uploadedTime = this.parseTimeString(refreshResult.data);
        const currentTime = new Date();
        
        // 업로드 시간이 현재보다 최신이고, 마지막 처리 시간과 다른 경우에만 갱신
        if (uploadedTime > this.lastRefreshTime && uploadedTime <= currentTime) {
          console.log('New data detected:', refreshResult.data);
          this.lastRefreshTime = uploadedTime;
          
          const event = new CustomEvent('fileUploadSuccess');
          document.dispatchEvent(event);
        }
      }

      // 2. Gateway 상태 정보 로드 (기존 코드)
      const statusResponse = await fetch(`js/stack/unitControl_redis.php?key=${encodeURIComponent(this.redisKey)}`);
      if (!statusResponse.ok) {
        throw new Error(`HTTP error! status: ${statusResponse.status}`);
      }
      const statusResult = await statusResponse.json();

      if (statusResult.error) {
        throw new Error(statusResult.error);
      }

      if (!statusResult.data) {
        throw new Error("데이터가 없습니다.");
      }
      
    // JSON 문자열을 객체로 파싱
    const data = JSON.parse(statusResult.data);
    const dacValue = (data.DAC.toLowerCase() === 'none' || !data.DAC) ? '-' : data.DAC;

    // 파일 업로드 성공 메시지 확인
    if (data.RESP) {
      const messages = data.RESP.split('\n')
        .filter(msg => msg.trim())
        .map(msg => {
          try {
            return JSON.parse(msg);
          } catch (e) {
            return null;
          }
        })
        .filter(msg => msg && msg.message === "File uploaded successfully");

      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];
        
        // 새로운 타임스탬프인 경우에만 업데이트
        if (!this.lastUploadTimestamp || latestMessage.timestamp > this.lastUploadTimestamp) {
          console.log('New upload detected:', latestMessage.timestamp);
          this.lastUploadTimestamp = latestMessage.timestamp;
          
          const event = new CustomEvent('fileUploadSuccess');
          document.dispatchEvent(event);
        }
      }
    }

    // PROGRESS의 STEP 값 업데이트 추가
    if (data.PROGRESS) {
      console.log('PROGRESS data:', data.PROGRESS); // PROGRESS 데이터 전체 확인
      const stepElement = document.getElementById('progree-step');
      console.log('Step Element:', stepElement); // element가 제대로 찾아지는지 확인
      if (stepElement) {
          stepElement.innerHTML = `${data.PROGRESS.STEP}<sup>step</sup>`;
          console.log('Updated step value:', stepElement.innerHTML); // 업데이트된 값 확인
      }
    }

    // PROGRESS의 UNIT 값 업데이트 추가
    if (data.PROGRESS) {
      const unitValue = data.PROGRESS.UNIT || '0';  // 값이 없으면 '0' 

    // progress bar width 업데이트
    const progressBar = document.getElementById('progress-unit-bar');
    if (progressBar) {
        progressBar.style.width = `${unitValue}%`;  // 동일한 값 사용
        progressBar.setAttribute('aria-valuenow', unitValue);
    }

    // progress-unit 텍스트 업데이트
    const unitElement = document.getElementById('progress-unit');
    if (unitElement) {
        unitElement.innerHTML = `${unitValue}<sup>%</sup>`;  // 동일한 값 사용
    }
  }

  if (data.PROGRESS) {
    // UNIT 업데이트 (기존 코드)
    const unitValue = data.PROGRESS.UNIT || '0';
    const progressBar = document.getElementById('progress-total-bar');
    if (progressBar) {
        progressBar.style.width = `${unitValue}%`;
        progressBar.setAttribute('aria-valuenow', unitValue);
    }
    const unitElement = document.getElementById('progress-unit');
    if (unitElement) {
        unitElement.innerHTML = `${unitValue}<sup>%</sup>`;
    }

    // TOTAL 업데이트
    const totalValue = data.PROGRESS.TOTAL || '0';
    const totalBar = document.querySelector('.progress-bar.bg-success');
    if (totalBar) {
        totalBar.style.width = `${totalValue}%`;
        totalBar.setAttribute('aria-valuenow', totalValue);
    }
    const totalElement = document.getElementById('progress-total');
    if (totalElement) {
        totalElement.innerHTML = `${totalValue}<sup>%</sup>`;
    }
}

    // 전체 데이터를 console-section에 표시
   this.updateConsoleSection(statusResult.data);


    // STATUS 값을 HTML에 업데이트
    const status = data.STATUS;
    status[4] = dacValue;
    console.log("status :",status);

     
    // Redis의 frequency 값(status[1])에 따라 cmd 옵션 제어
    const startButton = document.getElementById('start');
    if (startButton && startButton.startButtonHandler) {
        // 현재 선택된 명령어 저장
        const currentCmd = startButton.startButtonHandler.cmdSelect.value;

      if (status[1] && status[1].trim() !== '') {
        startButton.startButtonHandler.isRunning = true;
      } else {
        startButton.startButtonHandler.isRunning = false;
      }

      startButton.startButtonHandler.updateCmdOptions(startButton.startButtonHandler.allCommands);

      // 저장했던 명령어로 복원 (실행 중이 아닐 때만)
      if (!startButton.startButtonHandler.isRunning) {
        startButton.startButtonHandler.cmdSelect.value = currentCmd;
    }
    }

     // 항상 업데이트를 수행하도록 변경
     document.getElementById('fdu-status').innerText = status[0] || '-';
     document.getElementById('dac-range').innerText = `${status[4] || '-'} `;
     document.getElementById('current-frequency').innerText = status[1] || '-';
     document.getElementById('measurement-interval').innerText = status[2] || '-';
     document.getElementById('remaining-time').innerText = `${status[3] || '-'} `; // 'sec' 단위 추가

     // frequency div 업데이트
     const frequencyElement = document.getElementById('frequency');
     const currentFrequency = status[1] || '-';
     frequencyElement.innerHTML = `${currentFrequency}<sup>Hz</sup>`;
 
     console.log('Updated elements:', {
       'fdu-status': document.getElementById('fdu-status').innerText,
       'current-frequency': document.getElementById('current-frequency').innerText,
       'frequency': frequencyElement.innerHTML,
       'measurement-interval': document.getElementById('measurement-interval').innerText,
       'remaining-time': document.getElementById('remaining-time').innerText
     });
 
   } catch (error) {
    //  console.error("Redis 데이터를 불러오는 데 실패했습니다.", error);
     this.resetDisplayData();
     this.consoleSection.innerHTML = `<pre>통신이 끊겼습니다.</pre>`;
   }
 }
 

  updateConsoleSection(data) {
    if (this.consoleSection) {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        this.consoleSection.innerHTML = `<pre>${JSON.stringify(parsedData, null, 2)}</pre>`;
      } catch (error) {
        console.error("데이터 파싱 오류:", error);
        this.consoleSection.innerHTML = `<pre>데이터 파싱 오류: ${error.message}</pre>`;
      }
    } else {
      console.error("콘솔 섹션 요소를 찾을 수 없습니다.");
    }
  }

  startPeriodicRefresh() {
    setInterval(() => {
      this.loadAndDisplayRedisData();
    }, 2000); // 2초마다 갱신
  }

listenForFuelcellChanges(){
  document.addEventListener("fuelcellChanged", () => {
    this.updateRedisKey();
    this.resetDisplayData();
    this.loadAndDisplayRedisData();
  })
}
}


/////////////////////////////////////////////////////////////////////////////////////////////////
// 콘솔로그 [시작] [중지]버튼 관련
// 명령어와 설명, 단위 매핑
const cmdInfo = {
  'connect': {
    desc: '통신을 시작합니다.',
    val1Unit: '',
    val2Unit: ''
  },
  'dac_range': {
    desc: 'The DAC_RANGE command is used to set a range of injected currents by parameters such as peak (maximum value) and offset (reference value).',
    val1Unit: 'mV',
    val2Unit: 'mV'
  },
  'run': {
    desc: 'The RUN command starts a scanning of impedance measurements by setting a start frequency (fo_start) and an end frequency (fo_end) as parameters. The result of stack impedance measurements are reflected as Nyquist graphs.',
    val1Unit: 'Hz',
    val2Unit: 'Hz'
  },
  'pulse': {
    desc: 'The pulse command performs a measurement of transient responses by generating a various kind of pulse current injections with parameters such as amplitude (in mV) and phase offset (in the range of 0 to 360 degrees).',
    val1Unit: 'Hz',
    val2Unit: 'mV'
  },
  'npulse': {
    desc: 'The npulse command performs a measurement of transient responses by generating a various kind of npulse current injections with parameters such as amplitude (in mV) and phase offset (in the range of 0 to 360 degrees).',
    val1Unit: 'Hz',
    val2Unit: 'mV'
  },
  'calibration': {
    desc: '',
    val1Unit: '',
    val2Unit: '',
    val3Unit: ''
  },
  'help': {
    desc: '통신 상태를 점검합니다. ',
    val1Unit: '',
    val2Unit: ''
  },
  'disconnect': {
    desc: '통신을 종료합니다.',
    val1Unit: '',
    val2Unit: ''
  },
  // 기타 명령어에 대한 기본 값 설정
  'default': {
    desc: '',
    val1Unit: '',
    val2Unit: ''
  },
  'stop': {
    desc: 'The STOP command can terminate the operation when the RUN, PULSE command is running.', 
    val1Unit: '',
    val2Unit: ''
  }
};

//////////////////////////////////////////////////////////////////////////
// [시작] / [재생 RUN] 버튼
export class StartButtonHandler {
  constructor() {
    this.startButton = document.getElementById('start');
    this.cmdSelect = document.getElementById('cmd');
    this.val1Input = document.getElementById('value1');
    this.val2Input = document.getElementById('value2');
    this.val3Input = document.getElementById('value3');
    this.cmdDesc = document.getElementById('cmd_desc');
    this.unit1Span = document.getElementById('unit1');
    this.unit2Span = document.getElementById('unit2');
    this.unit3Span = document.getElementById('unit3');
    this.bigoInput = document.getElementById('bigo');
    this.merrInput = document.getElementById('merr');

    if (this.startButton) {
      this.startButton.startButtonHandler = this;  // 인스턴스를 버튼 요소에 연결
      this.startButton.addEventListener('click', this.handleStartButtonClick.bind(this));
    } else {
      console.error('Start 버튼을 찾을 수 없습니다.');
    }
    
    if (this.cmdSelect) {
      this.cmdSelect.addEventListener('change', this.handleCmdChange.bind(this));
      this.restoreCmdSelection(); // 페이지 로드 시 저장된 명령어 복원
      this.handleCmdChange(); // 페이지 로드 시 초기값 설정
    } else {
      console.error('cmd 선택 요소를 찾을 수 없습니다.');
    }

    this.isRunning = false;
    this.lastCommand = null;
    this.allCommands = ['connect', 'help', 'run', 'stop', 'dac_range', 'pulse', 'npulse', 'calibration' , 'disconnect'];

    // 페이지 로드 시 초기 옵션 설정
    this.initializeOptions();
  }

  initializeOptions() {
    this.updateCmdOptions(this.allCommands);
    if (this.cmdSelect) {
      // this.cmdSelect.value = 'connect'; // 기본값을 'connect'로 설정
      this.handleCmdChange(); // 초기 설명 및 단위 업데이트
    }
  }


  handleCmdChange() {
    const cmdValue = this.cmdSelect.value;
    localStorage.setItem('selectedCmd', cmdValue); // 선택된 명령어 저장
    const cmdData = cmdInfo[cmdValue] || cmdInfo['default'];

    // 설명 업데이트
    if (this.cmdDesc) {
    this.cmdDesc.innerText = cmdData.desc;
    // connect, disconnect, help 명령어일 때 설명 요소 숨기기
    if (cmdValue === 'connect' || cmdValue === 'disconnect' || cmdValue === 'help') {
      this.cmdDesc.style.display = 'none';
    } else {
      this.cmdDesc.style.display = 'block';
    }
  }

    // 단위 업데이트
    if (this.unit1Span) {
      this.unit1Span.innerText = cmdData.val1Unit ? ` ${cmdData.val1Unit}` : '';
    }
    if (this.unit2Span) {
      this.unit2Span.innerText = cmdData.val2Unit ? ` ${cmdData.val2Unit}` : '';
    }
    if (this.unit3Span) {
      this.unit3Span.innerText = cmdData.val3Unit ? ` ${cmdData.val3Unit}` : '';
    }
  }

  restoreCmdSelection() {
    const savedCmd = localStorage.getItem('selectedCmd');
    if (savedCmd && this.cmdSelect) {
      this.cmdSelect.value = savedCmd;
    }
  }

  
  handleStartButtonClick() {
    const cmd = this.cmdSelect ? this.cmdSelect.value : '';
    if (!cmd) {
      console.error('cmd 선택 요소를 찾을 수 없습니다.');
      alert('명령어를 선택하세요.');
      return;
    }

    const isConfirmed = confirm("시작 하시겠습니까?");
    if (!isConfirmed) {
      return;
    }

    const config = getCurrentConfig();
    let val1 = this.val1Input ? this.val1Input.value : '';
    let val2 = this.val2Input ? this.val2Input.value : '';
    let val3 = this.val3Input ? this.val3Input.value : '';
    let bigo = this.bigoInput ? this.bigoInput.value : '';
    let merr = this.merrInput ? this.merrInput.value : '';
	
	// >>> 250331 hjkim - 유닛컨트롤 버그
	const urlParams = new URLSearchParams(window.location.search);
    const plant = urlParams.get('plant');
    const group = urlParams.get('group');
    const fuelcell = urlParams.get('fuelcell');
	// <<< 250331 hjkim - 유닛컨트롤 버그
  
    const data = {
      "powerplant_id" : config.powerplant_id,
      "group_id" : config.group_id,
	  // >>> 250331 hjkim - 유닛컨트롤 버그
      "fuelcell_id" : fuelcell,
	  // <<< 250331 hjkim - 유닛컨트롤 버그
      "cmd": cmd,
      "val1": val1,
      "val2": val2,
      "val3": val3,
      "bigo": bigo,
      "merr": merr
    };

    console.log('전송할 데이터:', data);

    this.sendCommand(data);
  }

  sendCommand(data) {
    fetch('http://112.216.161.114:8082/api/set_cmd/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      mode: 'cors'
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text) });
      }
      return response.json();
    })
    .then(result => {
      console.log('서버 응답:', result);
      this.updateUIAfterCommand(data.cmd);
    })
    .catch(error => {
      console.error('오류 발생:', error);
      alert('요청 전송 중 오류가 발생했습니다: ' + error.message);
    });
  }

  updateUIAfterCommand(cmd) {
    if (cmd === 'run') {
      this.isRunning = true;
      this.lastCommand = cmd;
      this.updateCmdOptions(this.allCommands);
      if (this.cmdSelect) {
        this.cmdSelect.value = 'stop';
      }
    } else if (cmd === 'pulse') {
      this.isRunning = true;
      this.lastCommand = cmd;
      this.updateCmdOptions(this.allCommands);
      if (this.cmdSelect) {
        this.cmdSelect.value = cmd;
      }
    } else if (cmd === 'stop') {
      this.isRunning = false;
      this.lastCommand = null;
      this.updateCmdOptions(this.allCommands);
    } else {
      this.resetFields();
    }
  }
  
  updateCmdOptions(options) {
    if (this.cmdSelect) {
      this.cmdSelect.innerHTML = '';
      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        
        // Redis의 frequency 값이 있거나 run 명령어가 실행 중일 때
        if ((this.isRunning || this.lastCommand === 'run') && 
                (option === 'run' || option === 'pulse' || option === 'help' || option === 'dac_range' || option === 'npulse' || option === 'calibration')) {
                optionElement.textContent = `${option.toUpperCase()} (동작중)`;
                optionElement.disabled = true;
        } else {
          optionElement.textContent = option.toUpperCase();
          optionElement.disabled = false;
        }
        
        this.cmdSelect.appendChild(optionElement);
      });
    }
  }

  resetFields() {
    if (this.val1Input) {
      this.val1Input.value = '';
    }
    if (this.val2Input) {
      this.val2Input.value = '';
    }
    if (this.val3Input) {
      this.val3Input.value = '';
    }
    if (this.bigoInput) {
      this.bigoInput.value = '';
    }
    if (this.merrInput) {
      this.merrInput.value = '';
    }

    if (this.cmdSelect && !this.isRunning) {
      // this.cmdSelect.value = 'connect';
      this.handleCmdChange();
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('페이지 로드됨, UnitControl 초기화 시작');
    
    const startButtonHandler = new StartButtonHandler();
    const unitControl = new UnitControl();

    // fuelcellConfig 로딩 상태 확인 및 초기화
    if (window.isFuelcellConfigLoaded) {
      await unitControl.initialize();
    } else {
      document.addEventListener('fuelcellConfigLoaded', async () => {
        await unitControl.initialize();
      }, { once: true });
    }
  } catch (error) {
    console.error('페이지 초기화 중 오류:', error);
  }
});

// CALIBRATION 선택 시 TextFields 추가
document.getElementById('cmd').addEventListener('change', function () {
  const cmd = this.value;
  const calibrationFields = document.querySelectorAll('.calibration-only');

  if (cmd === 'calibration') {
    calibrationFields.forEach(el => el.style.display = 'block');
  } else {
    calibrationFields.forEach(el => el.style.display = 'none');		
  }
});