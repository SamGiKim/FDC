// setting_common.js
// 공통적으로 사용되는 발전소, 연료전지 목록 불러오는 export용 함수 페이지
// 발전소, 연료전지, 그룹 등의 데이터 표시 로직도 공통으로 관리 

// let selectedRows = [];
// export const getSelectedRows = () => selectedRows;
// export const clearSelectedRows = () => { selectedRows = []; };

export const selectedRowsMap = new Map();

export const getSelectedRows = (tableSelector) => selectedRowsMap.get(tableSelector) || [];
export const clearSelectedRows = (tableSelector) => { 
    selectedRowsMap.set(tableSelector, []); 
};

/*************************모달*****************************/
export function modalSW(e, doing) {
  const modal = document.querySelector(e);
  
  if (doing === "open") {
    if (e === '#fuelcell-modal') {
      const powerplantSelect = modal.querySelector(".powerplant-select");
      const modalTitle = modal.querySelector("#fuelcell-modal-title");
      
      if (modalTitle.textContent === "연료전지 추가") {
        powerplantSelect.innerHTML = '';
        fetchPowerplantOptions(powerplantSelect, null);
      }
    } 
    else if (e === '#user-modal') {
      console.log("사용자 모달 열기");
      // updateUserModalPowerplantList 호출 제거 (resetUserForm에서 처리)
    }
    
    modal.showModal();
    resetModalFields(e);  // showModal 후에 resetModalFields 호출
  }
  if (doing === "close") {
    modal.close();
    resetModalFields(e);
  }

  // 기존 이벤트 리스너 제거
  const oldListener = modal._clickListener;
  if (oldListener) {
    modal.removeEventListener("click", oldListener);
  }

  // 새 이벤트 리스너 등록
  const newListener = (event) => {
    if (event.target === event.currentTarget) {
      modal.close();
      resetModalFields(e);
    }
  };
  modal.addEventListener("click", newListener);
  modal._clickListener = newListener;
}

// window 객체에 modalSW 함수 추가
window.modalSW = modalSW;

// 모달 필드 초기화 함수
function resetModalFields(modalSelector) {
  switch (modalSelector) {
    case "#user-modal":
      resetUserForm();
      break;
    case "#powerplant-modal":
      resetPowerplantForm();
      break;
    case "#fuelcell-modal":
      resetFuelcellForm();
      break;
    case "#group-modal":
      resetFuelcellGroupForm();
      break;
    default:
      break;
  }
}

// 각 모달의 필드 초기화 함수는 여기서 정의
export function resetUserForm() {
  // 기존 필드 초기화
  const userName = document.querySelector('#user-modal input[name="user_name"]');
  if (userName) userName.value = "";
  const accountId = document.querySelector('#user-modal input[name="account_id"]');
  if (accountId) accountId.value = "";
  const email = document.querySelector('#user-modal input[name="email"]');
  if (email) email.value = "";
  const phone = document.querySelector('#user-modal input[name="phone"]');
  if (phone) phone.value = "";
  const activationStatus = document.querySelector('#user-modal input[name="activation_status"]');
  if (activationStatus) activationStatus.checked = false;
  const role = document.querySelector('#user-modal select[name="role"]');
  if (role) role.value = "LocalAdmin";

  // 발전소 목록 업데이트
  updateUserModalPowerplantList();

  // 그룹 데이터만 초기화
  const groupContainer = document.getElementById('group-container');
  if (groupContainer) {
    groupContainer.dataset.currentGroups = '[]';
  }

  // 그룹 목록 초기 메시지 설정
  const groupTableList = document.querySelector("#group-table-list");
  if (groupTableList) {
    groupTableList.innerHTML = `
      <tr>
        <td colspan="2" class="text-center text-muted">
          <i class="fas fa-info-circle me-2"></i>발전소를 선택하세요
        </td>
      </tr>
    `;
  }
}

