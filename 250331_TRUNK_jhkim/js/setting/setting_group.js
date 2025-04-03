// 그룹 관리
import {
  modalSW,
  fetchFuelcellData,
  addCheckboxListeners,
  updateCapacitySum,
  attachFuelcellListListeners, 
  updateAllTables,
  fetchPowerplantOptions,
  attachPowerplantSelectListener,
  populateFuelcellList,
  fetchFuelcellList,
  fetchFuelcellGroupData,
  validateSingleSelection,
  validateDeleteSelection,
  getCheckedRows,
  fetchGroupData
} from "./setting_common.js";


let selectedRows = [];

/************************ 조회 ***************************/
// setting_common.js


/************************ 검색 ***************************/
// 그룹 관리 검색
function searchGroups() {
  const selectedValue = document.getElementById('group-search-select').value;
  const searchInput = document.getElementById('group-search-input').value;
  let query = '';

  if (searchInput) {
    query = `${selectedValue}=${encodeURIComponent(searchInput)}`;
  }

  fetchGroupData(query);
}

// 연료전지/그룹 연결 검색
function searchFuelcellGroups() {
  const selectedValue = document.getElementById('group-fuelcell-search-select').value;
  const searchInput = document.getElementById('group-fuelcell-search-input').value;
  let query = '';

  if (searchInput) {
    query = `${selectedValue}=${encodeURIComponent(searchInput)}`;
  }

  fetchFuelcellGroupData(query);
}
/********************* 초기화 ***************************/
// 검색 초기화 함수
function resetGroupSearch() {
  document.getElementById('group-search-input').value = '';
  document.getElementById('group-search-select').value = 'group_id';
  fetchGroupData();
}


// 연료전지/그룹 연결 검색 초기화
function resetFuelcellGroupSearch() {
  document.getElementById('group-fuelcell-search-input').value = '';
  document.getElementById('group-fuelcell-search-select').value = 'group_id';
  fetchFuelcellGroupData();
}

// 이벤트 리스너 초기화 함수 수정
function addEventListeners() {
  // 그룹 관리 검색 이벤트
  const searchButton = document.getElementById('group-search-button');
  if (searchButton) {
    searchButton.removeEventListener('click', searchGroups);
    searchButton.addEventListener('click', searchGroups);
  }

  const resetButton = document.getElementById('group-search-reset');
  if (resetButton) {
    resetButton.removeEventListener('click', resetGroupSearch);
    resetButton.addEventListener('click', resetGroupSearch);
  }

  // 연료전지/그룹 연결 검색 이벤트
  const fuelcellGroupSearchButton = document.getElementById('group-fuelcell-search-button');
  if (fuelcellGroupSearchButton) {
    fuelcellGroupSearchButton.removeEventListener('click', searchFuelcellGroups);
    fuelcellGroupSearchButton.addEventListener('click', searchFuelcellGroups);
  }

  const fuelcellGroupResetButton = document.getElementById('group-fuelcell-search-reset');
  if (fuelcellGroupResetButton) {
    fuelcellGroupResetButton.removeEventListener('click', resetFuelcellGroupSearch);
    fuelcellGroupResetButton.addEventListener('click', resetFuelcellGroupSearch);
  }
}
/************************ 추가 ***************************/
// 그룹 추가 모달 열기
function openAddFuelcellGroupModal() {
  const modal = document.querySelector("#group-modal");
  const modalTitle = modal.querySelector(".modal-title");
  modalTitle.textContent = "그룹 추가";

  // 폼 초기화
  const inputs = modal.querySelectorAll("input, textarea");
  inputs.forEach(input => input.value = "");
  
  // 오늘 날짜를 등록일의 기본값으로 설정
  const today = new Date().toISOString().split('T')[0];
  modal.querySelector('input[name="reg_date"]').value = today;

  modalSW('#group-modal', 'open');
}

