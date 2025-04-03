
import { fuelcellConfig, getSelectedFuelcell, setupFuelcellSelector, getPlants, getGroupsByPlant, getFuelcellsByPlantAndGroup, ensureDataLoaded } from './js/config/fuelcellSelector.js';
import { DashboardEventManager } from './js/dashboard/dash_eventManager.js';

// 전역 변수 선언
let plantSelect, groupSelect, fuelcellSelect;

// Plant 드롭다운 초기화
async function initializePlantSelect() {
    plantSelect.innerHTML = '';
    const plants = await getPlants();
    const plantNames = new Map(); // plant ID와 이름을 저장할 Map
    
    // fuelcellConfig에서 발전소 이름 추출
    Object.values(fuelcellConfig).forEach(config => {
        if (!plantNames.has(config.plant)) {
            plantNames.set(config.plant, config.plantName); // plantName 사용
        }
    });
    
    plants.forEach(plantId => {
        const option = document.createElement('option');
        option.value = plantId;
        option.textContent = plantNames.get(plantId) || plantId;
        plantSelect.appendChild(option);
    });
}

// Plant 변경 이벤트 핸들러
async function handlePlantChange() {
    const selectedPlant = plantSelect.value;
    
    groupSelect.innerHTML = '';
    const groups = await getGroupsByPlant(selectedPlant);
    const groupNames = new Map(); // group ID와 이름을 저장할 Map
    
    // fuelcellConfig에서 그룹 이름 추출
    Object.values(fuelcellConfig).forEach(config => {
        if (config.plant === selectedPlant && !groupNames.has(config.group)) {
            groupNames.set(config.group, config.groupName); // groupName 사용
        }
    });
    
    groups.forEach(groupId => {
        const option = document.createElement('option');
        option.value = groupId;
        option.textContent = groupNames.get(groupId) || groupId;
        groupSelect.appendChild(option);
    });
    
    const firstGroup = groups[0];
    if (firstGroup) {
        groupSelect.value = firstGroup;
        // >>> 250327 hjkim - FDC_URL이_다시갱신되는_버그
        //groupSelect.dispatchEvent(new Event('change'));
        // <<< 250327 hjkim - FDC_URL이_다시갱신되는_버그
    }
}

// Group 변경 이벤트 핸들러
async function handleGroupChange() {
    const selectedPlant = plantSelect.value;
    const selectedGroup = groupSelect.value;
    
    // URL 파라미터에서 fuelcell 값 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const urlFuelcell = urlParams.get('fuelcell');
    
    fuelcellSelect.innerHTML = '';
    const fuelcells = await getFuelcellsByPlantAndGroup(selectedPlant, selectedGroup);
    
    fuelcells.forEach(fuelcellId => {
        const option = document.createElement('option');
        option.value = fuelcellId;
        option.textContent = fuelcellConfig[fuelcellId].name;
        fuelcellSelect.appendChild(option);
    });
    
    // URL 파라미터가 있으면 해당 값 선택, 없으면 첫 번째 연료전지 선택
    if (urlFuelcell && fuelcells.includes(urlFuelcell)) {
        fuelcellSelect.value = urlFuelcell;
    } else if (fuelcells.length > 0) {
        fuelcellSelect.value = fuelcells[0];
    }
    
    // fuelcell 변경 이벤트 직접 호출
    handleFuelcellChange();
}

// Fuelcell 변경 이벤트 핸들러
function handleFuelcellChange() {
    updateURL();
}

// URL 업데이트 함수
function updateURL() {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('plant', plantSelect.value);
    newUrl.searchParams.set('group', groupSelect.value);
    newUrl.searchParams.set('fuelcell', fuelcellSelect.value);
    window.history.pushState({}, '', newUrl);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    plantSelect.addEventListener('change', async (e) => {
        await handlePlantChange();
        updateURL();
    });
    
    groupSelect.addEventListener('change', async (e) => {
        await handleGroupChange();
        updateURL();
    });
    
    fuelcellSelect.addEventListener('change', () => {
        updateURL();
    });
}

