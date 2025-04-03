import { getCurrentConfig } from '../config/fuelcellSelector.js';
import { errorCodeMapping } from '../bop/bopSensorLabelingData.js';

let faultLabelData = []; // 전역 변수로 데이터 저장
let currentModelGroup = ''; // 현재 모델 그룹을 저장할 변수 추가
let errCodeCallback = null;
let previousDateDiv = null;
let previouslySelectedDate = null; // 이전에 선택된 날짜를 저장할 변수

document.addEventListener('DOMContentLoaded', function() {
    loadFaultLabelList(); // 초기 데이터 로드
    setupVerificationButton();
    setupFaultItemClickListener();
    setupErrCodeClickListener();
    setupFaultLabelTableEventListeners();

    const tableBody = document.getElementById('fault-label-list-table');
    if (tableBody) {
        tableBody.addEventListener('click', handleTableClick);
    }

    // date-div 클릭 이벤트 리스너 추가
    const dateDivs = document.querySelectorAll('#fault-label-list-table .date-div');
    dateDivs.forEach(dateDiv => {
        dateDiv.addEventListener('click', function() {
            handleDateDivClick(this);
        });
    });
});

document.addEventListener('stackChanged', function(event) {
    console.log('Stack changed. Loading fault label list...');
    loadFaultLabelList(); // 스택이 변경되면 데이터 로드
});

document.addEventListener('modelGroupChanged', function(event) {
    currentModelGroup = event.detail.modelGroup;
    console.log('Model group changed to:', currentModelGroup);
    loadFaultLabelList(); // 모델 그룹이 변경되면 데이터 로드
});

function startAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    refreshInterval = setInterval(loadFaultLabelList, 10000); // 10초마다 실행
}

function restartAutoRefresh() {
    startAutoRefresh();
}

async function loadFaultLabelList(errCodes = null) {
    try {
        const config = getCurrentConfig();
        let url = `js/aitraining/get_fault_label_list.php?powerplant_id=${config.powerplant_id}&
        fuelcell_id=${config.fuelcell_id}&modelGroup=${encodeURIComponent(currentModelGroup)}`;

        if (errCodes && errCodes.length > 0) {
            url += `&errCodes=${errCodes.join(',')}`;
        }
        
        console.log('Requesting URL:', url); // URL 확인용 로그
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
            updateFaultLabelTable(data);
            restoreActiveState();
        } else {
            clearFaultLabelTable();
        }
        
        setupSelectAllCheckbox();
        setupFaultLabelTableEventListeners();
    } catch (error) {
        console.error('고장 라벨 목록 로딩 중 오류:', error);
        clearFaultLabelTable();
    }
}

function restoreActiveState() {
    if (previouslySelectedDate) {
        const dateDiv = document.querySelector(`.date-div[data-date="${previouslySelectedDate}"]`);
        if (dateDiv) {
            const row = dateDiv.closest('tr');
            if (row) {
                row.classList.add('active');
                previousDateDiv = dateDiv; // previousDateDiv 업데이트
            }
        }
    }
}

export function setupFaultItemClickListener() {
    document.addEventListener('faultItemClicked', function(event) {
        const { selectedErrCodes } = event.detail;
        
        // 현재 선택된 날짜 저장
        const activeRow = document.querySelector('#fault-label-list-table tr.active');
        if (activeRow) {
            const dateDiv = activeRow.querySelector('.date-div');
            if (dateDiv) {
                previouslySelectedDate = dateDiv.getAttribute('data-date');
            }
        }
        
        // 선택된 에러 코드가 있을 경우 필터링된 데이터를 로드
        loadFaultLabelList(selectedErrCodes.length > 0 ? selectedErrCodes : null);
    });
}

