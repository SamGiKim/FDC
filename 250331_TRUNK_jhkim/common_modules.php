<!-- navbar_lang_module.php 언어선택기 파일 -->

<!-- 언어선택 -->
<div class="input-radio-toggle-group d-inline-block"  id="language-selector">
    <label>
            <input type="radio" name="language-selector" value="ko" checked>
            <span class="kor-svg d-inline-block" title="한국어"></span>
             <!-- 한국어 -->
    </label>
    <label>
            <input type="radio" name="language-selector" value="en">
            <span class="eng-svg d-inline-block" title="English"></span>
            <!-- Eng -->
        </label>
</div>

<!-- 공통 모듈 스크립트 -->
<script type="module" src="./js/config/get_session.js"></script>
<script type="module" src="./js/config/get_facility_name.js"></script>
<script type="module">
    import { initI18n, changeLanguage } from './js/config/i18n.js';
    document.addEventListener('DOMContentLoaded', async () => {
        // 언어 선택기 초기화
        const languageSelector = document.getElementById('language-selector');
        const savedLocale = localStorage.getItem('locale') || 'ko';

        // 라디오 버튼 초기값 설정
        const selectedRadio = languageSelector.querySelector(`input[value="${savedLocale}"]`);
        if (selectedRadio) {
            selectedRadio.checked = true;
        }

        await initI18n(); // 페이지 로드 시 저장된 언어로 변경

        // 이벤트 리스너 변경
        if (languageSelector) {
            languageSelector.addEventListener('change', async (event) => {
                if (event.target.type === 'radio') {
                    await changeLanguage(event.target.value);
                }
            });
        }
    });


  // 원래의 console 메서드들을 저장
  const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;
    const originalConsoleDebug = console.debug;

    // 모든 console 메서드들 재정의
    console.log = function(...args) {
        const isDebug = false; // 프로덕션에서는 false로 설정
        if (isDebug) {
            originalConsoleLog.apply(console, args);
        }
    };

    console.error = function(...args) {
        const isDebug = false; 
        if (isDebug) {
            originalConsoleError.apply(console, args);
        }
    };

    console.warn = function(...args) {
        const isDebug = false;
        if (isDebug) {
            originalConsoleWarn.apply(console, args);
        }
    };

    console.info = function(...args) {
        const isDebug = false;
        if (isDebug) {
            originalConsoleInfo.apply(console, args);
        }
    };

    console.debug = function(...args) {
        const isDebug = false;
        if (isDebug) {
            originalConsoleDebug.apply(console, args);
        }
    };
</script>