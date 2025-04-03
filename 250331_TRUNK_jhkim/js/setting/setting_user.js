// setting_user.js
import {
  modalSW,
  addCheckboxListeners,
  resetUserForm,
  openDeleteModal,
  updateAllTables,
  fetchFuelcellGroupList,
  populateFuelcellGroupList,
  fetchPowerplantList,
  fetchFuelcellGroupListByPowerplant,
  fetchUserData,
  selectedRowsMap,
  toggleGroups,
  updateFuelcellList
} from "./setting_common.js";


/**************DomContentLoaded******************/
document.addEventListener("DOMContentLoaded", function () {
  fetchUserData();
  addEventListeners();
  updatePowerplantList(); // 발전소 목록 업데이트
});

/*******************Event Listener********************/

function addEventListeners() {
  addCheckboxListeners(".users-table");

  // 삭제 버튼 이벤트 리스너
  document.addEventListener('click', function(e) {
    if (e.target.matches('.delete-btn[data-delete="users"]')) {
      openDeleteModal("users", selectedRows, deleteSelectedRows);
    }
  });

  // 나머지 이벤트 리스너들
  document.getElementById("user-search-btn").addEventListener("click", searchUsers);
  document.getElementById("user-search-reset").addEventListener("click", resetUserSearch);
  document.getElementById("update-user-btn").addEventListener("click", openUpdateUserModal);
  
  const addUserBtn = document.querySelector('.btn-of[onclick="modalSW(\'#user-modal\', \'open\')"]');
  if (addUserBtn) {
    addUserBtn.removeAttribute('onclick');
    addUserBtn.addEventListener("click", openAddUserModal);
  }

  setupRoleChangeListener();
  setupPowerplantChangeListener();
}


/***************************조회***************************/
// // 목록 조회
// function fetchUserData(query = "") {
//   fetch("js/setting/get_users.php?" + query)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return response.text(); // JSON.parse를 직접 처리하기 위해 text()로 변경
//     })
//     .then((text) => {
//       // console.log("Raw response:", text); // 원시 응답 로깅
//       try {
//         const data = JSON.parse(text);
//         if (data.error) {
//           console.error("Error fetching user data:", data.error);
//           return;
//         }
//         populateUserTable(data);
//       } catch (e) {
//         console.error("JSON parsing error:", e);
//       }
//     })
//     .catch((error) => console.error("Error fetching user data:", error));
// }

// function populateUserTable(users) {
//   const tableBody = document.querySelector(".users-table");
//   tableBody.innerHTML = ""; // 기존 내용을 지우기

//   users.forEach((user) => {
//     const row = createUserRow(user);
//     tableBody.appendChild(row);
//   });

//   selectedRows = []; // 선택된 행 초기화
//   // 테이블이 갱신된 후에 체크박스 리스너를 다시 추가
//   addCheckboxListeners(".users-table", selectedRows);
// }

// // 동적으로 데이터 읽어와서 목록 만들기
// function createUserRow(user) {
//   const row = document.createElement("tr");
//   const powerplants = user.powerplants
//     ? user.powerplants.split(", ").join('<span class="device"></span>')
//     : "";

//   row.innerHTML = `
//     <td><input type="checkbox"></td>
//     <td>${user.account_id || ""}</td>
//     <td><input type="checkbox" ${
//       user.activation_status == 1 ? "checked" : ""
//     }></td>
//     <td>${user.role || ""}</td>
//     <td>${powerplants}</td>
//     <td>${user.last_login || ""}</td>
//     <td>${user.reg_date || ""}</td>
//   `;

//     // 데이터 속성으로 email과 phone 추가
//     row.dataset.userName = user.user_name || "";
//     row.dataset.email = user.email || "";
//     row.dataset.phone = user.phone || "";

//   return row;
// }

/********************* 검색 *****************************/
// 필드의 표시/숨기기를 처리하는 함수
function toggleFields(selectedValue) {
  var accountIdInput = document.getElementById("account-id-input");
  var authoritySelect = document.getElementById("filter-authority");

  if (selectedValue === "ID") {
    accountIdInput.style.display = "inline"; // 사용자ID 입력 필드 보이기
    authoritySelect.style.display = "none"; // 권한 선택 필드 숨기기
  } else if (selectedValue === "authority") {
    accountIdInput.style.display = "none"; // 사용자ID 입력 필드 숨기기
    authoritySelect.style.display = "inline"; // 권한 선택 필드 보이기
  }
}

