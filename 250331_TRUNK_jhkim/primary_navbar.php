<?php
// 페이지별 제목 설정
function getPageTitle($currentPath) {
    $titles = [
        'index-front.html' => '발전소 연료전지 관제 시스템',
        'setting.html' => '기기관리',
        'admin.html' => '사용자 및 연료전지 관리',
        'default' => '부안발전소 연료전지 관제 시스템'
    ];
    
    return $titles[$currentPath] ?? $titles['default'];
}

// 현재 페이지 경로 가져오기
$currentPath = basename($_SERVER['PHP_SELF']);
if (empty($currentPath)) {
    $currentPath = basename(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
}
$pageTitle = getPageTitle($currentPath);
?>

<nav class="navbar navbar-expand-xxl bg-body-tertiary">
    <div class="container-fluid">
        <div class="logo-container">
            <a href="./index-front.html" onclick="return goToPage(this)">
                <div class="logo"></div>
            </a>
        </div>
        <h2 class="header-title" data-i18n="system_title">
            성남 발전소 연료전지 관제 시스템
        </h2>
        
        <!-- 언어선택 -->
        <!-- <select id="language-selector" style="display:none"> -->
        <!-- <select id="language-selector">
            <option value="en">English</option>
            <option value="ko" selected>한국어</option>
        </select> -->

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler"
            aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarToggler">
            <ul class="navbar-nav">
                    <li>
                        <a href="index-front.html" onclick="return goToPage(this)" class="active-link">
                            <!-- <span class="icon-dashboard-04"></span> -->
                            <span class="dashboard-2-svg ic-font ic-font-2-4rem"></span>
                            <span class="sub-page" data-i18n="nav.dashboard"><!--Dashboard--></span>
                        </a>
                    </li>
                    <!-- <li>
                        <a href="#">
                            <span class="icon-machine-manage"></span>
                            <span class="sub-page" data-i18n="nav.fuelcell_management">Fuelcell Management</span>
                        </a>
                    </li> -->
                    <li>
                        <a href="admin.html" onclick="return goToPage(this)">
                            <!-- <span class="icon-device-manage"></span> -->
                            <span class="admin-svg ic-font ic-font-2-4rem"></span>
                            <span class="sub-page" data-i18n="nav.admin"><!--Admin--></span>
                        </a>
                    </li>
                </ul>
            <div class="login">
                <!-- plantSelector.js에 의해 동적으로 채움 -->
                <!-- <div class="site-select">
                <select id="plant-select">
                     <option>부안발전소</option>
                </select>
                </div> -->
                <div class="site-select">
                    <!-- <select id="plant-select">
                    </select>
                    <select id="group-select">
                    </select> -->
                    <select id="fuelcell-select">
                    </select>

                <!-- 언어선택 모듈 include -->
                <?php include 'common_modules.php'; ?>
                </div>
                <!-- <button class="btn btn-primary float-end" onclick="location.href='auth.php?action=logout';"> -->
                    <!-- <span class="icon-exit"></span><span class="xxl-only">로그아웃</span> -->
                    <!-- <span class="icon-exit"></span><span class="xxl-only">Log Out</span> -->
                <!-- </button> -->
                <button class="btn-of ic-btn ic-exit-1 float-end" onclick="location.href='auth.php?action=logout';" title="Logout">
                    <span class="xxl-only">Log Out</span>
                </button>
            </div>
        </div>
    </div>
</nav>

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script type="module">
    import { fuelcellConfig, getSelectedFuelcell, setupFuelcellSelector } from './js/config/fuelcellSelector.js';
    import { DashboardEventManager } from './js/dashboard/dash_eventManager.js';
    import { SessionService } from './js/config/get_session.js';

    document.addEventListener('DOMContentLoaded', async () => {
        // 기본 설정 초기화
        setupFuelcellSelector();
        DashboardEventManager.initializeAllComponents();

        // 사이트 선택 이벤트
        const siteSelect = document.getElementById('fuelcell-select');
        if (siteSelect) {
            siteSelect.addEventListener('change', (event) => {
                const selectedValue = event.target.value;
                const fuelcellData = fuelcellConfig[selectedValue];
                localStorage.setItem('selectedFuelcell', selectedValue);

                const currentPage = window.location.pathname.split("/").pop();
                const targetPage = currentPage === 'index-front.html' ? 'index.html' : currentPage;

                // URL 파라미터 변경
                const params = new URLSearchParams({
                    plant: fuelcellData.plant,
                    group: fuelcellData.group,
                    fuelcell: fuelcellData.fuelcell
                });

                window.location.href = `${targetPage}?${params.toString()}`;
            });

            // 현재 선택된 옵션을 클릭했을 때도 동작하도록
            siteSelect.addEventListener('click', (event) => {
                const selectedValue = siteSelect.value;
                const fuelcellData = fuelcellConfig[selectedValue];
                localStorage.setItem('selectedFuelcell', selectedValue);

                const currentPage = window.location.pathname.split("/").pop();
                const targetPage = currentPage === 'index-front.html' ? 'index.html' : currentPage;

                const params = new URLSearchParams({
                    plant: fuelcellData.plant,
                    group: fuelcellData.group,
                    fuelcell: fuelcellData.fuelcell
                });

                window.location.href = `${targetPage}?${params.toString()}`;
            });
        }

        // 현재 페이지에 따른 active 클래스 설정
        const currentPath = window.location.pathname.split("/").pop();
        const navLinks = document.querySelectorAll('.navbar-nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        });

           // URL 파라미터에서 연료전지 정보 확인
        const urlParams = new URLSearchParams(window.location.search);
        const selectedFuelcell = getSelectedFuelcell();
        const fuelcellSelect = document.getElementById('fuelcell-select');
        if (selectedFuelcell && fuelcellSelect) {
            fuelcellSelect.value = selectedFuelcell;
        }
    });

     // 링크 업데이트 함수를 전역 스코프에 추가
     window.goToPage = function(link) {

    const selectedFuelcell = getSelectedFuelcell();
    const fuelcellData = fuelcellConfig[selectedFuelcell];
    const baseUrl = link.getAttribute('href').split('?')[0];

    // fuelcellConfig의 첫 번째 항목을 기본값으로 사용
    const defaultConfig = fuelcellConfig[Object.keys(fuelcellConfig)[0]];
        
    //fuelcellData가 없으면 기본값 사용
    const params = new URLSearchParams({
        plant: fuelcellData?.plant || defaultConfig.plant,
        group: fuelcellData?.group || defaultConfig.group,
        fuelcell: fuelcellData?.fuelcell || defaultConfig.fuelcell
    });

    console.log('최종 URL:', `${baseUrl}?${params.toString()}`);
    window.location.href = `${baseUrl}?${params.toString()}`;
    return false;
    };
</script>