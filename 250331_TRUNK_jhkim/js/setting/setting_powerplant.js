// setting_powerplant.js
import {
  modalSW,
  addCheckboxListeners,
  attachFuelcellListListeners,
  updateCapacitySum,
  resetPowerplantForm,
  openDeleteModal,
  updateAllTables,
  fetchPowerplantData,
  validateSingleSelection,
  validateDeleteSelection,
  getCheckedRows,
  selectedRowsMap 
} from "./setting_common.js";


/*************DomContentLoaded*********************/
document.addEventListener("DOMContentLoaded", function () {
  fetchPowerplantData();
  addEventListeners();
});

/************************ 조회 ***************************/
// setting_common.js

/************************ 검색 ***************************/
function searchPowerplants() {
  const selectedValue = document.getElementById("powerplant-search-select").value;
  const searchInput = document.getElementById("powerplant-search-input").value;
  let query = "";

  if (selectedValue === "powerplant_id") {
    query = "powerplant_id=" + searchInput;
  } else if (selectedValue === "powerplant_name") {
    query = "powerplant_name=" + searchInput;
  }

  fetchPowerplantData(query);
}

/********************* 초기화 ***************************/
function resetPowerplantSearch() {
  document.getElementById('powerplant-search-input').value = '';
  document.getElementById('powerplant-search-select').value = 'powerplant_id';
  fetchPowerplantData();
}

function openAddPowerplantModal() {
  document.getElementById("powerplant-modal-title").textContent = "발전소 추가";
  document.getElementById("powerplant-modal-confirm-btn").textContent = "확인";
  resetPowerplantForm();
  modalSW("#powerplant-modal", "open");
}

/************************ 추가 ***************************/
function addPowerplant() {
  const powerplant_id = document.querySelector('#powerplant-modal input[name="powerplant_id"]').value;
  const powerplant_name = document.querySelector('#powerplant-modal input[name="powerplant_name"]').value;
  const address_main = document.querySelector('#powerplant-modal input[name="address_main"]').value;
  const address_detail = document.querySelector('#powerplant-modal input[name="address_detail"]').value;
  const reg_date = document.querySelector('#powerplant-modal input[name="reg_date"]').value;

  if (!powerplant_id || !powerplant_name) {
    alert("발전소 ID와 발전소 이름은 필수입니다.");
    return;
  }

  const address = `${address_main} ${address_detail}`.trim();

  const data = {
    powerplant_id,
    powerplant_name,
    address,
    reg_date,
  };

  fetch("js/setting/add_powerplants.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((text) => {
      // console.log("서버 응답:", text);
      const result = JSON.parse(text);
      
      if (result.redis_update) {
        // console.log("Redis 업데이트 결과:", result.redis_update);
      }

      if (result.success) {
        alert("발전소가 성공적으로 추가되었습니다.");
        updateAllTables();
        modalSW("#powerplant-modal", "close");
        resetPowerplantForm();
      } else {
        alert("발전소 추가에 실패했습니다: " + result.error);
      }
    })
    .catch((error) => console.error("Error adding powerplant:", error));
}

/********************수정**************************/
// 수정 버튼 클릭 이벤트
document.querySelector('#update-powerplant-btn').addEventListener('click', () => {
  if (validateSingleSelection('.powerplants_table')) {
    const selectedRow = getCheckedRows('.powerplants_table')[0];
    
    const powerplant = {
      powerplant_id: selectedRow.querySelector("td:nth-child(2)").textContent,
      powerplant_name: selectedRow.querySelector("td:nth-child(3)").textContent,
      address: selectedRow.querySelector("td:nth-child(4)").textContent,
      reg_date: selectedRow.querySelector("td:nth-child(5)").textContent,
    };

    // 모달 폼에 데이터 설정
    const powerplantIdInput = document.querySelector('#powerplant-modal input[name="powerplant_id"]');
    powerplantIdInput.value = powerplant.powerplant_id;
    powerplantIdInput.readOnly = true;
    powerplantIdInput.classList.add('readonly-input');

    document.querySelector('#powerplant-modal input[name="powerplant_name"]').value = powerplant.powerplant_name;
    
    const [addressMain, ...addressDetail] = powerplant.address.split(' ');
    document.querySelector('#powerplant-modal input[name="address_main"]').value = addressMain;
    document.querySelector('#powerplant-modal input[name="address_detail"]').value = addressDetail.join(' ');
    
    document.querySelector('#powerplant-modal input[name="reg_date"]').value = powerplant.reg_date;

    // 모달 타이틀과 버튼 텍스트 변경
    document.getElementById("powerplant-modal-title").textContent = "발전소 수정";
    document.getElementById("powerplant-modal-confirm-btn").textContent = "수정";
    
    modalSW("#powerplant-modal", "open");
  }
});