// 그룹 추가 실행
async function addFuelcellGroup() {
  try {
    const modal = document.querySelector("#group-modal");
    
    // 폼 데이터 수집
    const formData = {
      group_id: modal.querySelector('input[name="group_id"]').value,
      group_name: modal.querySelector('input[name="group_name"]').value,
      reg_date: modal.querySelector('input[name="reg_date"]').value,
      description: modal.querySelector('textarea[name="description"]').value,
      e_group_capacity: 0,
      t_group_capacity: 0
    };

    // 필수 필드 검증
    if (!formData.group_id || !formData.group_name) {
      alert("그룹 ID와 그룹 이름은 필수 입력 항목입니다.");
      return;
    }

    // API 호출
    const response = await fetch("./js/setting/add_groups.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      alert("그룹이 성공적으로 추가되었습니다.");
      
      // 모달 닫기 전에 데이터 새로고침
      await fetchGroupData();  // 그룹 관리 테이블 새로고침
      
      // 모달 닫기
      modalSW('#group-modal', 'close');
    } else {
      throw new Error(result.error || "그룹 추가 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("Error adding fuelcell group:", error);
    alert("그룹 추가 중 오류가 발생했습니다: " + error.message);
  }
}

/************************ 삭제 ***************************/
// 삭제 버튼 이벤트 리스너 추가
document.querySelector('.delete-btn[data-delete="groups"]').addEventListener('click', async function() {
  const checkedRows = getCheckedRows('.group_manage_table');
  
  if (checkedRows.length === 0) {
    alert("삭제할 그룹을 선택해주세요.");
    return;
  }

  // 삭제 확인 모달 열기
  const confirmed = await new Promise(resolve => {
    const deleteModal = document.querySelector('#delete-modal');
    const confirmBtn = deleteModal.querySelector('#confirm-delete');
    const cancelBtn = deleteModal.querySelector('button[onclick*="close"]');

    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    const cleanup = () => {
      confirmBtn.removeEventListener('click', handleConfirm);
      cancelBtn.removeEventListener('click', handleCancel);
      modalSW('#delete-modal', 'close');
    };

    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
    
    modalSW('#delete-modal', 'open');
  });

  if (!confirmed) return;

  try {
    // 선택된 모든 그룹 ID 수집
    const groupIds = checkedRows.map(row => row.dataset.groupId);
    
    // 각 그룹 삭제 요청
    const deletePromises = groupIds.map(async groupId => {
      const response = await fetch('./js/setting/delete_group.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_id: groupId })
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || `그룹 ${groupId} 삭제 중 오류가 발생했습니다.`);
      }
      return result;
    });

    // 모든 삭제 요청 처리 대기
    await Promise.all(deletePromises);

    // 성공 메시지 표시
    alert("선택한 그룹이 성공적으로 삭제되었습니다.");

    // 테이블 새로고침
    await fetchGroupData();

  } catch (error) {
    console.error('Error deleting groups:', error);
    alert(`그룹 삭제 중 오류가 발생했습니다: ${error.message}`);
  }
});

/************************ 수정 ***************************/
function openUpdateGroupModal() {
    try {
        const checkedBox = document.querySelector('#group_manage_table input[type="checkbox"]:checked');
        if (!checkedBox) {
            alert("수정할 연료전지 그룹을 선택하세요.");
            return;
        }

        const row = checkedBox.closest('tr');
        const data = {
            groupId: row.cells[1]?.textContent?.trim(),
            groupName: row.cells[2]?.textContent?.trim(),
            regDate: row.cells[3]?.textContent?.trim(),
            description: row.cells[7]?.textContent?.trim()
        };

        console.log("가져온 데이터:", data);

        // 모달 열기
        modalSW('#group-modal', 'open');

        // 모달이 열린 후 약간의 지연을 두고 값을 설정
        setTimeout(() => {
            const modal = document.querySelector("#group-modal");
            
            // 각 입력 필드 직접 선택 후 값 설정
            const groupIdInput = modal.querySelector('input[name="group_id"]');
            const groupNameInput = modal.querySelector('input[name="group_name"]');
            const regDateInput = modal.querySelector('input[name="reg_date"]');
            const descriptionInput = modal.querySelector('textarea[name="description"]');

            console.log("모달 입력 필드:", {
                groupIdInput,
                groupNameInput,
                regDateInput,
                descriptionInput
            });

            if (groupIdInput) {
                groupIdInput.value = data.groupId;
                groupIdInput.readOnly = true;
            }
            if (groupNameInput) groupNameInput.value = data.groupName;
            if (regDateInput) regDateInput.value = data.regDate;
            if (descriptionInput) descriptionInput.value = data.description;

            // 모달 제목 설정
            modal.querySelector(".modal-title").textContent = "그룹 수정";

            console.log("값 설정 완료:", {
                groupId: groupIdInput?.value,
                groupName: groupNameInput?.value,
                regDate: regDateInput?.value,
                description: descriptionInput?.value
            });
        }, 100);

    } catch (error) {
        console.error("모달 처리 중 오류:", error);
        alert("데이터 처리 중 오류가 발생했습니다.");
    }
}


async function updateFuelcellGroup() {
  try {
    const modal = document.querySelector("#group-modal");
    
    const formData = {
      group_id: modal.querySelector('input[name="group_id"]').value,
      group_name: modal.querySelector('input[name="group_name"]').value,
      reg_date: modal.querySelector('input[name="reg_date"]').value,
      description: modal.querySelector('textarea[name="description"]').value
    };

    if (!formData.group_id || !formData.group_name) {
      alert("그룹 ID와 그룹 이름은 필수 입력 항목입니다.");
      return;
    }

    const response = await fetch("js/setting/update_group.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      alert("그룹이 성공적으로 수정되었습니다.");
      await fetchGroupData();
      modalSW('#group-modal', 'close');
    } else {
      throw new Error(result.error || "그룹 수정 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("Error updating fuelcell group:", error);
    alert("그룹 수정 중 오류가 발생했습니다: " + error.message);
  }
}





/*****************그룹/연료전지 연결 위젯************************** */
// 그룹 목록 로드 함수
// loadFuelcellList 함수 수정
// 연료전지 목록 로드 함수 수정
async function loadFuelcellList() {
  try {
      const response = await fetch('./js/setting/get_fuelcells.php');
      const data = await response.json();

      if (data) {
          const fuelcellList = document.getElementById('fuelcell-list');
          // 현재 선택된 그룹 ID 가져오기
          const selectedGroupId = document.querySelector('#group-list input[type="radio"]:checked')?.value;

          fuelcellList.innerHTML = data.map(fuelcell => `
              <label>
                  <input type="checkbox" 
                         name="fuelcell" 
                         value="${fuelcell.fuelcell_id}"
                         ${fuelcell.group_id === selectedGroupId ? 'checked' : ''}> 
                  ${fuelcell.fuelcell_name} <span>[${fuelcell.fuelcell_id}]</span>
              </label>
          `).join('');

          // 체크박스 이벤트 리스너 추가
          const checkboxes = fuelcellList.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(checkbox => {
              checkbox.addEventListener('change', function() {
                  this.closest('label').style.backgroundColor = this.checked ? '#337ab7' : '';
                  this.closest('label').style.color = this.checked ? '#ffffff' : '';
                  this.closest('label').style.transition = 'all 0.1s';
              });
          });
      }
  } catch (error) {
      console.error('Error loading fuelcell list:', error);
      alert('연료전지 목록을 불러오는데 실패했습니다.');
  }
}

// 그룹 선택 시 연료전지 목록 업데이트를 위한 이벤트 리스너 추가
function addGroupSelectionListener() {
  const groupList = document.getElementById('group-list');
  if (groupList) {
      groupList.addEventListener('change', function(e) {
          if (e.target.type === 'radio') {
              loadFuelcellList(); // 그룹 선택이 변경될 때마다 연료전지 목록 새로고침
          }
      });
  }
}

// loadGroupList 함수 수정
// 그룹 목록 로드 함수 수정
async function loadGroupList() {
  try {
      const response = await fetch('./js/setting/get_groups.php');
      const data = await response.json();

      if (data.success) {
          const groupList = document.getElementById('group-list');
          groupList.innerHTML = data.groups.map(group => `
              <label>
                  <input type="radio" name="group" value="${group.group_id}"> 
                  ${group.group_name} <span>[${group.group_id}]</span>
              </label>
          `).join('');

          // 첫 번째 그룹만 자동 선택
          const firstRadio = groupList.querySelector('input[type="radio"]');
          if (firstRadio) {
              firstRadio.checked = true;
          }
      }
  } catch (error) {
      console.error('Error loading group list:', error);
      alert('그룹 목록을 불러오는데 실패했습니다.');
  }
}

// 모달 열기 함수
function openGroupFuelcellModal() {
  loadGroupList();
  loadFuelcellList();
  addGroupSelectionListener();     // 그룹 선택 이벤트 리스너
  modalSW('#group-fuelcell-modal', 'open');
}


// 그룹-연료전지 연결 적용 함수
async function applyGroupFuelcellConnection() {
  try {
      const selectedGroup = document.querySelector('#group-list input[type="radio"]:checked');
      if (!selectedGroup) {
          alert('그룹을 선택해주세요.');
          return;
      }

      const selectedFuelcells = Array.from(
          document.querySelectorAll('#fuelcell-list input[type="checkbox"]:checked')
      ).map(checkbox => checkbox.value);

      if (selectedFuelcells.length === 0) {
          alert('연결할 연료전지를 선택해주세요.');
          return;
      }

      console.log('매핑 시도:', {
          group_id: selectedGroup.value,
          fuelcell_ids: selectedFuelcells
      });

      const response = await fetch('./js/setting/connect_group_fuelcells.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              group_id: selectedGroup.value,
              fuelcell_ids: selectedFuelcells
          })
      });

      const result = await response.json();
      console.log('매핑 결과:', result);

      if (result.success) {
          alert('연료전지 그룹 연결이 완료되었습니다.');
          
          console.log('테이블 업데이트 시작');
          
          try {
              await fetchGroupData();
              console.log('그룹 테이블 업데이트 완료');
              
              await fetchFuelcellData();
              console.log('연료전지 테이블 업데이트 완료');
              
              await fetchFuelcellGroupData();
              console.log('연료전지/그룹 연결 테이블 업데이트 완료');
          } catch (updateError) {
              console.error('테이블 업데이트 중 오류:', updateError);
          }
          
          modalSW('#group-fuelcell-modal', 'close');
      } else {
          throw new Error(result.error || '연결 중 오류가 발생했습니다.');
      }

  } catch (error) {
      console.error('Error connecting group and fuelcells:', error);
      alert('연결 중 오류가 발생했습니다: ' + error.message);
  }
}




