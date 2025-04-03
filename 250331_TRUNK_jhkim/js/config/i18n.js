// i18n.js
export async function loadLocale(locale) {
  const response = await fetch(`js/locales/${locale}.json`);
  const data = await response.json();
  return data[locale];
}

export function applyTranslations(messages) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const keys = key.split('.');
      let value = messages;

      keys.forEach(k => {
          if (value && value[k]) {
              value = value[k];
          } else {
              value = null;
          }
      });

      if (value) {
          element.textContent = value; // 텍스트를 교체
      }
  });
}

// 초기화 함수
export async function initI18n() {
  const savedLocale = localStorage.getItem('locale') || 'ko'; // 저장된 언어 설정
  const messages = await loadLocale(savedLocale);
  applyTranslations(messages);
  document.documentElement.lang = savedLocale; // html 태그의 lang 속성 변경
}

// 언어 변경 함수
export async function changeLanguage(locale) {
  const messages = await loadLocale(locale);
  applyTranslations(messages);
  document.documentElement.lang = locale; // html 태그의 lang 속성 변경
  localStorage.setItem('locale', locale); // 선택된 언어를 로컬 스토리지에 저장

  console.log(`적용된 locale: ${locale}`);
}