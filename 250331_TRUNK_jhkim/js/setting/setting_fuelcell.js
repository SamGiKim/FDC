// setting_fuelcell.js
import {
  modalSW,
  addCheckboxListeners,
  resetFuelcellForm,
  openDeleteModal,
  updateAllTables,
  fetchFuelcellData,
  fetchFuelcellList,
  fetchPowerplantOptions,
  validateSingleSelection,
  validateDeleteSelection,
  getCheckedRows,
  selectedRowsMap 
} from "./setting_common.js";


/*************DomContentLoaded*********************/
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM 로드됨");
  
  fetchFuelcellData();
  addEventListeners();
});


/*********************calculate_capacity************************/
function calculateTotalCapacity() {
  let totalE = 0;
  let totalT = 0;

  document
    .querySelectorAll('.fuelcell-list input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      totalE += parseFloat(checkbox.getAttribute("data-e-capacity")) || 0;
      totalT += parseFloat(checkbox.getAttribute("data-t-capacity")) || 0;
    });

  document.querySelector(
    "#group-modal .total-e-capacity"
  ).textContent = `${totalE} kW`;
  document.querySelector(
    "#group-modal .total-t-capacity"
  ).textContent = `${totalT} kW`;
}


/************************ 이벤트 ***************************/

// 이벤트 리스너를 추가하는 함수
function addEventListeners() {
  // selectedRows 파라미터 제거하고 테이블 선택자만 전달
  addCheckboxListeners('.fuelcell_table');

  // 검색 관련 이벤트 리스너
  document.getElementById("fuelcell-search-button").addEventListener("click", searchFuelcells);
  document.getElementById("fuelcell-search-reset").addEventListener("click", resetFuelcellSearch);
  
  // 모달 확인 버튼 이벤트 리스너
  const confirmButton = document.querySelector("#fuelcell-modal-confirm-btn");
  if (confirmButton) {
    confirmButton.addEventListener("click", function() {
      const modalTitle = document.getElementById("fuelcell-modal-title").textContent;
      if (modalTitle === "연료전지 추가") {
        addFuelcell();
      } else if (modalTitle === "연료전지 수정") {
        updateFuelcell();
      }
    });
  }

  // 초기 선택 상태 초기화
  selectedRowsMap.set('.fuelcell_table', []);
}

/************************ 조회 ***************************/
// setting_common.js

/************************ 검색 ***************************/
function searchFuelcells() {
  const selectedValue = document.getElementById(
    "fuelcell-search-select"
  ).value;
  const searchInput = document.getElementById("fuelcell-search-input").value;
  let query = "";

  if (selectedValue === "fuelcell_id") {
    query = `fuelcell_id=${encodeURIComponent(searchInput)}`;
  } else {
    query = `${selectedValue}=${encodeURIComponent(searchInput)}`;
  }

  fetchFuelcellData(query);
}

/********************* 초기화 ***************************/
// 검색 초기화 함수
function resetFuelcellSearch() {
  document.getElementById("fuelcell-search-input").value = "";
  document.getElementById("fuelcell-search-select").value = "fuelcell_id";
  fetchFuelcellData(); // 전체 데이터를 다시 불러옴
}

/************************ 추가/입력 ***************************/

// 새로운 연료전지 데이터를 추가하는 함수
function addFuelcell() {
  // 각 입력 필드에서 값을 가져옴
  const fuelcell_id = document.querySelector('#fuelcell-modal input[name="fuelcell_id"]')?.value;
  const fuelcell_name = document.querySelector('#fuelcell-modal input[name="fuelcell_name"]')?.value;
  const address_main = document.querySelector('#fuelcell-modal input[name="address_main"]')?.value;
  const address_detail = document.querySelector('#fuelcell-modal input[name="address_detail"]')?.value;
  const install_date = document.querySelector('#fuelcell-modal input[name="install_date"]')?.value;
  const reg_date = document.querySelector('#fuelcell-modal input[name="reg_date"]')?.value;
  const powerplantSelect = document.querySelector('#fuelcell-modal select.powerplant-select');
  const powerplant_id = powerplantSelect ? powerplantSelect.value : null;  // 기본 선택값도 가져옴
  const e_capacity = document.querySelector('#fuelcell-modal input[name="e_capacity"]')?.value;
  const t_capacity = document.querySelector('#fuelcell-modal input[name="t_capacity"]')?.value;

  if (!fuelcell_id || !fuelcell_name) {
    alert("연료전지 ID와 연료전지 이름을 입력해주세요.");
    return;
  }

  const address = `${address_main} ${address_detail}`.trim();

  const data = {
    fuelcell_id,
    fuelcell_name,
    address,
    install_date,
    reg_date,
    powerplant_id, // 선택된 발전소 ID 포함
    e_capacity,
    t_capacity,
  };

  fetch("js/setting/add_fuelcells.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.text(); // 먼저 텍스트로 응답을 받음
    })
    .then((text) => {
      console.log('서버 원본 응답:', text); // 디버깅용 로그
      
      try {
        const result = JSON.parse(text);
        if (result.success) {
          alert("연료전지가 성공적으로 추가되었습니다.");
          updateAllTables();  
          modalSW("#fuelcell-modal", "close");
          resetFuelcellForm(); // 입력 필드 초기화
        } else {
          alert("연료전지 추가에 실패했습니다: " + (result.error || "알 수 없는 오류"));
        }
      } catch (error) {
        console.error("JSON 파싱 오류:", error);
        console.error("파싱 시도한 텍스트:", text);
        
        // 추가는 성공했지만 응답 처리에 문제가 있는 경우
        if (text.includes("success") && text.includes("true")) {
          alert("연료전지가 추가되었습니다.");
          updateAllTables();  
          modalSW("#fuelcell-modal", "close");
          resetFuelcellForm(); // 입력 필드 초기화
        } else {
          alert("서버 응답을 처리하는 중 오류가 발생했습니다.");
        }
      }
    })
    .catch((error) => {
      console.error("Error adding fuelcell:", error);
      alert("연료전지 추가 중 오류가 발생했습니다: " + error.message);
    });
}
/************************ 삭제 ***************************/