// 선택 항목 변경 시 이벤트 리스너 등록
document.getElementById("user-select").addEventListener("change", function () {
  toggleFields(this.value);
});

// 초기 상태 설정 (기본 선택값이 있는 경우 필요)
toggleFields(document.getElementById("user-select").value);

// 검색 함수
function searchUsers() {
  var selectedValue = document.getElementById("user-select").value;
  var query = "";

  if (selectedValue === "ID") {
    var accountId = document.getElementById("account-id-input").value;
    query = "account_id=" + accountId;
  } else if (selectedValue === "authority") {
    var authority = document.getElementById("filter-authority").value;
    query = "role=" + authority;
  }

  fetch("js/setting/search_user.php?" + query)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Error fetching search results:", data.error);
        return;
      }
      populateUserTable(data); // 검색 결과를 테이블에 표시
    })
    .catch((error) => console.error("Error:", error));
}

/********************* 초기화 ***************************/
// 검색 초기화 함수
function resetUserSearch() {
  document.getElementById('account-id-input').value = '';
  document.getElementById('filter-authority').value = 'Admin';
  fetchUserData(); // 전체 데이터를 다시 불러옴
}


/*****************모달 안에서***************************/

// 사용자 추가 모달에 관리자: local user일 때 관리 연료전지 그룹 목록 보이게 하기
// 사용자가 User일때 모달 크기 늘리고, 사용자가 LocalAdmin일때 모달 크기 되돌리기(관리 연료전지 그룹목록 추가때문에)
function setupRoleChangeListener() {
  const RoleSelect = document.querySelector("#role");
  RoleSelect.addEventListener("change", function () {
    const fuelcellContainer = document.querySelector("#group-container");
    const userModal = document.querySelector("#user-modal");
    if (this.value === "User") {
      fuelcellContainer.style.display = "block";
      userModal.classList.add("large"); // 모달의 크기를 크게 설정
    } else {
      fuelcellContainer.style.display = "none";
      userModal.classList.remove("large"); // 모달의 크기를 원래대로 되돌리기
    }
  });
}

// 발전소 테이블에 체크박스 클릭에 따라 그 발전소에 해당하는 연료전지 그룹 불러오기
function setupPowerplantChangeListener() {
  document
    .querySelector("#powerplant-table-list")
    .addEventListener("change", async function (e) {
      if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
        const checkedPowerplantIds = Array.from(
          document.querySelectorAll('#powerplant-table-list input[type="checkbox"]:checked')
        ).map(checkbox => checkbox.value);

        try {
          const response = await fetch(`js/setting/get_groups_by_powerplant.php?powerplant_id=${checkedPowerplantIds.join(',')}`);
          const data = await response.json();
          
          if (data.success && data.groups) {
            updateFuelcellGroupList(data.groups);
          } else {
            console.error('Failed to fetch groups:', data.message);
          }
        } catch (error) {
          console.error('Error fetching groups:', error);
        }
      }
    });
}


function toggleFuelcellGroupContainer(role) {
  const fuelcellContainer = document.querySelector("#group-container");
  const userModal = document.querySelector("#user-modal");
  if (role === "User") {
    fuelcellContainer.style.display = "block";
    userModal.classList.add("large");
  } else {
    fuelcellContainer.style.display = "none";
    userModal.classList.remove("large");
  }
}

/********************추가**************************/
function openAddUserModal() {
  // 모달 제목 변경
  document.getElementById("user-modal-title").textContent = "사용자 추가";
  document.getElementById("user-modal-confirm-btn").textContent = "확인";
  document.getElementById("user-modal-confirm-btn").removeEventListener("click", updateUser);
  document.getElementById("user-modal-confirm-btn").addEventListener("click", addUser);

  // 입력 필드 초기화
  resetUserForm();

  modalSW("#user-modal", "open");
}

