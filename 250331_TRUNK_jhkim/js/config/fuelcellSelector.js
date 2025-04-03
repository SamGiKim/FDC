// fuelcellSelector.js
// 모든 스택 관련 설정이 중앙화 됨.
import { setDefaultSection, loadAllData } from './redis_dataManager.js';
import { updateModelName } from '../bop/modelName.js'; 
import { SessionService } from './get_session.js';

/*
1. get_session.js를 통해 쿠키에 저장된 SESS_ID 가져와서 REDIS에서 session:SESS_ID 조회해서
2. 그 값에 있는 powerplant_id를 통해서 해당 발전소에 속하는 그룹, 연료전지를 쿼리 조회해서
3. .site-select에 보여줌
*/

// navbar.php 위한 코드
//////////////////////////////////////////////////////////////////////////////////////

// 동적으로 가져올 데이터를 저장할 변수들
export let siteStructure = null;
export let fuelcellConfig = null;
export let DEFAULT_FUELCELL = null;

// 전역 변수로 설정
window.fuelcellConfig = null;
window.isFuelcellConfigLoaded = false;

async function fetchSiteStructure() {
  try {
      // 세션에서 발전소 목록 가져오기
      const powerplants = await SessionService.getPowerplants();
      console.log("세션에서 가져온 발전소 목록:", powerplants);

      if (!powerplants || powerplants.length === 0) {
          throw new Error('발전소 목록을 가져올 수 없습니다');
      }

      // GET 요청으로 변경
      const response = await fetch(`js/config/get_site_structure.php?powerplants=${powerplants.join(',')}`);
      const data = await response.json();
      
      if (data.success) {
          siteStructure = data.structure;
          fuelcellConfig = data.fuelcellConfig;
          window.fuelcellConfig = data.fuelcellConfig; // 전역 변수 설정
          DEFAULT_FUELCELL = data.defaultFuelcell;
          window.isFuelcellConfigLoaded = true;
          
          // 데이터 로드 완료 이벤트 발생
          document.dispatchEvent(new CustomEvent('fuelcellConfigLoaded'));
          return true;
      }
      throw new Error(data.message || '사이트 구조를 가져오는데 실패했습니다');
  } catch (error) {
      console.error('사이트 구조 로드 실패:', error);
      return false;
  }
}


// 초기화 함수
async function initializeSiteStructure() {
  try {
      const success = await fetchSiteStructure();
      if (success) {
          // 초기화 완료 이벤트 발생
          document.dispatchEvent(new CustomEvent('siteStructureInitialized'));
      }
      return success;
  } catch (error) {
      console.error('사이트 구조 초기화 실패:', error);
      return false;
  }
}

// ensureDataLoaded 함수 수정
export async function ensureDataLoaded() {
  if (!window.isFuelcellConfigLoaded) {
      await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
              reject(new Error('데이터 로딩 시간 초과'));
          }, 10000);

          const checkData = async () => {
              if (window.isFuelcellConfigLoaded) {
                  clearTimeout(timeout);
                  resolve();
              } else {
                  await initializeSiteStructure();
                  setTimeout(checkData, 100);
              }
          };
          checkData();
      });
  }
}

// 초기화 즉시 실행
(async function initializeSiteStructure() {
    await fetchSiteStructure();
})();


// 새로운 헬퍼 함수들 
export function getPlants() {
  return Object.keys(siteStructure);
}

export function getGroupsByPlant(plantId) {
  return Object.keys(siteStructure[plantId]?.groups || {});
}

export function getFuelcellsByPlantAndGroup(plantId, groupId) {
  return Object.keys(siteStructure[plantId]?.groups[groupId]?.fuelcells || {});
}

////////////////////////////////////////////////////////////////////////////////////////