// 삭제 버튼 클릭 이벤트
document.querySelector('.delete-btn[data-delete="fuelcells"]').addEventListener('click', () => {
  if (validateDeleteSelection('.fuelcell_table')) {
    modalSW("#delete-modal", "open");
    
    const confirmDeleteBtn = document.querySelector('#confirm-delete');
    if (confirmDeleteBtn) {
      confirmDeleteBtn.onclick = deleteSelectedFuelcells;
    } else {
      console.error('Delete confirmation button not found');
    }
  }
});

// 연료전지 삭제 처리 함수
// 연료전지 삭제 처리 함수
function deleteSelectedFuelcells() {
  const checkedRows = getCheckedRows('.fuelcell_table');
  
  const deletePromises = checkedRows.map(row => {
    const fuelcellId = row.querySelector("td:nth-child(2)").textContent;
    
    return fetch("js/setting/delete_fuelcell.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fuelcell_id: fuelcellId }),
    })
    .then(async response => {
      const text = await response.text();
      console.log(`서버 응답 (${fuelcellId}):`, text); // 디버깅용 로그
      
      try {
        // 마지막 유효한 JSON 객체 추출 시도
        const jsonMatch = text.match(/\{.*"success":(true|false).*\}/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[0];
          const data = JSON.parse(jsonStr);
          
          if (data.success) {
            return { success: true, fuelcell_id: fuelcellId };
          } else {
            throw new Error(data.error || '삭제 실패');
          }
        } else if (text.includes('"success":true')) {
          // JSON 파싱은 실패했지만 성공 메시지가 포함되어 있는 경우
          return { success: true, fuelcell_id: fuelcellId };
        } else {
          throw new Error(`유효한 응답을 찾을 수 없음: ${text}`);
        }
      } catch (e) {
        console.error(`JSON 파싱 오류 (${fuelcellId}):`, e);
        console.error('파싱 시도한 텍스트:', text);
        
        // 응답에 성공 메시지가 포함되어 있는지 확인
        if (text.includes('"success":true')) {
          return { success: true, fuelcell_id: fuelcellId, warning: '응답 처리 중 경고 발생' };
        } else {
          throw new Error(`서버 응답 처리 실패: ${text}`);
        }
      }
    })
    .catch(error => ({
      success: false,
      error: error.message,
      fuelcell_id: fuelcellId
    }));
  });

  Promise.all(deletePromises)
    .then(results => {
      const failures = results.filter(r => !r.success);
      const warnings = results.filter(r => r.warning);
      
      if (failures.length > 0) {
        const errorMessage = failures
          .map(f => `연료전지 ${f.fuelcell_id}: ${f.error}`)
          .join('\n');
        alert(`삭제 실패:\n${errorMessage}`);
      } else {
        let message = "선택한 항목이 성공적으로 삭제되었습니다.";
        alert(message);
        updateAllTables();
      }
      modalSW("#delete-modal", "close");
    })
    .catch(error => {
      console.error("삭제 작업 중 오류:", error);
      alert("삭제 중 오류가 발생했습니다: " + error.message);
    });
}