// 사용자 추가
function addUser() {
  const user_name = document.querySelector(
    '#user-modal input[name="user_name"]'
  ).value;
  const account_id = document.querySelector(
    '#user-modal input[name="account_id"]'
  ).value;
  const email = document.querySelector('#user-modal input[name="email"]').value;
  const phone = document.querySelector('#user-modal input[name="phone"]').value;
  const activation_status = document.querySelector(
    '#user-modal input[name="activation_status"]'
  ).checked
    ? 1
    : 0;
  const role = document.querySelector('#user-modal select[name="role"]').value;

  if (!user_name || !account_id) {
    alert("사용자 이름과 사용자 ID는 필수입니다.");
    return;
  }

  const selectedPowerplants = Array.from(
    document.querySelectorAll(
      '#powerplant-table-list input[type="checkbox"]:checked'
    )
  ).map((checkbox) => checkbox.value);

  const selectedGroups = Array.from(
    document.querySelectorAll(
      '#group-table-list input[type="checkbox"]:checked'
    )
  ).map((checkbox) => checkbox.value);

  const data = {
    user_name,
    account_id,
    email,
    phone,
    activation_status,
    role,
    powerplants: selectedPowerplants,
    groups: selectedGroups,
  };

  const apiEndpoint =
    role === "LocalAdmin"
      ? "js/setting/add_local_admin.php"
      : "js/setting/add_local_user.php";

  fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert("사용자가 성공적으로 추가되었습니다.");
        updateAllTables();
        modalSW("#user-modal", "close");
        resetUserForm(); // 입력 필드 초기화
      } else {
        alert("사용자 추가에 실패했습니다: " + result.error);
      }
    })
    .catch((error) => console.error("Error adding user:", error));
}



/***************** 삭제 ****************************/
function deleteSelectedRows() {
  const selectedRows = selectedRowsMap.get('.users-table') || [];
  if (!selectedRows.length) return;

  const checkedRows = selectedRows.filter(row => 
    row.querySelector('input[type="checkbox"]:first-of-type').checked
  );

  const deletePromises = checkedRows.map(row => {
    const identifier = row.querySelector("td:nth-child(2)").textContent;
    console.log("Deleting user with ID:", identifier);
    
    return fetch("js/setting/delete_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account_id: identifier }),
    })
    .then(response => response.json())
    .then(result => {
      if (!result.success && result.error) {
        console.error("Delete error for ID", identifier, ":", result.error);
      }
      return { ...result, identifier }; // ID도 함께 반환
    });
  });

  Promise.all(deletePromises)
    .then(results => {
      console.log("All delete results:", results);
      const allSuccess = results.every(result => result.success);
      if (allSuccess) {
        checkedRows.forEach(row => row.remove());
        selectedRowsMap.set('.users-table', 
          selectedRows.filter(row => !checkedRows.includes(row))
        );
        alert("선택한 항목이 삭제되었습니다.");
        updateAllTables();
      } else {
        const failedItems = results
          .filter(result => !result.success)
          .map(result => `${result.identifier}(${result.error || '알 수 없는 오류'})`);
        alert(`다음 항목 삭제에 실패했습니다:\n${failedItems.join('\n')}`);
      }
      modalSW("#delete-modal", "close");
    })
    .catch(error => {
      console.error("Error during deletion:", error);
      alert("삭제 중 오류가 발생했습니다.");
    });
}

