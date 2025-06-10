// stack_diagnosis_analysis_log.js

import { fuelcellConfig, getSelectedFuelcell } from "../config/fuelcellSelector.js";

const ITEMS_PER_PAGE = 50;
let currentPage = 1;
let diagnosisData = [];

document.addEventListener('DOMContentLoaded', () => {
  loadAndDisplayDiagnosisData(currentPage);

  document.addEventListener('fuelcellChanged', () => {
    // 연료전지 변경 시 전체 초기화
    diagnosisData = [];
    loadAndDisplayDiagnosisData(1);
  });
});

export async function loadAndDisplayDiagnosisData(page) {
  try {
    const selectedFuelcell = await getSelectedFuelcell();
    const currentFuelcellData = fuelcellConfig[selectedFuelcell];
    const limit = 1000; // 전체 불러온 뒤 페이지네이션 (혹은 page & limit 방식도 가능)
    const type = 'EIS';
    const params = new URLSearchParams({
      type: type,
      limit: limit.toString(),
      fuelcellId: currentFuelcellData.fuelcell,
      plant: currentFuelcellData.plant
    });

    const response = await fetch(`js/stack/stack_diagnosis_log.php?${params.toString()}`);
    if (!response.ok) throw new Error('데이터 요청 실패');

    diagnosisData = await response.json();
    displayData(page);
    displayPagination(diagnosisData.length, page);
  } catch (error) {
    console.error('진단 로그 데이터 로딩 실패:', error);
  }
}

function displayData(page) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = Math.min(start + ITEMS_PER_PAGE, diagnosisData.length);
  const tableBody = document.querySelector('#diagnosis-log-table');
  tableBody.innerHTML = '';
  const pagedData = diagnosisData.slice(start, end);

  pagedData.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDate(item.time)}</td>
      <td>${item.comment || item.content || '-'}</td>
    `;
    tableBody.appendChild(row);
  });
}

function displayPagination(totalItems, currentPage) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginationContainer = document.getElementById('diagnosis-log-pagination');
  paginationContainer.innerHTML = '';
  const maxPageVisible = 5;
  let startPage = Math.max(currentPage - Math.floor(maxPageVisible / 2), 1);
  let endPage = Math.min(startPage + maxPageVisible - 1, totalPages);

  if (endPage - startPage + 1 < maxPageVisible) {
    startPage = Math.max(endPage - maxPageVisible + 1, 1);
  }

  // <<
  paginationContainer.appendChild(
    createPageItem(1, '<<', currentPage > 1)
  );

  // <
  paginationContainer.appendChild(
    createPageItem(currentPage - 1, '<', currentPage > 1)
  );

  for (let i = startPage; i <= endPage; i++) {
    paginationContainer.appendChild(
      createPageItem(i, i.toString(), currentPage !== i)
    );
  }

  // >
  paginationContainer.appendChild(
    createPageItem(currentPage + 1, '>', currentPage < totalPages)
  );

  // >>
  paginationContainer.appendChild(
    createPageItem(totalPages, '>>', currentPage < totalPages)
  );
}

function createPageItem(page, text, isEnabled) {
  const li = document.createElement('li');
  li.className = 'page-item' + (isEnabled ? '' : ' disabled');
  const a = document.createElement('a');
  a.className = 'page-link';
  a.href = '#';
  a.textContent = text;

  a.addEventListener('click', function (e) {
    e.preventDefault();
    if (!isEnabled) return;
    currentPage = page;
    displayData(currentPage);
    displayPagination(diagnosisData.length, currentPage);
  });

  li.appendChild(a);
  return li;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}