/************************ 수정 ***************************/
// 수정 버튼 클릭 이벤트
document.querySelector('#update-fuelcell-btn').addEventListener('click', () => {
  if (validateSingleSelection('.fuelcell_table')) {
    const selectedRow = getCheckedRows('.fuelcell_table')[0];
    
    const fuelcell = {
      fuelcell_id: selectedRow.querySelector("td:nth-child(2)").textContent,
      fuelcell_name: selectedRow.querySelector("td:nth-child(3)").textContent,
      powerplant_name: selectedRow.querySelector("td:nth-child(4)").textContent,
      group_name: selectedRow.querySelector("td:nth-child(5)").textContent,
      address: selectedRow.querySelector("td:nth-child(6)").textContent,
      install_date: selectedRow.querySelector("td:nth-child(7)").textContent,
      reg_date: selectedRow.querySelector("td:nth-child(8)").textContent,
      e_capacity: selectedRow.querySelector("td:nth-child(9)").textContent.replace("kW", ""),
      t_capacity: selectedRow.querySelector("td:nth-child(10)").textContent.replace("kW", "")
    };

    // 모달 폼에 데이터 설정
    const fuelcellIdInput = document.querySelector('#fuelcell-modal input[name="fuelcell_id"]');
    if (fuelcellIdInput) {
      fuelcellIdInput.value = fuelcell.fuelcell_id;
      fuelcellIdInput.readOnly = true;
      fuelcellIdInput.classList.add('readonly-input');
    }

    document.querySelector('#fuelcell-modal input[name="fuelcell_name"]').value = fuelcell.fuelcell_name;
    document.querySelector('#fuelcell-modal input[name="install_date"]').value = fuelcell.install_date;
    document.querySelector('#fuelcell-modal input[name="reg_date"]').value = fuelcell.reg_date;
    document.querySelector('#fuelcell-modal input[name="e_capacity"]').value = fuelcell.e_capacity;
    document.querySelector('#fuelcell-modal input[name="t_capacity"]').value = fuelcell.t_capacity;

    // 주소 설정
    const [addressMain, ...addressDetail] = fuelcell.address.split(" ");
    document.querySelector('#fuelcell-modal input[name="address_main"]').value = addressMain;
    document.querySelector('#fuelcell-modal input[name="address_detail"]').value = addressDetail.join(" ");

    // 발전소 목록 불러오기 및 선택
    const powerplantSelect = document.querySelector("#fuelcell-modal .powerplant-select");
    fetchPowerplantOptions(powerplantSelect).then(() => {
      Array.from(powerplantSelect.options).forEach((option) => {
        if (option.textContent === fuelcell.powerplant_name) {
          option.selected = true;
        }
      });
    });

    // 모달 설정
    document.getElementById("fuelcell-modal-title").textContent = "연료전지 수정";
    document.getElementById("fuelcell-modal-confirm-btn").textContent = "수정";
    
    modalSW("#fuelcell-modal", "open");
  }
});


// 연료전지 수정 처리 함수
function updateFuelcell() {
  const fuelcell_id = document.querySelector('#fuelcell-modal input[name="fuelcell_id"]')?.value;
  const fuelcell_name = document.querySelector('#fuelcell-modal input[name="fuelcell_name"]')?.value;
  const address_main = document.querySelector('#fuelcell-modal input[name="address_main"]')?.value;
  const address_detail = document.querySelector('#fuelcell-modal input[name="address_detail"]')?.value;
  const install_date = document.querySelector('#fuelcell-modal input[name="install_date"]')?.value;
  const reg_date = document.querySelector('#fuelcell-modal input[name="reg_date"]')?.value;
  const powerplantSelect = document.querySelector('#fuelcell-modal .powerplant-select');
  const powerplant_id = powerplantSelect ? powerplantSelect.value : null;
  const e_capacity = document.querySelector('#fuelcell-modal input[name="e_capacity"]')?.value;
  const t_capacity = document.querySelector('#fuelcell-modal input[name="t_capacity"]')?.value;

  if (!fuelcell_id || !fuelcell_name) {
    alert("연료전지 ID와 연료전지 이름은 필수입니다.");
    return;
  }

  const address = `${address_main} ${address_detail}`.trim();

  const data = {
    fuelcell_id,
    fuelcell_name,
    address,
    install_date,
    reg_date,
    powerplant_id,
    e_capacity,
    t_capacity,
  };

  console.group('연료전지 수정 디버깅');
  // console.log('전송할 데이터:', data);

  fetch("js/setting/update_fuelcell.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(response => {
    // console.log('서버 응답 상태:', {
    //   status: response.status,
    //   statusText: response.statusText,
    //   ok: response.ok
    // });
    return response.text();
  })
  .then(text => {
    // console.log('서버 원본 응답:', text);
    
    if (!text) {
      throw new Error("서버 응답이 비어있습니다");
    }

    try {
      const result = JSON.parse(text);
      // console.log('파싱된 응답:', result);
      
      if (result.debug_info) {
        console.group('서버 디버그 정보');
        // console.log(result.debug_info);
        console.groupEnd();
      }

      if (result.success) {
        alert("연료전지가 성공적으로 수정되었습니다.");
        updateAllTables();
        modalSW("#fuelcell-modal", "close");
        resetFuelcellForm();
      } else {
        console.error('서버 오류:', result.error);
        if (result.error_details) {
          console.error('상세 오류 정보:', result.error_details);
        }
        alert("연료전지 수정에 실패했습니다:\n" + result.error);
      }
    } catch (e) {
      console.error('JSON 파싱 오류:', e);
      console.error('파싱 시도한 텍스트:', text);
      alert("서버 응답을 처리하는 중 오류가 발생했습니다.");
    }
  })
  .catch(error => {
    console.error('네트워크 오류:', error);
    alert("오류가 발생했습니다: " + error.message);
  })
  .finally(() => {
    console.groupEnd();
  });
}