/********************수정**************************/
function openUpdateUserModal() {
  const selectedRows = selectedRowsMap.get('.users-table') || [];
  if (selectedRows.length !== 1) {
    alert("수정할 사용자를 하나만 선택하세요.");
    return;
  }

  const selectedRow = selectedRows[0];

  const user = {
    account_id: selectedRow.querySelector("td:nth-child(2)").textContent,
    activation_status: selectedRow.querySelector("td:nth-child(3) input").checked,
    role: selectedRow.querySelector("td:nth-child(4)").textContent,
    user_name: selectedRow.dataset.userName,
    email: selectedRow.dataset.email,
    phone: selectedRow.dataset.phone
  };

  console.log("Selected User:", user);

  // 기본 정보 설정
  const accountIdInput = document.querySelector('#user-modal input[name="account_id"]');
  accountIdInput.value = user.account_id;
  accountIdInput.readOnly = true; // readonly 속성 사용
  accountIdInput.classList.add('readonly-input'); // 스타일링을 위한 클래스 추가

  document.querySelector('#user-modal input[name="user_name"]').value = user.user_name;
  document.querySelector('#user-modal input[name="activation_status"]').checked = user.activation_status;
  document.querySelector('#user-modal select[name="role"]').value = user.role;
  document.querySelector('#user-modal input[name="email"]').value = user.email;
  document.querySelector('#user-modal input[name="phone"]').value = user.phone;

  // 모달 설정
  document.getElementById("user-modal-title").textContent = "사용자 수정";
  document.getElementById("user-modal-confirm-btn").textContent = "수정";
  document.getElementById("user-modal-confirm-btn").removeEventListener("click", addUser);
  document.getElementById("user-modal-confirm-btn").addEventListener("click", updateUser);

  // role에 따라 연료전지 그룹 컨테이너 표시/숨김
  const roleSelect = document.querySelector('#user-modal select[name="role"]');
  toggleFuelcellGroupContainer(roleSelect.value);

  modalSW("#user-modal", "open");
}

async function updatePowerplantList() {
  try {
    const powerplants = await fetchPowerplantList();
    const listContainer = document.querySelector("#powerplant-table-list");
    if (!listContainer) {
      console.error("Powerplant list container element not found");
      return;
    }
    listContainer.innerHTML = ""; // 기존 내용을 지우기

    powerplants.forEach((powerplant) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" value="${powerplant.powerplant_id}" onclick="toggleGroups(this)"></td>
        <td>${powerplant.powerplant_name}</td>
      `;
      listContainer.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching powerplant list:", error);
  }
}

function updateFuelcellGroupList(groups) {
  const listContainer = document.querySelector("#group-table-list");
  if (!listContainer) {
    console.error("Fuelcell group list container element not found");
    return;
  }
  listContainer.innerHTML = ""; // 기존 내용을 지우기

  groups.forEach((group) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" value="${group.group_id}"></td>
      <td>${group.group_name}</td>
    `;
    listContainer.appendChild(row);
  });
}



// 사용자 수정
function updateUser() {
  const user_name = document.querySelector('#user-modal input[name="user_name"]').value;
  const account_id = document.querySelector('#user-modal input[name="account_id"]').value;
  const email = document.querySelector('#user-modal input[name="email"]').value;
  const phone = document.querySelector('#user-modal input[name="phone"]').value;
  const activation_status = document.querySelector('#user-modal input[name="activation_status"]').checked ? 1 : 0;
  const role = document.querySelector('#user-modal select[name="role"]').value;

  if (!user_name || !account_id) {
    alert("사용자 이름과 사용자 ID는 필수입니다.");
    return;
  }

  const selectedPowerplants = Array.from(
    document.querySelectorAll('#powerplant-table-list input[type="checkbox"]:checked')
  ).map((checkbox) => checkbox.value);

  const selectedGroups = Array.from(
    document.querySelectorAll('#group-table-list input[type="checkbox"]:checked')
  ).map((checkbox) => checkbox.value);

  const data = {
    user_name,
    account_id,
    email,
    phone,
    activation_status,
    role,
    powerplants: selectedPowerplants,
    groups: selectedGroups,
  };

  fetch("js/setting/update_user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert("사용자가 성공적으로 수정되었습니다.");
        updateAllTables();
        modalSW("#user-modal", "close");
        resetUserForm(); // 입력 필드 초기화
        selectedRowsMap.set('.users-table', []);
      } else {
        alert("사용자 수정에 실패했습니다: " + result.error);
      }
    })
    .catch((error) => console.error("Error updating user:", error));
}

function addUserCheckboxListeners() {
    const rows = document.querySelectorAll('.users-table tr');
    rows.forEach(row => {
        const checkbox = row.querySelector('input[type="checkbox"]:first-of-type');
        if (checkbox && !checkbox.closest('thead')) {  // 헤더 체크박스 제외
            checkbox.addEventListener('change', function() {
                // 사용자 테이블 특화 체크박스 처리
            });
        }
    });
}
