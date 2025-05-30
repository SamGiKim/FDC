const urlParams = new URLSearchParams(window.location.search);
const powerplant_id = urlParams.get('plant');
const fuelcell_id = urlParams.get('fuelcell');
const graphContainer = document.getElementById('modal-fuelcell-graph');

// 페이지 로드 후 DOM이 준비되면 실행
document.addEventListener("DOMContentLoaded", () => {
  const modalBtn = document.getElementById("fuelcell-modal-btn");
  const modal = document.getElementById("fuelcell-modal");
  const closeModalBtn = document.getElementById("fuelcell-closeModalBtn");

  modalBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.getElementById('daily').value = "-1";
    graphContainer.innerHTML = "";
  });

  // 연도와 월에 따라 해당 월의 마지막 날짜(일 수)를 반환하는 함수
  const getDaysInMonth = (year, month) => {
    // 2월일 경우, 윤년 계산
    if (month === "02") {
      return ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? 29 : 28;
    }
    const daysInMonth = {
      "01": 31, "03": 31, "04": 30, "05": 31, "06": 30,
      "07": 31, "08": 31, "09": 30, "10": 31, "11": 30, "12": 31
    };
    return daysInMonth[month] || 0;
  };

  const yearlySelect = document.getElementById("yearly");
  const monthlySelect = document.getElementById("monthly");
  const dailySelect = document.getElementById("daily");

  // 월의 일 수에 따라 일 select 옵션을 업데이트하는 함수
  const updateDays = () => {
    const year = parseInt(yearlySelect.value);
    const month = monthlySelect.value;

    if (!isNaN(year) && month !== "-1") {
      const days = getDaysInMonth(year, month);
      dailySelect.innerHTML = `<option value="-1">-일-</option>`;

      // <option> 요소 생성 및 추가
      for (let i = 1; i <= days; i++) {
        const day = i.toString().padStart(2, '0'); // 숫자를 두 자리 문자열로 변환 (1 → "01")
        const option = document.createElement("option");
        option.value = day;
        option.textContent = day;
        dailySelect.appendChild(option);
      }
    }
  };

  // 오늘 날짜 기준으로 연도/월 값을 가져와 해당 값을 select에 자동 설정
  const today = new Date();
  const currentYear = today.getFullYear().toString();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0'); // 월: 0~11 → 1~12로 보정 후 "01", "02" 형태로

  yearlySelect.value = currentYear;
  monthlySelect.value = currentMonth;
  updateDays();


  // 연, 월, 일 선택값이 변경될 때마다 CSV를 다시 불러와 그래프를 갱신하는 함수 호출
  ["yearly", "monthly"].forEach(id => {
    document.getElementById(id).addEventListener("change", () => {
      updateDays();
      updateCSVAndDrawGraph();
    });
  });
  document.getElementById("daily").addEventListener("change", () => {
    updateCSVAndDrawGraph(); 
  });
});

// 날짜가 모두 선택되었을 때 실행되는 함수
function updateCSVAndDrawGraph() {
  const year = document.getElementById('yearly').value;
  const month = document.getElementById('monthly').value;
  const day = document.getElementById('daily').value;

  // 연, 월, 일이 모두 선택되지 않았으면 함수 종료
  if (year === "-1" || month === "-1" || day === "-1") {
    return;
  }

  // 서버에서 해당 날짜에 해당하는 CSV 파일 목록을 요청
  fetch(`js/stack/fuelcell_graph.php?powerplant_id=${powerplant_id}&fuelcell_id=${fuelcell_id}&year=${year}&month=${month}&day=${day}`)
    .then(res => res.json()) 
    .then(data => {
      if (data.status === 'success' && data.files.length > 0) {
        const file = data.files[0];
        const params = { powerplant_id, fuelcell_id, year, month, day, file };
        fetchAndDrawDiagnosisCSV(params);
      } else {
        alert("해당 날짜에 CSV 파일이 없습니다.");
      }
    })
    .catch(err => {
      console.error("CSV 목록 가져오기 오류:", err);
      alert("CSV 목록을 가져오는 중 오류가 발생했습니다.");
    });
}

