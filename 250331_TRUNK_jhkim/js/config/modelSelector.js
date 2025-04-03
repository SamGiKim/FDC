// modelSelector.js 모델링 그룹선택
import { getCurrentConfig } from './fuelcellSelector.js';
import { loadModelData } from '../aitraining/sensorList.js';

export class ModelGroupSelector {
    constructor() {
        this.selectElement = document.getElementById('model-group-select');
        this.currentModelGroup = '';

        if (!this.selectElement) {
            console.warn('Model group select element not found. ModelGroupSelector will not be initialized.');
            return;
        }

        // 초기화 순서 변경
        this.setupEventListeners();
        this.loadModelGroups().then(() => {
            this.loadSavedModelGroup();
            // 초기 로딩 시 데이터 불러오기
            if(this.currentModelGroup){
                this.loadModelData();
            }
        })
    }

    async loadSavedModelGroup() {
        const savedModelGroup = localStorage.getItem('selectedModelGroup');
        if (savedModelGroup && this.selectElement) {
            this.selectElement.value = savedModelGroup;
            this.currentModelGroup = savedModelGroup;
            this.notifyModelGroupChange();
            // 저장된 모델 그룹이 있을 때 데이터 로드
            await this.loadModelData();
        }else if(this.selectElement.options.length>0){
            // 저장된 값이 없을 경우 첫 번째 옵션 선택
            this.currentModelGroup = this.selectElement.options[0].value;
            this.selectElement.value = this.currentModelGroup;
            localStorage.setItem('selectedModelGroup', this.currentModelGroup);
            this.notifyModelGroupChange();
            await this.loadModelData();
        }
    }

    async init() {
        if (!this.selectElement) return;

        await this.loadModelGroups();
        this.setupEventListeners();
        
        if (this.selectElement.options.length > 0) {
            this.currentModelGroup = this.selectElement.value;
            this.notifyModelGroupChange();
            this.loadModelData();
        }
    }

    async loadModelGroups() {
        try {
            const config = getCurrentConfig();

            const url = `js/config/get_model_groups.php?powerplant_id=${config.powerplant_id}&fuelcell_id=${config.fuelcell_id}`;

            const response = await fetch(url);
            const result = await response.json();

            // success와 data의 프로퍼티 확인
            if(result.success && Array.isArray(result.data)){
                this.updateModelGroupSelect(result.data);
            }else{
                console.error('invalid model group data:', result);
            }
        }catch(error){
            console.error('error loading model groups:', error);
        }
    }

    async loadModelData() {
        const modelGroup = this.getCurrentModelGroup();
        console.log('Loading model data for model group:', modelGroup);
        try {
            await loadModelData(modelGroup);
        } catch (error) {
            console.error('Error loading model data:', error);
        }
    }

    updateModelGroupSelect(modelGroups) {
        this.selectElement.innerHTML = '';
        
        modelGroups.forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            this.selectElement.appendChild(option);
        });

        const savedModelGroup = localStorage.getItem('selectedModelGroup');
        if (savedModelGroup && this.selectElement.querySelector(`option[value="${savedModelGroup}"]`)) {
            this.selectElement.value = savedModelGroup;
            this.currentModelGroup = savedModelGroup;
        } else if (this.selectElement.options.length > 0) {
            this.currentModelGroup = this.selectElement.options[0].value;
            this.selectElement.value = this.currentModelGroup;
        }

        this.notifyModelGroupChange();
        this.loadModelData(); // 모델 그룹 업데이트 후 데이터 로드
    }

    setupEventListeners() {
        if (!this.selectElement) {
            console.error('Select element is not initialized.');
            return;
        }

        this.selectElement.addEventListener('change', () => {
            this.currentModelGroup = this.selectElement.value;
            console.log('Model group changed to:', this.currentModelGroup);
            localStorage.setItem('selectedModelGroup', this.currentModelGroup);
            this.notifyModelGroupChange();
            this.loadModelData();
        });

        document.addEventListener('fuelcellChanged', () => {
            this.loadModelGroups();
        });
    }

    notifyModelGroupChange() {
        const config = getCurrentConfig();
        const event = new CustomEvent('modelGroupChanged', {
            detail: {
                modelGroup: this.currentModelGroup,
                powerplant_id: config.powerplant_id,
                fuelcell_id: config.fuelcell_id
            }
        });
        document.dispatchEvent(event);
        console.log('Dispatched modelGroupChanged event with:', this.currentModelGroup);
    }

    getCurrentModelGroup() {
        return this.currentModelGroup;
    }
}

let modelGroupSelector;
document.addEventListener('DOMContentLoaded', () => {
    modelGroupSelector = new ModelGroupSelector();
    window.modelGroupSelector = modelGroupSelector;
});