<nav class="navbar navbar-expand-xxl bg-body-tertiary">

    <div class="container-fluid">
        <div class="logo-container">
            <a href="./index-front.html">
                <div class="logo"></div>
            </a>
        </div>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler"
            aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarToggler">
            <ul class="navbar-nav" id="navbarNav">
                <li>
                <a href="index.html">
                    <!-- <span class="icon-quality-management"></span> -->
                    <span class="dashboard-1-svg ic-font ic-font-2-4rem"></span>
                    <span class="sub-page" data-i18n="nav.dashboard">Dashboard</span>
                </a>
                </li>
                <li>
                    <a href="bop.html">
                        <!-- <span class="icon-BOP-diagnosis"></span> -->
                        <span class="bop-svg ic-font ic-font-2-4rem"></span>
                        <span class="sub-page" data-i18n="nav.bop">BOP</span>
                    </a>
                </li>
                <li>
                    <a href="stack.html">
                        <!-- <span class="icon-stack-diagnosis"></span> -->
                        <span class="stack-svg ic-font ic-font-2-4rem"></span>
                        <span class="sub-page" data-i18n="nav.stack">Stack</span>
                    </a>
                </li>
                <!-- <li>
                    <a href="admin.html">
                        <span class="icon-device-manage"></span>
                        <span class="sub-page" data-i18n="nav.admin">Admin</span>
                    </a>
                </li> -->
                <li>
                    <a href="aitraining.html">
                        <span class="aitraining-svg ic-font ic-font-2-4rem"></span>
                        <span class="sub-page" data-i18n="nav.ai_training">AI Training</span>
                    </a>
                </li>
                <!-- <li>
                    <a href="analyze.html">
                        <span class="icon-machine-manage"></span>
                        <span class="sub-page" data-i18n="nav.analyze"></span>
                    </a>
                </li> -->
            </ul>

            <div class="login">
               <!-- <div class="site-select">
                <select id="plant-select">
                     <option>부안발전소</option>
                </select>
                </div> -->
               
                <div class="site-select">

                    <!-- fuelcellSelector.js에 의해 동적으로 채워야함-->
                    <select id="plant-select">
                    </select>
                    <select id="group-select">
                    </select>
                    <select id="fuelcell-select">
                    </select>

                    <!-- 언어선택 모듈 include -->
                    <?php include 'common_modules.php'; ?>
                    
                </div>

                <button class="btn-of ic-btn ic-exit-1 float-end" onclick="location.href='auth.php?action=logout';" title="Logout">
                    <span class="xxl-only">Log Out</span>
                </button>

            </div>

        </div>
    </div>
</nav>

<script type="module" src="navbar.js"></script>