// 사용자 모달용 발전소 목록 업데이트 함수
export async function updateUserModalPowerplantList() {
  try {
    console.log("발전소 목록 가져오기 시작");
    const powerplants = await fetchPowerplantList();
    
    const listContainer = document.querySelector("#powerplant-table-list");
    if (!listContainer) {
      console.error("발전소 목록 컨테이너를 찾을 수 없습니다");
      return;
    }
    
    // 기존 내용 초기화
    listContainer.innerHTML = '';
    
    // 발전소 목록 생성
    powerplants.forEach(powerplant => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="checkbox" class="user-modal-powerplant-checkbox" value="${powerplant.powerplant_id}"></td>
        <td>${powerplant.powerplant_name}</td>
      `;
      listContainer.appendChild(row);
    });

    // 체크박스 이벤트 리스너 추가
    const checkboxes = listContainer.querySelectorAll('.user-modal-powerplant-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', async function(e) {
        const groupTableList = document.querySelector("#group-table-list");
        
        if (this.checked) {
          try {
            const response = await fetch(`js/setting/get_groups_by_powerplant.php?powerplant_id=${this.value}`);
            const data = await response.json();
            
            if (data.success && Array.isArray(data.groups)) {
              // 그룹 목록만 업데이트
              if (data.groups.length > 0) {
                groupTableList.innerHTML = data.groups.map(group => `
                  <tr>
                    <td><input type="checkbox" class="group-checkbox" value="${group.group_id}"></td>
                    <td>${group.group_name}</td>
                  </tr>
                `).join('');
              } else {
                groupTableList.innerHTML = `
                  <tr>
                    <td colspan="2" class="text-center text-muted">
                      <i class="fas fa-info-circle me-2"></i>등록된 그룹이 없습니다
                    </td>
                  </tr>
                `;
              }
            }
          } catch (error) {
            console.error("그룹 가져오기 오류:", error);
            groupTableList.innerHTML = `
              <tr>
                <td colspan="2" class="text-center text-danger">
                  <i class="fas fa-exclamation-circle me-2"></i>그룹 목록을 불러오는데 실패했습니다
                </td>
              </tr>
            `;
          }
        } else {
          // 체크 해제시 그룹 목록만 초기화
          groupTableList.innerHTML = `
            <tr>
              <td colspan="2" class="text-center text-muted">
                <i class="fas fa-info-circle me-2"></i>발전소를 선택하세요
              </td>
            </tr>
          `;
        }
      });
    });

  } catch (error) {
    console.error("발전소 목록 업데이트 중 오류 발생:", error);
  }
}

// 발전소 폼 초기화 함수
export function resetPowerplantForm() {
  // 기존 필드 초기화
  const powerplantId = document.querySelector('#powerplant-modal input[name="powerplant_id"]');
  if (powerplantId) {
    powerplantId.value = "";
    powerplantId.readOnly = false;  // 읽기 전용 해제
    powerplantId.classList.remove('readonly-input');  // 클래스 제거
  }
  
  const powerplantName = document.querySelector('#powerplant-modal input[name="powerplant_name"]');
  if (powerplantName) powerplantName.value = "";
  
  const regDate = document.querySelector('#powerplant-modal input[name="reg_date"]');
  if (regDate) regDate.value = "";
  
  const addressMain = document.querySelector('#powerplant-modal input[name="address_main"]');
  if (addressMain) addressMain.value = "";
  
  const addressDetail = document.querySelector('#powerplant-modal input[name="address_detail"]');
  if (addressDetail) addressDetail.value = "";

  // 모달 타이틀과 버튼 텍스트 초기화
  const modalTitle = document.getElementById("powerplant-modal-title");
  if (modalTitle) modalTitle.textContent = "발전소 추가";
  
  const confirmBtn = document.getElementById("powerplant-modal-confirm-btn");
  if (confirmBtn) confirmBtn.textContent = "추가";
}

// 연료전지 폼 초기화 함수
export function resetFuelcellForm() {
  // 기존 필드 초기화
  const fuelcellId = document.querySelector('#fuelcell-modal input[name="fuelcell_id"]');
  if (fuelcellId) {
    fuelcellId.value = "";
    fuelcellId.readOnly = false;  // 읽기 전용 해제
    fuelcellId.classList.remove('readonly-input');  // 클래스 제거
  }

  const fuelcellName = document.querySelector('#fuelcell-modal input[name="fuelcell_name"]');
  if (fuelcellName) fuelcellName.value = "";
  
  const addressMain = document.querySelector('#fuelcell-modal input[name="address_main"]');
  if (addressMain) addressMain.value = "";
  
  const addressDetail = document.querySelector('#fuelcell-modal input[name="address_detail"]');
  if (addressDetail) addressDetail.value = "";
  
  const installDate = document.querySelector('#fuelcell-modal input[name="install_date"]');
  if (installDate) installDate.value = "";
  
  const regDate = document.querySelector('#fuelcell-modal input[name="reg_date"]');
  if (regDate) regDate.value = "";
  
  const powerplantId = document.querySelector('#fuelcell-modal select[name="powerplant_id"]');
  if (powerplantId) powerplantId.value = "";
  
  const eCapacity = document.querySelector('#fuelcell-modal input[name="e_capacity"]');
  if (eCapacity) eCapacity.value = "";
  
  const tCapacity = document.querySelector('#fuelcell-modal input[name="t_capacity"]');
  if (tCapacity) tCapacity.value = "";

  // 모달 타이틀과 버튼 텍스트 초기화
  const modalTitle = document.getElementById("fuelcell-modal-title");
  if (modalTitle) modalTitle.textContent = "연료전지 추가";
  
  const confirmBtn = document.getElementById("fuelcell-modal-confirm-btn");
  if (confirmBtn) confirmBtn.textContent = "추가";
}

// 연료전지 그룹 폼 초기화 함수
export function resetFuelcellGroupForm() {
  const groupId = document.querySelector('#group-modal input[name="group_id"]');
  if (groupId) groupId.value = "";
  const groupName = document.querySelector(
    '#group-modal input[name="group_name"]'
  );
  if (groupName) groupName.value = "";
  const regDate = document.querySelector('#group-modal input[name="reg_date"]');
  if (regDate) regDate.value = "";

  // 총전기발전량 초기화
  const totalECapacity = document.querySelector(
    "#group-modal .total-e-capacity"
  );
  if (totalECapacity) totalECapacity.textContent = "0 kW";

  // 총열발전량 초기화
  const totalTCapacity = document.querySelector(
    "#group-modal .total-t-capacity"
  );
  if (totalTCapacity) totalTCapacity.textContent = "0 kW";

  // 연료전지 목록 체크박스 초기화
  const fuelcellCheckboxes = document.querySelectorAll(
    '#group-modal .fuelcell-list input[type="checkbox"]'
  );
  fuelcellCheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // 첫 번째 발전소에 맞게 연료전지 목록 업데이트
  const powerplantSelect = document.querySelector(
    "#group-modal .powerplant-select"
  );
  if (powerplantSelect) {
    powerplantSelect.selectedIndex = 0; // 첫 번째 발전소 선택
    const firstPowerplantId = powerplantSelect.value;
    updateFuelcellList(firstPowerplantId); // 연료전지 목록 업데이트
  }
}




/************************************************************/
// 체크박스 공통 함수
// 테이블별 선택된 행을 관리하는 Map 객체

// 체크박스 공통 함수 수정
export function addCheckboxListeners(tableSelector) {
  const table = document.querySelector(tableSelector);
  if (!table) return;

  // 해당 테이블의 선택된 행 배열이 없으면 초기화
  if (!selectedRowsMap.has(tableSelector)) {
    selectedRowsMap.set(tableSelector, []);
  }

  const checkboxes = table.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const row = e.target.closest('tr');
      const selectedRows = selectedRowsMap.get(tableSelector);
      
      if (row) {
        if (e.target.checked) {
          if (!selectedRows.includes(row)) {
            selectedRows.push(row);
          }
        } else {
          const index = selectedRows.indexOf(row);
          if (index > -1) {
            selectedRows.splice(index, 1);
          }
        }
        console.log(`Selected Rows for ${tableSelector}:`, selectedRows.length);
      }
    });
  });
}

// 선택된 행 확인 함수 수정
export function validateSingleSelection(tableSelector) {
  const selectedRows = selectedRowsMap.get(tableSelector) || [];
  if (selectedRows.length !== 1) {
    alert("수정할 항목을 하나만 선택하세요.");
    return false;
  }
  return true;
}

// 선택된 행 확인 함수 추가
export function getCheckedRows(tableSelector) {
  const table = document.querySelector(tableSelector);
  if (!table) return [];
  
  return Array.from(table.querySelectorAll('tr')).filter(row => 
    row.querySelector('input[type="checkbox"]:checked')
  );
}

// 삭제 버튼 클릭 시 체크 확인
export function validateDeleteSelection(tableSelector) {
  const checkedRows = getCheckedRows(tableSelector);
  if (checkedRows.length === 0) {
    alert("삭제할 항목을 선택하세요.");
    return false;
  }
  return true;
}





//삭제 모달
//-----------------------------------------------------------------------------------//
// 1. 삭제 컨텍스트 관리 
let currentDeleteContext = null;

// 2. 삭제 모달 열기 함수
export function openDeleteModal(table, selectedRows, deleteFunction) {
  // selectedRows 배열의 유효성을 먼저 확인
  if (!Array.isArray(selectedRows)) {
    console.error("selectedRows is not an array");
    return false;
  }

  // 실제로 체크된 행이 있는지 확인
  const checkedRows = selectedRows.filter(row => 
    row.querySelector('input[type="checkbox"]:first-of-type').checked
  );

  if (checkedRows.length > 0) {
    // 현재 삭제 컨텍스트 저장
    currentDeleteContext = {
      table,  // 여기서 어떤 위젯인지 저장됨 ("users", "powerplants", "fuelcells" 등)
      deleteFunction
    };

    const deleteModal = document.getElementById("delete-modal");
    const confirmButton = document.querySelector("#confirm-delete");

    // 모달과 버튼에 현재 위젯 정보 저장
    deleteModal.dataset.delete = table;
    confirmButton.dataset.widget = table;
    
    modalSW("#delete-modal", "open");
    
    // 삭제 확인 버튼에 이벤트 리스너 연결
    confirmButton.onclick = function() {
      if (currentDeleteContext && currentDeleteContext.deleteFunction) {
        currentDeleteContext.deleteFunction();
        currentDeleteContext = null;

        // 모달이 닫힐 때 data 속성 초기화
        deleteModal.removeAttribute('data-delete');
        confirmButton.removeAttribute('data-widget');
      }
    };
    
    return true;
  } else {
    alert("삭제할 항목을 선택하세요.");
    return false;
  }
}

//-----------------------------------------------------------------------------------//
// 이벤트 시스템 구현(데이터가 변경될 때 모든 관련 위젯을 업데이트)
export const EventBus = {
  listeners: {},
  
  // 이벤트 구독
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },
  
  // 이벤트 발생
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
};

// 모든 테이블 목록 업데이트 함수
export function updateAllTables() {
  // 데이터 업데이트 시작을 알림
  EventBus.emit('updateStart');
  
  // 먼저 기본 데이터를 가져옵니다
  Promise.all([
    fetchUserData(),
    fetchPowerplantData(),
    fetchFuelcellData(),
    fetchFuelcellGroupData()
  ])
  .then(() => {
    // 발전소 선택 드롭다운 업데이트
    const powerplantSelects = document.querySelectorAll('.powerplant-select');
    if (powerplantSelects.length > 0) {
      powerplantSelects.forEach(select => {
        fetchPowerplantOptions(select).catch(error => {
          console.error('Error updating powerplant options:', error);
        });
      });
    }

    // 연료전지 목록 업데이트
    const fuelcellLists = document.querySelectorAll('.fuelcell-list');
    if (fuelcellLists.length > 0) {
      fuelcellLists.forEach(list => {
        const powerplantId = list.closest('form')?.querySelector('.powerplant-select')?.value;
        if (powerplantId) {
          fetchFuelcellList(powerplantId).catch(error => {
            console.error('Error updating fuelcell list:', error);
          });
        }
      });
    }

    // 데이터 업데이트 완료를 알림
    EventBus.emit('updateComplete');
  })
  .catch(error => {
    console.error('Error updating tables:', error);
    EventBus.emit('updateError', error);
  });
}














////////////////////////////////////////////////////////////////////////////////////////
// 발전소 조회

// 발전소 데이터
export function fetchPowerplantData(query = "") {
  fetch("js/setting/get_powerplants.php?" + query)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        console.error("Error fetching powerplant data:", data.error);
        return;
      }
      populatePowerplantTable(data);
    })
    .catch((error) => console.error("Error fetching powerplant data:", error));
}

// 발전소 목록 가져오기
export async function fetchPowerplantList() {
  const response = await fetch('js/setting/get_powerplants.php');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export function populatePowerplantTable(powerplants) {
  const tableBody = document.querySelector(".powerplants_table");
  tableBody.innerHTML = "";

  powerplants.forEach((powerplant) => {
    const row = createPowerplantRow(powerplant);
    tableBody.appendChild(row);
  });

  selectedRowsMap.set('.powerplants_table', []); 
  addCheckboxListeners(".powerplants_table");
}

function createPowerplantRow(powerplant) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="checkbox"></td>
    <td>${powerplant.powerplant_id || ""}</td>
    <td>${powerplant.powerplant_name || ""}</td>
    <td>${powerplant.address || ""}</td>
    <td>${powerplant.reg_date || ""}</td>
    <td>${powerplant.fuelcell_count || ""}</td>
    <td>${powerplant.total_e_capacity ? `${powerplant.total_e_capacity}kW` : ""}</td>
    <td>${powerplant.total_t_capacity ? `${powerplant.total_t_capacity}kW` : ""}</td>
  `;
  return row;
}

// 발전소 관련 함수들을 하나로 통합
export async function fetchPowerplantOptions(selectElement, selectedValue = null) {
  try {
    const response = await fetch("js/setting/get_powerplants.php");
    const data = await response.json();

    if (selectElement) {
      // 추가 모드일 때만 "발전소 선택" 옵션 추가
      selectElement.innerHTML = selectedValue ? '' : '<option value="">발전소 선택</option>';
      
      data.forEach(plant => {
        const option = document.createElement("option");
        option.value = plant.powerplant_id;
        option.textContent = plant.powerplant_name;
        if (plant.powerplant_id === selectedValue) {
          option.selected = true;
        }
        selectElement.appendChild(option);
      });
    }

    return data;
  } catch (error) {
    console.error("발전소 목록 로드 오류:", error);
    throw error;
  }
}

// 발전소 선택 이벤트 리스너 추가 함수
export function attachPowerplantSelectListener() {
  const powerplantSelect = document.querySelector('.powerplant-select');
  powerplantSelect.addEventListener('change', function() {
    updateFuelcellList(this.value);
    // 발전소가 변경되면 기존 선택된 연료전지들 초기화
    document.querySelector('#group-modal input[name="e_group_capacity"]').value = "0.00";
    document.querySelector('#group-modal input[name="t_group_capacity"]').value = "0.00";
  });
}

// 연료전지 목록 업데이트 함수 수정
export async function updateFuelcellList(powerplantId) {
  const tbody = document.querySelector('#group-modal .fuelcell-list');
  
  try {
    const response = await fetch(`js/setting/get_fuelcells.php?powerplant_id=${powerplantId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch fuelcell list');
    }
    
    const fuelcells = await response.json();
    console.log('Fetched fuelcells:', fuelcells); // 디버깅용
    
    tbody.innerHTML = fuelcells
      .filter(fc => fc.powerplant_id === powerplantId)
      .map(fc => `
        <tr>
          <td>
            <input type="checkbox" 
                   value="${fc.fuelcell_id}" 
                   data-e-capacity="${fc.e_capacity}" 
                   data-t-capacity="${fc.t_capacity}">
          </td>
          <td>${fc.fuelcell_name}</td>
        </tr>
      `).join('');

    // 선택 상태 초기화
    selectedRowsMap.set('#group-modal .fuelcell-list', []);
    
    // 체크박스 리스너 추가
    const checkboxes = tbody.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const checkedRows = Array.from(tbody.querySelectorAll('input[type="checkbox"]:checked'))
          .map(cb => cb.closest('tr'));
        selectedRowsMap.set('#group-modal .fuelcell-list', checkedRows);
        
        // 용량 계산 업데이트
        updateCapacitySum();
      });
    });

    attachFuelcellListListeners();
    
  } catch (error) {
    console.error('Error fetching fuelcell list:', error);
    tbody.innerHTML = '<tr><td colspan="2">연료전지 목록을 불러오는데 실패했습니다.</td></tr>';
    selectedRowsMap.set('#group-modal .fuelcell-list', []);
  }
}

export async function updatePowerplantList() {
  try {
    const powerplants = await fetchPowerplantList();
    const listContainer = document.querySelector("#powerplant-table-list");
    if (!listContainer) {
      console.error("Powerplant list container element not found");
      return;
    }
    
    listContainer.innerHTML = "";
    selectedRowsMap.set('#powerplant-table-list', []); // 목록 초기화 시 선택 상태도 초기화

    powerplants.forEach((powerplant) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" value="${powerplant.powerplant_id}" onclick="toggleGroups(this)"></td>
        <td>${powerplant.powerplant_name}</td>
      `;
      listContainer.appendChild(row);
    });

    setupPowerplantChangeListener();
  } catch (error) {
    console.error("Error fetching powerplant list:", error);
  }
}

// 발전소 체크박스 이벤트 리스너 설정
function setupPowerplantChangeListener() {
  const tableList = document.querySelector("#powerplant-table-list");
  if (!tableList) return;

  tableList.addEventListener("change", async function (e) {
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
      // 체크박스 상태 저장
      const checkedBoxes = Array.from(
        tableList.querySelectorAll('input[type="checkbox"]:checked')
      );
      selectedRowsMap.set('#powerplant-table-list', checkedBoxes.map(cb => cb.closest('tr')));

      const checkedPowerplantIds = checkedBoxes.map(checkbox => checkbox.value);
      
      const groupPromises = checkedPowerplantIds.map(id => 
        fetchFuelcellGroupListByPowerplant(id)
      );
      const groupLists = await Promise.all(groupPromises);
      const allGroups = groupLists.flat();
      
      updateFuelcellGroupList(allGroups);
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////
// 그룹 관리
// 그룹 테이블 데이터 표시 함수
function populateGroupTable(data) {
  const tableBody = document.getElementById('group_manage_table');
  if (!tableBody) return;

  let html = '';
  data.forEach(group => {
    html += `
      <tr data-group-id="${group.group_id}">
        <td><input type="checkbox"></td>
        <td>${group.group_id || ''}</td>
        <td>${group.group_name || ''}</td>
        <td>${group.reg_date || ''}</td>
        <td>${group.fuelcell_count || 0}</td>
        <td>${group.e_group_capacity || 0}kW</td>
        <td>${group.t_group_capacity || 0}kW</td>
        <td>${group.description || ''}</td>
      </tr>
    `;
  });
  
  tableBody.innerHTML = html;
}

// setting_common.js의 fetchGroupData 함수 수정
export async function fetchGroupData(query = '') {
  try {
    const response = await fetch(`./js/setting/get_groups.php${query ? '?' + query : ''}`);
    const data = await response.json();
    
    if (data.success) {
      // 그룹 관리 테이블 업데이트
      populateGroupTable(data.groups);
    } else {
      throw new Error(data.error || '그룹 데이터를 불러오는데 실패했습니다.');
    }
  } catch (error) {
    console.error('Error fetching group data:', error);
    alert('그룹 데이터를 불러오는데 실패했습니다: ' + error.message);
  }
}

// DOMContentLoaded 이벤트에서 호출
document.addEventListener("DOMContentLoaded", function () {
  // 초기 데이터 로드
  fetchGroupData();  // 기존의 fetchFuelcellGroupData 대신 사용
  
  // // 각 기능별 이벤트 리스너 초기화
  // initUpdateButton();
  // initCheckboxListeners();
  // initConfirmButton();
  
  // 공통 이벤트 리스너 초기화
  // addEventListeners();
});

// 검색 함수 수정
function searchGroups() {
  const selectedValue = document.getElementById('powerplant-search-select').value;
  const searchInput = document.getElementById('powerplant-search-input').value;
  let query = '';

  if (searchInput) {
    query = `${selectedValue}=${encodeURIComponent(searchInput)}`;
  }

  fetchGroupData(query);
}

// 검색 초기화 함수 수정
function resetGroupSearch() {
  document.getElementById('powerplant-search-input').value = '';
  document.getElementById('powerplant-search-select').value = 'group_id';
  fetchGroupData();
}

////////////////////////////////////////////////////////////////////////////////////////
// 연료전지/그룹 연결 관리
//연료전지그룹(fuelcell_groups)  목록 불러오기
export function fetchFuelcellGroupList(accountId) {
  return fetch(`js/setting/get_groups_by_powerplant.php?account_id=${encodeURIComponent(accountId)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch(error => {
      console.error("Error fetching fuelcell group list:", error);
      throw error;
    });
}

export function populateFuelcellGroupList(groups, userPowerplants) {
  const listContainer = document.querySelector("#group-table-list");
  if (!listContainer) {
    console.error("Fuelcell group list container element not found");
    return;
  }
  listContainer.innerHTML = ""; // 기존 내용을 지우기

  groups.forEach((group) => {
    if (userPowerplants.includes(group.powerplant_name)) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" value="${group.group_id}" checked></td>
        <td>${group.group_name}</td>
      `;
      listContainer.appendChild(row);
    }
  });
}

export async function fetchFuelcellGroupData(query = '') {
  console.log('연료전지/그룹 연결 데이터 가져오기 시작');
  try {
      const response = await fetch("js/setting/get_fuelcell_groups.php?" + query);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('연료전지/그룹 연결 데이터:', data);
      populateFuelcellGroupTable(data);
  } catch (error) {
      console.error("Error fetching fuelcell group data:", error);
  }
}

// 그룹목록 가져오기 
export async function fetchFuelcellGroupListByPowerplant(powerplantId) {
  const response = await fetch(`js/setting/get_groups_by_powerplant.php?powerplant_id=${powerplantId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
} 

function populateFuelcellGroupTable(fuelcellGroups) {
  const tableBody = document.querySelector(".fuelcell_groups_table");
  tableBody.innerHTML = ""; // 기존 내용을 지우기

  fuelcellGroups.forEach((group) => {
    const row = createFuelcellGroupRow(group);
    tableBody.appendChild(row);
  });

  // 테이블이 갱신된 후에 체크박스 리스너를 다시 추가
  clearSelectedRows('.fuelcell_groups_table');  
  addCheckboxListeners('.fuelcell_groups_table');
}

function createFuelcellGroupRow(group) {
  const row = document.createElement("tr");
  
  // 연료전지 ID와 이름 안전하게 처리
  const fuelcellIds = group.fuelcell_ids || [];
  const fuelcells = group.fuelcells || '';
  
  // 디버깅용
  console.log('Group data:', {
    group_id: group.group_id,
    powerplant_id: group.powerplant_id,
    fuelcell_ids: fuelcellIds,
    fuelcells: fuelcells
  });

  row.innerHTML = `
    <td>${group.group_id || ''}</td>
    <td data-powerplant-id="${group.powerplant_id || ''}">${group.powerplant_name || ''}</td>
    <td>${group.group_name || ''}</td>
    <td title="${fuelcells}" data-fuelcell-ids="${Array.isArray(fuelcellIds) ? fuelcellIds.join(',') : ''}">${fuelcells}</td>
    <td>${group.reg_date || ''}</td>
    <td>${group.e_group_capacity || '0'}kW</td>
    <td>${group.t_group_capacity || '0'}kW</td>
  `;

  return row;
}


// updateFuelcellGroupList 함수 추가 및 export
export function updateFuelcellGroupList(groups) {
  const groupContainer = document.getElementById('group-container');
  const listContainer = document.querySelector("#group-table-list");
  
  // 현재 표시된 그룹과 동일한 데이터라면 업데이트 하지 않음
  const currentGroupsStr = groupContainer.dataset.currentGroups;
  if (currentGroupsStr && JSON.stringify(groups) === currentGroupsStr) {
    return;
  }

  if (!listContainer) {
    console.error("Group list container not found");
    return;
  }

  listContainer.innerHTML = "";

  if (!groups || groups.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="2" class="text-center text-muted">
        <i class="fas fa-info-circle me-2"></i>등록된 그룹이 없습니다
      </td>
    `;
    listContainer.appendChild(row);
    return;
  }

  groups.forEach(group => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <input type="checkbox" 
               value="${group.group_id}" 
               data-powerplant-id="${group.powerplant_id}">
      </td>
      <td>${group.group_name}</td>
    `;
    listContainer.appendChild(row);
  });
}

// toggleGroups 함수 수정
export function toggleGroups(checkbox) {
  const groupContainer = document.getElementById('group-container');
  
  // 현재 체크된 모든 체크박스 해제 (다중 선택 방지)
  document.querySelectorAll('#powerplant-table-list input[type="checkbox"]').forEach(cb => {
    if (cb !== checkbox) cb.checked = false;
  });

  if (checkbox.checked) {
    groupContainer.style.display = 'block';
    const powerplantId = checkbox.value;
    
    console.log('Fetching groups for powerplant:', powerplantId);
    
    fetch(`js/setting/get_groups_by_powerplant.php?powerplant_id=${powerplantId}`)
      .then(response => response.json())
      .then(data => {
        console.log('Received data:', data);
        if (data.success && Array.isArray(data.groups)) {
          // 데이터를 상태로 저장
          groupContainer.dataset.currentGroups = JSON.stringify(data.groups);
          updateFuelcellGroupList(data.groups);
        } else {
          console.error('Invalid response format:', data);
          groupContainer.dataset.currentGroups = '[]';
          updateFuelcellGroupList([]);
        }
      })
      .catch(error => {
        console.error("Error fetching group list:", error);
        groupContainer.dataset.currentGroups = '[]';
        updateFuelcellGroupList([]);
      });
  } else {
    groupContainer.style.display = 'none';
  }
}

// window 객체에 toggleGroups 함수 추가
window.toggleGroups = toggleGroups;


////////////////////////////////////////////////////////////////////////////////////////
// 연료전지 조회
//연료전지(fuelcell) 목록 불러오기(setting_fuelcell_group.js, setting_user.js 로 보낸다)
export function populateFuelcellList(fuelcells) {
  const listContainer = document.querySelector(".fuelcell-list");
  if (!listContainer) {
    console.error("Fuelcell list container element not found");
    return;
  }
  listContainer.innerHTML = ""; // 기존 내용을 지우기

  fuelcells.forEach((fuelcell) => {
    const listItem = document.createElement("tr");
    listItem.innerHTML = `
      <td><input type="checkbox" value="${fuelcell.fuelcell_id}" data-e-capacity="${fuelcell.e_capacity}" data-t-capacity="${fuelcell.t_capacity}"></td>
      <td>${fuelcell.fuelcell_name}</td>
    `;
    listContainer.appendChild(listItem);
  });

  // 체크박스 선택 시 합계 계산
  attachCheckboxListeners();
}

export function attachCheckboxListeners() {
  document
    .querySelectorAll('.fuelcell-list input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", calculateTotalCapacity);
    });
}

export async function fetchFuelcellData(query = "") {
    console.log('연료전지 데이터 가져오기 시작');
    try {
        const response = await fetch("js/setting/get_fuelcells.php?" + query);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('연료전지 데이터:', data);
        populateFuelcellTable(data);
    } catch (error) {
        console.error("Error fetching fuelcell data:", error);
    }
  }

// 테이블에 연료전지 데이터를 채우는 함수
export function populateFuelcellTable(fuelcells) {
  const tableBody = document.querySelector(".fuelcell_table");
  if (!tableBody) {
    console.error("Fuelcell table body not found");
    return;
  }

  tableBody.innerHTML = "";

  fuelcells.forEach((fuelcell) => {
    const row = createFuelcellRow(fuelcell);
    tableBody.appendChild(row);
  });

  // 선택 상태 초기화
  selectedRowsMap.set('.fuelcell_table', []);
  addCheckboxListeners(".fuelcell_table");
}

// 연료전지 데이터를 이용해 테이블 행을 생성하는 함수
function createFuelcellRow(fuelcell) {
    // 디버깅용 로그 추가
    console.log('연료전지 데이터:', fuelcell);
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="checkbox"></td>
    <td>${fuelcell.fuelcell_id || ""}</td>
    <td>${fuelcell.fuelcell_name || ""}</td>
    <td>${fuelcell.powerplant_id || "미지정"}</td>
    <td>${fuelcell.group_id || "미지정"}</td>
    <td>${fuelcell.address || ""}</td>
    <td>${fuelcell.install_date || ""}</td>
    <td>${fuelcell.reg_date || ""}</td>
    <td>${fuelcell.e_capacity ? `${fuelcell.e_capacity}kW` : ""}</td>
    <td>${fuelcell.t_capacity ? `${fuelcell.t_capacity}kW` : ""}</td>
  `;
  return row;
}

export async function fetchFuelcellList(powerplantId) {
  return fetch(
    `js/setting/get_fuelcells_by_powerplant.php?powerplant_id=${powerplantId}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// 용량 합계 계산 함수 추가
export function updateCapacitySum() {
  const checkedRows = selectedRowsMap.get('#group-modal .fuelcell-list') || [];
  let totalE = 0;
  let totalT = 0;

  checkedRows.forEach(row => {
    const checkbox = row.querySelector('input[type="checkbox"]');
    if (checkbox) {
      totalE += parseFloat(checkbox.getAttribute('data-e-capacity')) || 0;
      totalT += parseFloat(checkbox.getAttribute('data-t-capacity')) || 0;
    }
  });

  document.querySelector('#group-modal input[name="e_group_capacity"]').value = totalE.toFixed(2);
  document.querySelector('#group-modal input[name="t_group_capacity"]').value = totalT.toFixed(2);
}

// 체크박스 이벤트 리스너 추가 함수
export function attachFuelcellListListeners() {
  const checkboxes = document.querySelectorAll('#group-modal .fuelcell-list input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateCapacitySum);
  });
}







///////////////////////////////////////////////////////////////////////////////

// 사용자 조회
export function fetchUserData(query = "") {
  fetch("js/setting/get_users.php?" + query)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text(); // JSON.parse를 직접 처리하기 위해 text()로 변경
    })
    .then((text) => {
      // console.log("Raw response:", text); // 원시 응답 로깅
      try {
        const data = JSON.parse(text);
        if (data.error) {
          console.error("Error fetching user data:", data.error);
          return;
        }
        populateUserTable(data);
      } catch (e) {
        console.error("JSON parsing error:", e);
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));
}


function populateUserTable(users) {
  const tableBody = document.querySelector(".users-table");
  tableBody.innerHTML = ""; // 기존 내용을 지우기

  users.forEach((user) => {
    const row = createUserRow(user);
    tableBody.appendChild(row);
  });

  // selectedRows = []; 삭제하고
  selectedRowsMap.set('.users-table', []); // 이렇게 수정
  addCheckboxListeners(".users-table"); // selectedRows 파라미터 제거
}

// 동적으로 데이터 읽어와서 목록 만들기
function createUserRow(user) {
  const row = document.createElement("tr");
  const powerplants = user.powerplants
    ? user.powerplants.split(", ").join('<span class="device"></span>')
    : "";

  row.innerHTML = `
    <td><input type="checkbox"></td>
    <td>${user.account_id || ""}</td>
    <td><input type="checkbox" ${
      user.activation_status == 1 ? "checked" : ""
    }></td>
    <td>${user.role || ""}</td>
    <td>${powerplants}</td>
    <td>${user.last_login || ""}</td>
    <td>${user.reg_date || ""}</td>
  `;

    // 데이터 속성으로 email과 phone 추가
    row.dataset.userName = user.user_name || "";
    row.dataset.email = user.email || "";
    row.dataset.phone = user.phone || "";

  return row;
}