/************************ 이벤트 리스너 초기화 함수들 ***************************/
function initUpdateButton() {
  const updateBtn = document.getElementById('update-group-btn');
  if (updateBtn) {
    updateBtn.removeEventListener('click', openUpdateGroupModal); // 기존 이벤트 리스너 제거
    updateBtn.addEventListener('click', openUpdateGroupModal);
  }
}

function initCheckboxListeners() {
  const groupTable = document.querySelector('#group_manage_table');
  if (groupTable) {
    groupTable.addEventListener('change', function(e) {
      if (e.target.type === 'checkbox') {
        updateSelectedRow(e.target);
      }
    });
  }
}

// 체크박스 선택 시 행 업데이트 함수 추가
function updateSelectedRow(checkbox) {
  const row = checkbox.closest('tr');
  if (row) {
      if (checkbox.checked) {
          row.classList.add('selected');
      } else {
          row.classList.remove('selected');
      }
  }
}

function initConfirmButton() {
  const confirmBtn = document.getElementById('group-modal-confirm-btn');
  if (confirmBtn) {
    confirmBtn.removeEventListener('click', handleConfirmClick); // 기존 이벤트 리스너 제거
    confirmBtn.addEventListener('click', handleConfirmClick);
  }
}

function handleConfirmClick() {
  const modalTitle = document.querySelector("#group-modal .modal-title").textContent;
  if (modalTitle === "그룹 추가") {
    addFuelcellGroup();
  } else if (modalTitle === "그룹 수정") {
    updateFuelcellGroup();
  }
}