// 로직 부분 - 변경 필요 없음
export async function getCurrentConfig() {
  try {
    await ensureDataLoaded();
    
    // URL에서 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const plant = urlParams.get('plant');
    const group = urlParams.get('group');
    const fuelcell = urlParams.get('fuelcell');
    
    // URL에 파라미터가 있으면 사용
    if (plant && group && fuelcell) {
      return {
        powerplant_id: plant,
        group_id: group,
        fuelcell_id: fuelcell,
        name: fuelcellConfig[fuelcell]?.name || fuelcell
      };
    }
    
    // 없으면 선택된 연료전지 사용
    const selectedFuelcell = await getSelectedFuelcell();
    if (!selectedFuelcell) {
      console.warn('선택된 연료전지가 없습니다. 기본 연료전지를 사용합니다.');
      if (!DEFAULT_FUELCELL) {
        throw new Error('기본 연료전지가 설정되지 않았습니다.');
      }
      const defaultConfig = fuelcellConfig[DEFAULT_FUELCELL];
      return {
        powerplant_id: defaultConfig.plant,
        group_id: defaultConfig.group,
        fuelcell_id: DEFAULT_FUELCELL,
        name: defaultConfig.name
      };
    }
    
    const config = fuelcellConfig[selectedFuelcell];
    if (!config) {
      console.warn(`연료전지 설정을 찾을 수 없습니다: ${selectedFuelcell}`);
      if (!DEFAULT_FUELCELL) {
        throw new Error('기본 연료전지가 설정되지 않았습니다.');
      }
      const defaultConfig = fuelcellConfig[DEFAULT_FUELCELL];
      return {
        powerplant_id: defaultConfig.plant,
        group_id: defaultConfig.group,
        fuelcell_id: DEFAULT_FUELCELL,
        name: defaultConfig.name
      };
    }
    
    return {
      powerplant_id: config.plant,
      group_id: config.group,
      fuelcell_id: config.fuelcell,
      name: config.name
    };
  } catch (error) {
    console.error('현재 설정 가져오기 실패:', error);
    // 기본값 반환
    return {
      powerplant_id: 'SE01',
      group_id: 'GR01',
      fuelcell_id: 'F001',
      name: '기본 연료전지'
    };
  }
}

export function getFuelcellConfig(fuelcell){
  return fuelcellConfig[fuelcell];
}

export async function getFuelcellSectionId(fuelcell) {
  try {
    await ensureDataLoaded();
    
    // Promise 객체인 경우 해결
    if (fuelcell instanceof Promise) {
      try {
        fuelcell = await fuelcell;
        console.log('Promise에서 해결된 fuelcell:', fuelcell);
      } catch (error) {
        console.error('연료전지 ID Promise 해결 실패:', error);
        fuelcell = null;
      }
    }
    
    // URL에서 파라미터 가져오기 - 최우선 적용
    const urlParams = new URLSearchParams(window.location.search);
    const urlPlant = urlParams.get('plant');
    const urlFuelcell = urlParams.get('fuelcell');
    
    if (urlPlant && urlFuelcell) {
      const sectionId = `${urlPlant}_${urlFuelcell}_dash_web`;
      console.log('URL 파라미터로 섹션 ID 생성:', sectionId);
      return sectionId;
    }
    
    if (!fuelcell) {
      console.warn('연료전지 ID가 제공되지 않았습니다.');
      if (!DEFAULT_FUELCELL) {
        console.warn('기본 연료전지가 설정되지 않았습니다.');
        throw new Error('연료전지 ID를 찾을 수 없습니다.');
      } else {
        fuelcell = DEFAULT_FUELCELL;
      }
    }

    const config = fuelcellConfig[fuelcell];
    if (!config) {
      console.error(`유효하지 않은 연료전지 ID: ${fuelcell}`);
      
      if (urlPlant && fuelcell) {
        const sectionId = `${urlPlant}_${fuelcell}_dash_web`;
        console.log('URL 파라미터와 fuelcell로 섹션 ID 생성:', sectionId);
        return sectionId;
      }
      
      if (!DEFAULT_FUELCELL) {
        throw new Error('기본 연료전지가 설정되지 않았습니다.');
      }
      
      const defaultConfig = fuelcellConfig[DEFAULT_FUELCELL];
      if (!defaultConfig) {
        throw new Error('기본 연료전지 설정을 찾을 수 없습니다.');
      }
      
      return `${defaultConfig.plant}_${DEFAULT_FUELCELL}_dash_web`;
    }
    
    return `${config.plant}_${fuelcell}_dash_web`;
  } catch (error) {
    console.error('연료전지 섹션 ID 가져오기 실패:', error);
    
    // URL에서 파라미터 가져오기
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const plant = urlParams.get('plant');
      const fuelcell = urlParams.get('fuelcell');
      
      if (plant && fuelcell) {
        const sectionId = `${plant}_${fuelcell}_dash_web`;
        console.log('오류 후 URL 파라미터로 섹션 ID 생성:', sectionId);
        return sectionId;
      }
    } catch (urlError) {
      console.error('URL 파라미터 가져오기 실패:', urlError);
    }
    
    // 최후의 수단으로 URL 경로에서 추출 시도
    try {
      const pathParts = window.location.pathname.split('/');
      const pageName = pathParts[pathParts.length - 1].split('.')[0];
      if (pageName.includes('-')) {
        const parts = pageName.split('-');
        if (parts.length >= 2) {
          const sectionId = `${parts[0]}_${parts[1]}_dash_web`;
          console.log('경로에서 섹션 ID 생성:', sectionId);
          return sectionId;
        }
      }
    } catch (pathError) {
      console.error('경로 파싱 실패:', pathError);
    }
    
    console.warn('모든 방법으로 섹션 ID 가져오기 실패. 기본값 사용');
    return 'SE01_F001_dash_web';
  }
}

