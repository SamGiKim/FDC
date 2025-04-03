<?php
// 오토 클래스 로딩
include_once(__DIR__ . "/login_module__include/setup.php");
?>

<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="utf-8">
  <title>로그인</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link href="css/common.css" rel="stylesheet">
  <link href="css/main.css" rel="stylesheet">
  <link href="css/login.css" rel="stylesheet">
  <script src="js/bootstrap.js"></script>
  <script src="./login_module__js/bn.js"></script>
  <script src="./login_module__js/elliptic.js"></script>
</head>

<body>
  <main>
    <div class="logo"></div>
    <div class="accordion" id="accordionExample">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#login" aria-expanded="true" aria-controls="login">
            로그인
          </button>
        </h2>
        <div id="login" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
	  <div class="accordion-body">
	<!-- 240925 hjkim -->
            <form name="login_frm" action="login_auth.php" method="get" onsubmit="submit_login(event)">
	    <!-- <form name="login_frm" action="auth.php" method="get" onsubmit="submit_login(event)"> -->
	<!-- 240925 hjkim -->
              <!-- <div class="three-section"> -->

              <div class="item">
                  <div class="title">CODE</div>
                  <input type="text" name="COMPANY_CODE"/>
                </div>

                <div class="item">
                  <div class="title">ID</div>
                  <input type="text" name="LOGIN_ID" required/>
                </div>

                <div class="item">
                  <div class="title">Password</div>
                  <input type="password" name="LOGIN_PASS" required/>
                  <input type="hidden" name="CPUB_ID" />
                </div>

                <div class="item">                  
                  <div class="title">Language</div>
                  <select name="language" id="language-select">
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div class="item">                  
                  <div class="null"></div>
                  <button class="btn-of w-100">로그인</button>
                </div>

              <!-- </div> -->

            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>

<script type="module">
  import { initI18n, changeLanguage } from './js/config/i18n.js';

  window.addEventListener("load", async function() {
    // 공개키 & 비밀키 생성
    var ec_sign = new elliptic.ec('secp256k1');
    window.cli_pri_key = ec_sign.genKeyPair();
    window.cli_pub_key = cli_pri_key.getPublic('hex');
    set_cookie("SESS_ID", cli_pub_key);

    // i18n 초기화
    await initI18n();

    // 언어 선택 시 로컬 스토리지에 저장 및 번역 적용
    document.getElementById('language-select').addEventListener('change', async function() {
      var selectedLanguage = this.value;
      await changeLanguage(selectedLanguage);
    });
  });
</script>
<script>
  // >>> 서버에서 가야할 함수가 JS에 와있는 (?)
  function set_cookie(name, value, days_to_expire) {
    var expiration_date = new Date();
    expiration_date.setDate(expiration_date.getDate() + days_to_expire);
    var cookie_str = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expiration_date.toUTCString()}; path=/`;
    document.cookie = cookie_str;
  }
  // <<< 서버에서 가야할 함수가 JS에 와있는 (?)

  // >>> 진짜 클라이언트에서만 하는 부분
  function submit_login(event) {
    event.preventDefault(); // 폼 서브밋 막기
    
    var hex_str = get_hexstring(login_frm.LOGIN_PASS.value);
    login_frm.CPUB_ID.value = cli_pub_key;
    login_frm.LOGIN_PASS.value = cli_pri_key.sign(hex_str).toDER("hex");

    // 폼을 제출하려면 다음과 같이 명시적으로 submit 호출
    document.login_frm.submit();
  }
  // <<< 진짜 클라이언트에서만 하는 부분

  function get_hexstring(plaintext) {
    var text = plaintext;
    var encoder = new TextEncoder();
    var uint8_arr = encoder.encode(text);
    var hex_arr = Array.from(uint8_arr).map(byte => byte.toString(16));
    hex_str = hex_arr.join("");
    return hex_str;
  }
</script>

</html>