// CSV 파일을 fetch 해서 그래프 그리기 위한 데이터로 파싱 후 호출
function fetchAndDrawDiagnosisCSV({ powerplant_id, fuelcell_id, year, month, day, file }) {
  const fileUrl = `/data/${powerplant_id}/${fuelcell_id}/EIS/DGLOG/${year}/${month}/${day}/${file}`;

  fetch(fileUrl)
    .then(res => res.text()) 
    .then(csvText => {
      const parsedData = parseCSV(csvText);
      drawFuelCellGraph(parsedData);
    })
    .catch(err => {
      console.error("CSV fetch error:", err);
      alert("CSV 파일을 불러오는 중 오류가 발생했습니다.");
    });
}

// CSV 텍스트 데이터를 객체 배열로 변환하는 함수
function parseCSV(csvText) {
  const lines = csvText.trim().split("\n"); // 줄 단위로 분리
  const headers = lines[0].split(",");      // 첫 줄은 컬럼명
  const result = [];

  // 1번째 줄부터 끝까지 데이터 읽기
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const row = {};
    headers.forEach((h, idx) => {
      // "DATE" 컬럼은 문자열 그대로 저장, 나머지는 숫자로 변환
      row[h.trim()] = h === "DATE" ? cols[idx].trim() : parseFloat(cols[idx]);
    });
    result.push(row);
  }

  return result;
}

// 배열의 첫 번째 값을 기준으로 모든 값을 뺀 결과를 반환 (정규화)
function normalizeByFirstValue(arr) {
  const first = arr[0];            // 첫 값 저장
  return arr.map(v => v - first);  // 각 값에서 첫 값 뺌
}

// 실제 그래프 그리기 함수
function drawFuelCellGraph(parsedData) {
  const container = document.getElementById("modal-fuelcell-graph");

  // x축: DATE 값을 초 단위 타임스탬프로 변환
  const x = parsedData.map(row => {
    const safeDate = row.DATE.replace(" ", "T"); // ISO 8601 형식 맞춤
    return new Date(safeDate).getTime() / 1000;  // 초 단위 변환
  });

  // DIFF, DEG, RATE 데이터 추출
  const diff = parsedData.map(row => row.DIFF);
  const deg = parsedData.map(row => row.DEG);
  const rate = parsedData.map(row => row.RATE);

  // 각각 첫 값 기준으로 정규화하여 같은 시작점에서 출발하도록 변환
  const diffNorm = normalizeByFirstValue(diff);
  const degNorm = normalizeByFirstValue(deg);
  const rateNorm = normalizeByFirstValue(rate);

  // uPlot 옵션 설정
  const opts = {
    width: 850,
    height: 500,
    scales: {
      x: { time: true }, 
      y: { auto: true },
    },
    axes: [
      {
        scale: 'x',  // x축 설정
        values: (u, ticks) =>
          ticks.map(t =>
            new Date(t * 1000).toLocaleTimeString("ko-KR", {
                hour12: false,   // 24시간 형식 사용
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })
          ),
      },
    ],
    series: [
      {}, 
      {
        label: "DIFF",
        stroke: '#0000FF',
        value: (u, v, si, di) => diff[di]?.toFixed(3) ?? "N/A",  
      },
      {
        label: "DEG",
        stroke: '#008000',
        value: (u, v, si, di) => deg[di]?.toFixed(3) ?? "N/A",
      },
      {
        label: "RATE",
        stroke: '#FFA500',
        value: (u, v, si, di) => rate[di]?.toFixed(3) ?? "N/A",
      },
    ],
  };
  container.innerHTML = "";
  // uPlot 그래프 생성 및 렌더링
  new uPlot(opts, [x, diffNorm, degNorm, rateNorm], container);
}