export function findFuelcellByParams(plant, group, fuelcell){
  return Object.values(fuelcellConfig).find(config=>
    config.plant === plant &&
    config.group === group &&
    config.fuelcell === fuelcell
  );
}

// getSelectedFuelcell 수정
export async function getSelectedFuelcell() {
  try {
    await ensureDataLoaded();
    const urlParams = new URLSearchParams(window.location.search);
    const plant = urlParams.get('plant');
    const group = urlParams.get('group');
    let fuelcell = urlParams.get('fuelcell');

    // fuelcell이 비어있을 경우 해당 plant와 group의 첫 번째 fuelcell을 찾아서 반환
    if (!fuelcell && plant && group) {
        const availableFuelcells = Object.entries(fuelcellConfig)
            .filter(([_, config]) => config.plant === plant && config.group === group)
            .map(([id, _]) => id);

        if (availableFuelcells.length > 0) {
            fuelcell = availableFuelcells[0];
            
            // URL 업데이트
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('fuelcell', fuelcell);
            window.history.replaceState({}, '', newUrl);
        }
    }

    return fuelcell;
  } catch (error) {
    console.error('연료전지 선택 실패:', error);
    return null;
  }
}

export async function getSelectedFuelcellName() {
  const fuelcell = await getSelectedFuelcell();
  return fuelcellConfig[fuelcell].name;
}

// 연료전지 선택기 설정
export async function setupFuelcellSelector() {
  await fetchSiteStructure();
  if (!fuelcellConfig) {
      throw new Error('사이트 구조를 로드할 수 없습니다');
  }

  const plantSelect = document.getElementById('plant-select');
  const groupSelect = document.getElementById('group-select');
  const fuelcellSelect = document.getElementById('fuelcell-select');

  if (!plantSelect || !groupSelect || !fuelcellSelect) {
      console.error("선택 요소를 찾을 수 없습니다");
      return;
  }

  // 발전소 목록 채우기
  plantSelect.innerHTML = '';
  getPlants().forEach(plantId => {
      const option = document.createElement('option');
      option.value = plantId;
      option.textContent = siteStructure[plantId].name || plantId;
      plantSelect.appendChild(option);
  });

  // 발전소 변경 시 그룹 목록 업데이트
  plantSelect.addEventListener('change', () => {
      const selectedPlant = plantSelect.value;
      updateGroupSelect(selectedPlant);
      updateFuelcellSelect(selectedPlant, groupSelect.value);
      updateURL();
  });

  // 그룹 변경 시 연료전지 목록 업데이트
  groupSelect.addEventListener('change', () => {
      const selectedPlant = plantSelect.value;
      const selectedGroup = groupSelect.value;
      updateFuelcellSelect(selectedPlant, selectedGroup);
      updateURL();
  });

  // 연료전지 변경 시 이벤트 처리
  fuelcellSelect.addEventListener('change', async function() {
      updateURL();
      const newFuelcell = this.value;
      const newConfig = fuelcellConfig[newFuelcell];
      if (newConfig) {
          localStorage.setItem('selectedFuelcell', newFuelcell);

          try {
              const event = new CustomEvent('fuelcellChanged', {
                  detail: {
                      plant: newConfig.plant,
                      group: newConfig.group,
                      fuelcell: newConfig.fuelcell
                  }
              });
              document.dispatchEvent(event);

              const newData = await loadAllData();
              if (newData) {
                  document.dispatchEvent(new CustomEvent('dataLoaded', { detail: newData }));
              }

              await updateModelName();
          } catch (error) {
              console.error('연료전지 변경 중 데이터 업데이트 실패:', error);
          }
      }
  });

  // 초기 선택 설정
  const urlParams = new URLSearchParams(window.location.search);
  const initialPlant = urlParams.get('plant') || getPlants()[0];
  const initialGroup = urlParams.get('group') || getGroupsByPlant(initialPlant)[0];
  
  plantSelect.value = initialPlant;
  updateGroupSelect(initialPlant);
  groupSelect.value = initialGroup;
  updateFuelcellSelect(initialPlant, initialGroup);
  
  const initialFuelcell = urlParams.get('fuelcell') || 
                         getFuelcellsByPlantAndGroup(initialPlant, initialGroup)[0];
  fuelcellSelect.value = initialFuelcell;
}