function initGroupEventListeners() { 
  const searchButton = document.getElementById('group-search-button');
  if (searchButton) {
      searchButton.addEventListener('click', searchGroups);
  }

  const resetButton = document.getElementById('group-search-reset');
  if (resetButton) {
      resetButton.addEventListener('click', resetGroupSearch);
  }
}

// 그룹-연료전지 연결 관련 이벤트 리스너 초기화 함수
function initGroupFuelcellConnectListeners() {
  const connectBtn = document.getElementById('connect-group-fuelcell-btn');
  const openModalBtn = document.querySelector('.add-group-btn');

  if (openModalBtn) {
      openModalBtn.addEventListener('click', openGroupFuelcellModal);
  }

  if (connectBtn) {
      connectBtn.addEventListener('click', applyGroupFuelcellConnection);
  }
}

// DOMContentLoaded 이벤트 리스너
document.addEventListener("DOMContentLoaded", function () {
   // 그룹 관리 테이블 초기화
   fetchGroupData();
  
   // 연료전지/그룹 연결 테이블 초기화
   fetchFuelcellGroupData();
   
  // 기존 이벤트 리스너들
  initGroupEventListeners();
  initUpdateButton();
  initCheckboxListeners();
  initConfirmButton();
  addEventListeners();
  addGroupSelectionListener();
  
  // 그룹-연료전지 연결 관련 초기화
  initGroupFuelcellConnectListeners();

  // 모달 내부 목록 초기 로드
  const groupFuelcellModal = document.getElementById('group-fuelcell-modal');
  if (groupFuelcellModal) {
      loadGroupList();
      loadFuelcellList();
  }
});