// 발전소 수정 함수
function updatePowerplant() {
  const powerplant_id = document.querySelector('#powerplant-modal input[name="powerplant_id"]').value;
  const powerplant_name = document.querySelector('#powerplant-modal input[name="powerplant_name"]').value;
  const address_main = document.querySelector('#powerplant-modal input[name="address_main"]').value;
  const address_detail = document.querySelector('#powerplant-modal input[name="address_detail"]').value;
  const reg_date = document.querySelector('#powerplant-modal input[name="reg_date"]').value;

  
  // 데이터 확인을 위한 로그 추가
  // console.log("수정할 데이터:", {
  //   powerplant_id,
  //   powerplant_name,
  //   address_main,
  //   address_detail,
  //   reg_date
  // });


  if (!powerplant_id || !powerplant_name) {
    alert("발전소 ID와 발전소 이름은 필수입니다.");
    return;
  }

  const address = `${address_main} ${address_detail}`.trim();

  const data = {
    powerplant_id,
    powerplant_name,
    address,
    reg_date
  };

    // 서버로 보내는 데이터 확인
    // console.log("서버로 보내는 데이터:", JSON.stringify(data));

  fetch("js/setting/update_powerplant.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((text) => {
      // console.log("서버 응답:", text);
      try {
        const result = JSON.parse(text);
        if (result.success) {
          // console.log("Redis 업데이트 결과:", result.redis_update);
          alert("발전소가 성공적으로 수정되었습니다.");
          updateAllTables();
          modalSW("#powerplant-modal", "close");
          resetPowerplantForm();
        } else {
          alert("발전소 수정에 실패했습니다: " + result.error);
        }
      } catch (e) {
        console.error("JSON 파싱 오류:", e);
      }
    })
    .catch((error) => console.error("Error updating powerplant:", error));
}

/********************삭제**************************/
// 삭제 버튼 클릭 이벤트
document.querySelector('.delete-btn[data-delete="powerplants"]').addEventListener('click', () => {
  if (validateDeleteSelection('.powerplants_table')) {
    modalSW("#delete-modal", "open");
    
    // 삭제 확인 버튼에 이벤트 리스너 추가
    const confirmDeleteBtn = document.querySelector('#confirm-delete');
    confirmDeleteBtn.onclick = deleteSelectedPowerplants;
  }
});

function deleteSelectedPowerplants() {
  const checkedRows = getCheckedRows('.powerplants_table');
  
  const deletePromises = checkedRows.map(row => {
    const powerplantId = row.querySelector("td:nth-child(2)").textContent;
    
    return fetch("js/setting/delete_powerplant.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ powerplant_id: powerplantId }),
    })
    .then(async response => {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (!response.ok || !data.success) {
          throw new Error(data.error || '삭제 실패');
        }
        return { success: true, powerplant_id: powerplantId };
      } catch (e) {
        throw new Error(`서버 응답 처리 실패: ${text}`);
      }
    })
    .catch(error => ({
      success: false,
      error: error.message,
      powerplant_id: powerplantId
    }));
  });

  Promise.all(deletePromises)
    .then(results => {
      const failures = results.filter(r => !r.success);
      
      if (failures.length > 0) {
        const errorMessage = failures
          .map(f => `발전소 ${f.powerplant_id}: ${f.error}`)
          .join('\n');
        alert(`삭제 실패:\n${errorMessage}`);
      } else {
        alert("선택한 항목이 성공적으로 삭제되었습니다.");
        updateAllTables();
      }
      modalSW("#delete-modal", "close");
    })
    .catch(error => {
      console.error("삭제 작업 중 오류:", error);
      alert("삭제 중 오류가 발생했습니다: " + error.message);
    });
}




// addEventListeners 함수 정의
function addEventListeners() {
  // 발전소 목록 옵션 로드
  const powerplantSelect = document.querySelectorAll(".powerplant-list");
  powerplantSelect.forEach((select) => fetchPowerplantOptions(select));

  // 체크박스 리스너 추가
  addCheckboxListeners('.powerplants_table');

  // 검색 관련 이벤트 리스너
  document.getElementById("powerplant-search-button").addEventListener("click", searchPowerplants);
  document.getElementById("powerplant-search-reset").addEventListener("click", resetPowerplantSearch);
  
  // 추가 버튼 이벤트 리스너
  const addPowerplantBtn = document.querySelector(".add-powerplant-btn");
  if (addPowerplantBtn) {
    addPowerplantBtn.addEventListener("click", openAddPowerplantModal);
  }

  // 모달 확인 버튼 이벤트 리스너
  const confirmButton = document.querySelector("#powerplant-modal-confirm-btn");
  if (confirmButton) {
    confirmButton.addEventListener("click", function() {
      const modalTitle = document.getElementById("powerplant-modal-title").textContent;
      if (modalTitle === "발전소 추가") {
        addPowerplant();
      } else if (modalTitle === "발전소 수정") {
        updatePowerplant();
      }
    });
  }
}