// 그룹 선택 업데이트 함수
function updateGroupSelect(plantId) {
  const groupSelect = document.getElementById('group-select');
  groupSelect.innerHTML = '';
  getGroupsByPlant(plantId).forEach(groupId => {
      const option = document.createElement('option');
      option.value = groupId;
      option.textContent = siteStructure[plantId].groups[groupId].name || groupId;
      groupSelect.appendChild(option);
  });
}

// 연료전지 선택 업데이트 함수
function updateFuelcellSelect(plantId, groupId) {
  const fuelcellSelect = document.getElementById('fuelcell-select');
  fuelcellSelect.innerHTML = '';
  getFuelcellsByPlantAndGroup(plantId, groupId).forEach(fuelcellId => {
      const option = document.createElement('option');
      option.value = fuelcellId;
      option.textContent = fuelcellConfig[fuelcellId].name || fuelcellId;
      fuelcellSelect.appendChild(option);
  });
}

// URL 업데이트 함수
function updateURL() {
  const plantSelect = document.getElementById('plant-select');
  const groupSelect = document.getElementById('group-select');
  const fuelcellSelect = document.getElementById('fuelcell-select');
  
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('plant', plantSelect.value);
  newUrl.searchParams.set('group', groupSelect.value);
  newUrl.searchParams.set('fuelcell', fuelcellSelect.value);
  window.history.pushState({}, '', newUrl);
}

// 초기화 함수
async function initializeEventListeners() {
  document.addEventListener('DOMContentLoaded', async () => {
      const currentFuelcell = await getSelectedFuelcell();
      setDefaultSection(getFuelcellSectionId(currentFuelcell));
  });

  window.addEventListener('load', () => {
      setupFuelcellSelector();
  });
}

// 초기화 실행
initializeEventListeners();

// 새로운 함수 추가: 섹션 ID에서 정보 추출
export function extractInfoFromSectionId(sectionId) {
  if (!sectionId || typeof sectionId !== 'string') {
    console.warn('유효하지 않은 섹션 ID:', sectionId);
    return null;
  }
  
  const parts = sectionId.split('_');
  if (parts.length < 3) {
    console.warn('섹션 ID 형식이 올바르지 않습니다:', sectionId);
    return null;
  }
  
  return {
    powerplant_id: parts[0],
    fuelcell_id: parts[1],
    type: parts.slice(2).join('_') // dash_web 등
  };
}

export function getFuelcellIdFromSection(sectionId) {
  const info = extractInfoFromSectionId(sectionId);
  return info ? info.fuelcell_id : null;
}

export function getPowerplantIdFromSection(sectionId) {
  const info = extractInfoFromSectionId(sectionId);
  return info ? info.powerplant_id : null;
}