// 초기 상태 설정
async function setInitialState() {
    const selectedFuelcell = await getSelectedFuelcell();
    const config = fuelcellConfig[selectedFuelcell];
    
    if (config) {
        // 1. plant 설정
        plantSelect.value = config.plant;
        await handlePlantChange();  // group 목록 필터링
        
        // 2. group 설정
        groupSelect.value = config.group;
        await handleGroupChange();  // fuelcell 목록 필터링
        
        // 3. fuelcell 선택
        fuelcellSelect.value = selectedFuelcell;
    } else {
        // 기본값 설정
        if (plantSelect.options.length > 0) {
            plantSelect.value = plantSelect.options[0].value;
            await handlePlantChange();  // group 목록 필터링
            
            if (groupSelect.options.length > 0) {
                groupSelect.value = groupSelect.options[0].value;
                await handleGroupChange();  // fuelcell 목록 필터링
                
                if (fuelcellSelect.options.length > 0) {
                    fuelcellSelect.value = fuelcellSelect.options[0].value;
                }
            }
        }
    }
}

// 드롭다운 초기화 함수
async function initializeDropdowns() {
    plantSelect = document.getElementById('plant-select');
    groupSelect = document.getElementById('group-select');
    fuelcellSelect = document.getElementById('fuelcell-select');
    
    // 초기화 실행
    await initializePlantSelect();
    setupEventListeners();
    await setInitialState();
}

// >>> 250327 hjkim - 메뉴 클릭 이벤트
window.addEventListener("load", function() {
	let navLinks = document.querySelectorAll('#navbarNav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            goToPage(link);
        });
    });
});
// <<< 250327 hjkim - 메뉴 클릭 이벤트

// goToPage 함수 정의
window.goToPage = async function(link) {
    try {
        await ensureDataLoaded();
        
        // 현재 선택된 값들 가져오기
        const plantSelect = document.getElementById('plant-select');
        const groupSelect = document.getElementById('group-select');
        const fuelcellSelect = document.getElementById('fuelcell-select');
        
        // 선택된 값을 로컬 스토리지에 저장
        localStorage.setItem('selectedPlant', plantSelect.value);
        localStorage.setItem('selectedGroup', groupSelect.value);
        localStorage.setItem('selectedFuelcell', fuelcellSelect.value);
        
        // 기본 URL 가져오기
        const baseUrl = link.getAttribute('href').split('?')[0];
        
        // 항상 현재 선택된 값으로 파라미터 구성
        const params = new URLSearchParams({
            plant: plantSelect.value,
            group: groupSelect.value,
            fuelcell: fuelcellSelect.value
        });
        
        // 최종 URL 생성 (파라미터 항상 포함)
        const finalUrl = `${baseUrl}?${params.toString()}`;
        console.log('페이지 이동:', finalUrl);
        window.location.href = finalUrl;
        
        return false;
    } catch (error) {
        console.error('페이지 이동 중 오류 발생:', error);
        return false;
    }
};

// 메인 초기화 함수 - 페이지 로드 시 실행
async function initialize() {
    try {
        await setupFuelcellSelector();
        await initializeDropdowns();
        await DashboardEventManager.initializeAllComponents();
        
        const urlParams = new URLSearchParams(window.location.search);
        const urlPlant = urlParams.get('plant');
        const urlGroup = urlParams.get('group');
        const urlFuelcell = urlParams.get('fuelcell');
        
        const storedPlant = localStorage.getItem('selectedPlant');
        const storedGroup = localStorage.getItem('selectedGroup');
        const storedFuelcell = localStorage.getItem('selectedFuelcell');
        
        // URL 파라미터가 있으면 우선 사용, 없으면 로컬 스토리지 사용
        if (urlPlant && urlGroup && urlFuelcell) {
            plantSelect.value = urlPlant;
            await handlePlantChange();
            
            groupSelect.value = urlGroup;
            await handleGroupChange();
            
            fuelcellSelect.value = urlFuelcell;
        } else if (storedPlant && storedGroup && storedFuelcell) {
            plantSelect.value = storedPlant;
            await handlePlantChange();
            
            groupSelect.value = storedGroup;
            await handleGroupChange();
            
            fuelcellSelect.value = storedFuelcell;
        }
        
        // 현재 페이지 경로에 따라 active-link 클래스 추가
        const currentPath = window.location.pathname.split("/").pop();
        const navLinks = document.querySelectorAll('#navbarNav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });
    } catch (error) {
        console.error('초기화 중 오류 발생:', error);
    }
}

// 페이지 로드 시 한 번만 실행
document.addEventListener('DOMContentLoaded', initialize);