function updateFaultLabelTable(data) {
    const tableBody = document.getElementById('fault-label-list-table');
    tableBody.innerHTML = '';

    if (Array.isArray(data) && data.length > 0) {
        console.log('Received data:', data); // 데이터 확인용

        data.forEach((item, index) => {
            const row = document.createElement('tr');
            const errName = errorCodeMapping[item.err_code] || `알 수 없는 에러 (코드: ${item.err_code})`;
            
            // scores 처리 로직
            let scoresTitle = '-';
            if (item.scores) {
                try {
                    let parsedScores;
                    if (typeof item.scores === 'string') {
                        parsedScores = JSON.parse(item.scores);
                    } else {
                        parsedScores = item.scores;
                    }
                    
                    console.log('Parsed scores type:', typeof parsedScores);
                    console.log('Parsed scores value:', parsedScores);

                    if (typeof parsedScores === 'object' && parsedScores !== null) {
                        const scoreValues = Object.values(parsedScores);
                        scoresTitle = scoreValues.join(', ');
                    } else {
                        scoresTitle = String(parsedScores);
                    }
                } catch (e) {
                    console.error('Scores parsing error:', e);
                    console.error('Problem item:', item);
                    scoresTitle = '-';
                }
            }

            row.innerHTML = `
                <td><input type="checkbox" class="fault-checkbox" data-index="${index}"></td>
                <td><span class="date-div" data-date="${item.date}" title="${item.date} ${item.start_time}~${item.end_time}">${item.date}</span> ${item.start_time}~${item.end_time}</td>
                <td>${item.err_code}. ${errName}</td>
                <td>${item.history ? item.history : ''}</td>
                <td title="${scoresTitle}">
                    ${item.score !== null ? item.score : '-'}
                </td>
                <td style="display: none;" data-err_code="${item.err_code}">${item.err_code}</td>
            `;
            tableBody.appendChild(row);
        });
    } else {
        clearFaultLabelTable();
    }
}

function clearFaultLabelTable() {
    const tableBody = document.getElementById('fault-label-list-table');
    tableBody.innerHTML = `
        <tr>
            <td></td>
            <td colspan="4">데이터가 없습니다.</td>
        </tr>
    `;
}

function setupFaultLabelTableEventListeners() {
    const tableBody = document.getElementById('fault-label-list-table');
    tableBody.removeEventListener('click', handleTableClick); // 기존 이벤트 리스너 제거
    tableBody.addEventListener('click', handleTableClick);

    // date-div 클릭 이벤트 리스너 추가
    const dateDivs = tableBody.querySelectorAll('.date-div');
    dateDivs.forEach(dateDiv => {
        dateDiv.removeEventListener('click', handleDateDivClick);
        dateDiv.addEventListener('click', function() {
            handleDateDivClick(this);
        });
    });

    // err-code 클릭 이벤트 리스너 추가
    const errCodeCells = tableBody.querySelectorAll('td[data-err_code]');
    errCodeCells.forEach(cell => {
        cell.removeEventListener('click', handleErrCodeClick);
        cell.addEventListener('click', function() {
            handleErrCodeClick(this);
        });
    });
}

function setupVerificationButton() {
    const verifyButton = document.getElementById('err-verify');
    verifyButton.addEventListener('click', sendVerificationData);
}

function setupSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('fault-checkbox-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            document.querySelectorAll('.fault-checkbox').forEach(checkbox => {
                checkbox.checked = isChecked;
            });
        });
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//  학습 모델 검증 버튼 누른 후 프로그레스바 
async function checkProgress(selectedStkId) {
    const progressKey = `${selectedStkId}_vf_progress`; // 키 설정
    try {
        const response = await fetch(`get_progress.php?stkId=${encodeURIComponent(selectedStkId)}`);
        const data = await response.json();

        if (!data.success) {
            console.error('Progress check error:', data.error);
            return;
        }

        const progressData = data.data;
        if (progressData) {
            const { total, done, percent, status } = progressData;

            // Update progress-spin only if not 100%
            const progressSpin = document.querySelector('.progress-spin');
            const progressBar = progressSpin.querySelector('.progress-bar');
            const textWaiting = progressSpin.querySelector('.text-waiting');
            const progressDone = document.getElementById('progress-done');
            const progressTotal = document.getElementById('progress-total');
            const progressPercent = document.getElementById('progress-percent');

            // Update the progress values
            progressDone.innerText = done;
            progressTotal.innerText = total;
            progressPercent.innerText = percent;

            // Update the progress bar width
            progressBar.style.width = `${percent}%`;

            // Show or hide the progress bar based on completion
            if (parseInt(percent) < 100) {
                progressSpin.style.display = 'block'; // Show progress spin
            } else {
                progressSpin.style.display = 'none'; // Hide progress spin if 100%
            }
        }
    } catch (error) {
        console.error('Error fetching progress:', error);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// 학습 모델 검증 버튼
async function sendVerificationData() {
    // 체크된 행들의 데이터를 직접 가져오기
    const selectedRows = Array.from(document.querySelectorAll('.fault-checkbox:checked'))
        .map(checkbox => checkbox.closest('tr'));

    if (selectedRows.length === 0) {
        alert('검증할 데이터를 선택해주세요.');
        return;
    }

    const modelGroupSelect = document.getElementById('model-group-select');
    if (!modelGroupSelect || !modelGroupSelect.value) {
        alert('모델 그룹을 선택해주세요.');
        return;
    }

    const selectedModelGroup = modelGroupSelect.value;
    console.log('선택된 모델 그룹:', selectedModelGroup);
    
    const isConfirmed = await showConfirmDialog('학습 모델 검증을 하시겠습니까?');
    if (!isConfirmed) {
        clearAllCheckboxes();
        return;
    }

    const config = getCurrentConfig();
    
    // 선택된 행에서 직접 데이터 추출
    const selectedData = selectedRows.map(row => {
        const dateSpan = row.querySelector('.date-div');
        const date = dateSpan.dataset.date;
        const timeRange = dateSpan.title; // "2024-11-14 13:34:06~15:07:19"
        const [fullStartTime, endTimeOnly] = timeRange.split('~');
        
        return {
            id: row.querySelector('.fault-checkbox').dataset.index,
            date: date,
            start_time: fullStartTime,                    // "2024-11-14 13:34:06"
            end_time: `${date} ${endTimeOnly.trim()}`,    // "2024-11-14 15:07:19"
            err_code: row.querySelector('td[data-err_code]').dataset.err_code,
            fuelcell_id: config.fuelcell_id
        };
    });

    console.log('Selected Data:', selectedData);

    const verificationData = {
        model_name: selectedModelGroup,
        powerplant_id: config.powerplant_id,
        group_id: config.group_id,
        fuelcell_id: config.fuelcell_id,
        error_list: selectedData.map(item => ({
            id: parseInt(item.id),
            f_name: `raw_${config.fuelcell_id}_${item.date.replace(/-/g, '')}.csv`,
            s_time: item.start_time,
            e_time: item.end_time,
            err_code: item.err_code
        }))
    };

    console.log(`전송할 검증 데이터:`, JSON.stringify(verificationData, null, 2));

    try {
        const response = await fetch('http://112.216.161.114:8082/api/ai_verification/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verificationData),
            mode: 'cors'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}\n${errorText}`);
        }

        const result = await response.json();
        console.log(`Verification result:`, result);
        alert('검증 요청이 성공적으로 전송되었습니다.');

        clearAllCheckboxes();

        const selectedErrCodes = selectedData.map(item => item.err_code);
        setTimeout(() => {
            loadFaultLabelList(selectedErrCodes);
        }, 3000);

    } catch (error) {
        console.error(`Error sending verification data:`, error);
        alert(`검증 요청 전송 중 오류가 발생했습니다: ${error.message}`);
    }
}

export function setupErrCodeClickListener() {
    const tableBody = document.getElementById('fault-label-list-table');

    tableBody.addEventListener('click', (event) => {
        if (event.target && event.target.matches('td[data-err_code]')) {
            const clickedCell = event.target;
            const errCode = clickedCell.getAttribute('data-err_code');

            const customEvent = new CustomEvent('errCodeSelected', {
                detail: { errCode: errCode }
            });
            document.dispatchEvent(customEvent);
        }
    });
}

function clearAllCheckboxes() {
    const selectAllCheckbox = document.getElementById('fault-checkbox-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false; // selectAllCheckbox 해제
    }
    document.querySelectorAll('.fault-checkbox').forEach(checkbox => checkbox.checked = false);
}

function showConfirmDialog(message) {
    return new Promise((resolve) => {
        if (confirm(message)) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}


////////////////////////////////////////////////////////////////////////////
// 날짜 선택시 SW 센서 리스트 호출
async function handleDateDivClick(target) {
    // 이전 선택된 row의 active 클래스 제거
    if (previousDateDiv) {
        const previousRow = previousDateDiv.closest('tr');
        if (previousRow) {
            previousRow.classList.remove('active');
        }
    }

    // 클릭한 date-div의 tr에 active 클래스 추가
    const currentRow = target.closest('tr');
    if (currentRow) {
        currentRow.classList.add('active');
    }
    previousDateDiv = target; // 현재 date-div를 이전으로 저장
    previouslySelectedDate = target.getAttribute('data-date'); // 선택된 날짜 저장

    const row = target.closest('tr');
    const config = getCurrentConfig();
    const date = target.getAttribute('data-date');
    const [year, month, day] = date.split('-');
    
    // 기본 디렉터리
    const baseDir = `/data/${config.powerplant_id}/${config.fuelcell_id}/BOP/${year}/${month}/${day}`;

    // 모델 이름 가져오기
    const modelGroupSelect = document.getElementById('model-group-select');
    const modelName = modelGroupSelect ? modelGroupSelect.value : '모델 이름 없음';

    // 모델 기반 파일명을 먼저 선언 (F002_model_n6_20241203.csv)
    const modelFileName = `${modelName}_${date.replace(/-/g, '')}.csv`;
    const modelPath = `${baseDir}/${modelFileName}`;
    
    // 원본 파일명은 나중에 선언 (F002_20241203.csv)
    const originalFileName = `${config.fuelcell_id}_${date.replace(/-/g, '')}.csv`;
    const originalPath = `${baseDir}/${originalFileName}`;

    const errCodeCell = row.querySelector('td[data-err_code]');
    const error_code = errCodeCell ? parseInt(errCodeCell.getAttribute('data-err_code'), 10) : 0;

    try {
        // 모델 기반 파일을 먼저 확인
        const modelResponse = await fetch(modelPath);
        
        if (modelResponse.ok) {
            console.log('Calling init_aitraining_graph_1 with:', modelPath, modelName, error_code);
            window.init_aitraining_graph_1(modelPath, modelName, error_code);
        } else {
            console.warn(`${modelPath}의 RESPONSE CODE가 404 입니다. 원본 파일을 요청합니다.`);
            
            const originalResponse = await fetch(originalPath);
            
            if (originalResponse.ok) {
                console.log('Calling init_aitraining_graph_1 with:', originalPath, modelName, error_code);
                window.init_aitraining_graph_1(originalPath, modelName, error_code);
            } else {
                console.error(`${originalPath}의 RESPONSE CODE가 404 입니다. 파일을 찾을 수 없습니다.`);
            }
        }
    } catch (error) {
        console.error('그래프 초기화 중 오류 발생:', error);
    }

    if (errCodeCell) {
        const errCode = errCodeCell.getAttribute('data-err_code');
        console.log('errCode:', errCode);

        const event = new CustomEvent('errCodeSelected', { detail: { errCode } });
        document.dispatchEvent(event);
        
        if (errCodeCallback) {
            console.log('Calling errCodeCallback with:', errCode);
            errCodeCallback(errCode);
        }
    }

    // 이전 선택된 date-div의 active 클래스 제거
    if (previousDateDiv && previousDateDiv !== target) {
        previousDateDiv.closest('tr').classList.remove('active');
    }

    // 클릭한 date-div의 tr에 active 클래스 추가
    target.closest('tr').classList.add('active');
    previousDateDiv = target; // 현재 date-div를 이전으로 저장
}


function handleErrCodeClick(target) {
    let errCode;
    if (target.classList.contains('err-code')) {
        errCode = target.textContent;
    } else if (target.hasAttribute('data-err_code')) {
        errCode = target.getAttribute('data-err_code');
    }

    if (errCode) {
        console.log('Clicked errCode:', errCode);
        const event = new CustomEvent('errCodeSelected', { detail: { errCode } });
        document.dispatchEvent(event);
        
        if (errCodeCallback) {
            errCodeCallback(errCode);
        }
    }
}

function handleTableClick(event) {
    const target = event.target;
    if (target.classList.contains('date-div')) {
        handleDateDivClick(target);
    } else if (target.hasAttribute('data-err_code')) {
        handleErrCodeClick(target);
    }
}

// 다른 필요한 함수들도 내보내기
export {setupFaultLabelTableEventListeners, loadFaultLabelList, updateFaultLabelTable, clearFaultLabelTable };