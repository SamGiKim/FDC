// stack_tag_manager.js
import { 
  searchWithData,
  addSearchButtonListener, 
  initCheckboxStateAndSelectAll, 
  initializeTagColorSelector,
  updateSelectedCount
} from './stack_search.js'

// 기능 플래그 설정
const featureFlags = {
  saveTagWithGet: true,
  renderTags: true,
  tagDeletion: true,
  updateTagButtonLabel: false,
  tagSelection: true
};


// 체크박스 상태 변경 감지 및 버튼 텍스트 업데이트
if (featureFlags.updateTagButtonLabel) {
  document.addEventListener('change', function (event) {
    if (event.target.type === 'checkbox' && event.target.name === 'search-checkbox') {
      updateTagButtonLabel();
    }
  });
}

// 태그 호출(GET, fetch는 HTTP 메소드를 별도로 지정하지 않으면 GET 요청이 기본적으로 수행된다.)
// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function () {
  console.log("stack_tag_manager DOM 로드됨")

  // 색상 선택기 초기화
  initializeTagColorSelector();
  

  // 태그 컨테이너에 이벤트 위임 설정
  const tagContainer = document.querySelector('.tags-container');
  if (tagContainer) {
      tagContainer.addEventListener('click', function(e) {
          // 태그 추가 버튼 클릭 시
          if (e.target && e.target.id === 'new-tag') {
              e.preventDefault();
              e.stopPropagation();
              handleTagConfirm();
          }
      });
  }

  //태그 로드
  fetch('js/stack/load_tags.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('태그를 불러오는데 실패했습니다.');
      }
      return response.json();
    })
    .then(tags => {
      if (featureFlags.renderTags) {
        renderTags(tags);
      }
    })
    .catch(error => console.error('Error loading tags:', error));
});

// 태그 추가 처리 함수
function handleTagConfirm() {
  console.log('handleTagConfirm 실행');
  const tagInput = document.getElementById('new-tag-text');
  if (!tagInput) {
      console.error('태그 입력 필드를 찾을 수 없습니다.');
      return;
  }

  const tagText = tagInput.value.trim();
  console.log('입력된 태그:', tagText); // 디버깅용
  
  if (tagText) {
      if (isDuplicateTag(tagText)) {
          alert("중복된 태그입니다.");
          tagInput.value = '';
      } else {
          saveTagWithGet(tagText);
          cancelTag(); // 태그 추가 UI 닫기
      }
  } else {
      alert('태그명을 입력해주세요.');
  }
}


// 전체 태그 목록을 불러오는 함수
function loadAllTags() {
  fetch('js/stack/load_tags.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('태그를 불러오는데 실패했습니다.');
      }
      return response.json();
    })
    .then(tags => {
      if (featureFlags.renderTags) {
        renderTags(tags);
      }
    })
    .catch(error => console.error('Error loading tags:', error));
}



//  드래그로 태그이동(stack_search.css에 관련 효과 있음)
///////////////////////////////////////////////////////////////////////////////////
// 드래그 시작 시 호출되는 함수
function handleDragStart(e) {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', e.target.id);
  e.target.classList.add('dragging');
}

// 드래그 중인 요소가 드롭될 수 있는 영역 위에 있을 때 호출되는 함수
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  clearDragOver(); // 모든 드래그 오버 효과를 초기화

  const dropzone = e.target.closest('.hashtag');
  if (dropzone) {
    const rect = dropzone.getBoundingClientRect(); // 호출된 요소의 크기와 뷰포트에 대한 상대적인 위치 정보 포함
    const midPoint = rect.left + (rect.width / 2); // .hashtag 요소의 중간 지점 계산
    if (e.clientX < midPoint) { // e.clientX는 이벤트 객체 속성, 뷰포트 기준으로 한 마우스 포인터의 수평 위치
      dropzone.classList.add('drag-over-left'); // 왼쪽에 드롭 표시
    } else {
      dropzone.classList.add('drag-over-right'); // 오른쪽에 드롭 표시
    }
  }
}

function clearDragOver() { // 
  document.querySelectorAll('.hashtag.drag-over-left, .hashtag.drag-over-right').forEach(tag => {
    tag.classList.remove('drag-over-left', 'drag-over-right');
  });
} 

function handleDragLeave(e) {
  const dropzone = e.target.closest('.hashtag');
  if (dropzone) {
    dropzone.classList.remove('drag-over-left', 'drag-over-right');
  }
}

// 드롭 이벤트 처리
function handleDrop(e) {
  e.preventDefault();
  const draggableElement = document.getElementById(e.dataTransfer.getData('text/plain'));
  const dropzone = e.target.closest('.hashtag');
  if (dropzone) {
    const rect = dropzone.getBoundingClientRect();
    const midPoint = rect.left + (rect.width / 2); // 요소의 중간 지점 계산
    if (e.clientX < midPoint) {
      dropzone.parentElement.insertBefore(draggableElement, dropzone); // 드롭된 요소의 앞에 삽입
    } else {
      dropzone.parentElement.insertBefore(draggableElement, dropzone.nextSibling); // 드롭된 요소의 뒤에 삽입
    }
    updateTagsOnServer(); // 서버에 태그 순서 업데이트
  }
  clearDragOver(); // 모든 드래그 오버 효과를 초기화
  e.dataTransfer.clearData();
}

// 드래그 이벤트 리스너 추가
document.querySelectorAll('.hashtag').forEach(tag => {
  tag.addEventListener('dragstart', handleDragStart);
  tag.addEventListener('dragover', handleDragOver);
  tag.addEventListener('dragleave', handleDragLeave);
  tag.addEventListener('drop', handleDrop);
});

// 서버에 태그 순서 업데이트(마우스 드래그로 바꾸기)
function updateTagsOnServer() {
  const tags = Array.from(document.querySelectorAll('.hashtag')).map((tag, index) => ({
    name: tag.querySelector('span').textContent.trim(),
    color: tag.querySelector('span').dataset.color,
    order: index
  }));
  fetch('js/stack/update_tag_order.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tags)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return response.json(); // JSON 형식으로 응답 받기
  })
  .then(data => {
    if (data.success) {
      console.log('태그 순서 업데이트 결과:', data);
    } else {
      console.error('태그 순서 업데이트 실패:', data.message);
    }
  })
  .catch(error => {
    console.error('태그 순서 업데이트 실패:', error);
  });
}

// 태그 호출
// (GET, fetch는 HTTP 메소드를 별도로 지정하지 않으면 GET 요청이 기본적으로 수행된다.)
// 태그 데이터를 불러와서 렌더링하는 함수
export function renderTags(tags) {
  const hashtagOuter = document.querySelector('.scrollmini.hashtag-outer .tags-container');
  hashtagOuter.innerHTML = ''; // 기존 태그 지우기
  
  // 태그 추가 버튼을 먼저 추가
  const addTagDiv = document.createElement('div');
  addTagDiv.className = 'd-inline-block m-1 add-tag-container';
  addTagDiv.style.height = '25px';
  addTagDiv.innerHTML = `
    <input type="text" class="show-click-input d-none" id="new-tag-text" placeholder="태그명 입력"
      onkeyup="if(window.event.keyCode==13){}" data-listener-added_44c3e337="true">
    <input type="color" id="tag-color-selector" class="d-none" value="#FFFFFF" 
      style="padding: 2px;height: 21px;width: 21px;vertical-align: middle;border-radius: 0;">
    <button class="plus" title="태그추가" onclick="plusTag()">+</button>
    <button class="confirm d-none" id="new-tag">태그추가</button>
    <button class="cancel d-none" title="취소" onclick="cancelTag()">×</button>
  `;

  // 동적으로 생성된 버튼에 이벤트 리스너 추가
  // const confirmButton = addTagDiv.querySelector('#new-tag');
  // // 이벤트 리스너를 직접 handleTagConfirm으로 연결
  // confirmButton.addEventListener('click', function(e) {
  //     e.preventDefault();
  //     handleTagConfirm();
  // });

  hashtagOuter.appendChild(addTagDiv);

  tags.forEach((tag, index) => {
    const hashtagDiv = document.createElement('div');
    hashtagDiv.classList.add('hashtag');
    hashtagDiv.draggable = true;
    hashtagDiv.id = `tag-${index}`;

    const button = document.createElement('button');
    button.classList.add('main', 'tag-selector');
    button.id = `button-${index}`;

    const newSpan = document.createElement('span');
    newSpan.textContent = tag.name;

    if (tag.color && tag.color !== 'undefined') {
      newSpan.dataset.color = tag.color;
      button.style.setProperty('--tag-color', tag.color);
      button.style.setProperty('border-color', tag.color);
    }

    button.appendChild(newSpan);
    hashtagDiv.appendChild(button);

    // Add delete button
    const delButton = document.createElement('button');
    delButton.classList.add('del');
    delButton.title = '삭제';
    delButton.textContent = '×';
    hashtagDiv.appendChild(delButton);

    // Add finish button
    const finishButton = document.createElement('button');
    finishButton.classList.add('finish');
    finishButton.title = '완료';
    finishButton.textContent = '×';
    hashtagDiv.appendChild(finishButton);

    hashtagOuter.appendChild(hashtagDiv);

    // 태그 클릭 이벤트 리스너 수정
    button.addEventListener('click', function () {
      const tagContent = button.textContent.trim();
      const tagWithHash = `#${tagContent}`;
      const labelInput = document.getElementById('input-label');
      let currentInputValue = labelInput.value.trim();

      if (button.classList.contains('active')) {
        // Remove tag
        button.classList.remove('active');
        const newInputValue = currentInputValue.replace(new RegExp(`\\s*${tagWithHash}\\s*`, 'g'), ' ').trim();
        labelInput.value = newInputValue;
      } else {
        // 태그 추가
        button.classList.add('active');
        if (currentInputValue) {
          labelInput.value = `${currentInputValue} ${tagWithHash}`;
        } else {
          labelInput.value = tagWithHash;
        }
      }

        // 검색 조건 업데이트 및 검색 실행
      const updatedConditions = { LABEL: { value: labelInput.value, condition: 'contains' } };
      searchWithData(updatedConditions);

      // 검색 버튼 클릭 이벤트 자동 트리거
      document.querySelector('.stk-sch-btn').click();
    });

    // Add drag event listeners
    hashtagDiv.addEventListener('dragstart', handleDragStart);
    hashtagDiv.addEventListener('dragover', handleDragOver);
    hashtagDiv.addEventListener('drop', handleDrop);
  });
}

// 검색 버튼 리스너
addSearchButtonListener();


function updateInputLabel(inputLabel) {
  const activeTags = document.querySelectorAll('.main.tag-selector.active');
  const tagNames = Array.from(activeTags).map(tag => `#${tag.textContent.trim()}`);
  inputLabel.value = tagNames.join('');
}

// 태그 삭제 버튼
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('del') && featureFlags.tagDeletion) {
    const parentElement = event.target.parentElement;
    if (parentElement) {
      const spanElement = parentElement.querySelector('span');
      if (spanElement) {
        const tagToRemove = spanElement.textContent.trim();
        removeTag(tagToRemove, parentElement);
      } else {
        console.error('Span element not found');
      }
    } else {
      console.error('Parent element not found');
    }
  }
});


// 태그 삭제 함수
function removeTag(tagName, parentElement) {
  const confirmMessage = `정말로 태그 "${tagName}"을(를) 삭제하시겠습니까?`;
  if (confirm(confirmMessage)) {
      console.log('삭제할 태그:', tagName); // 디버깅용

      // POST 요청으로 변경
      fetch('js/stack/delete_tag.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
              tag: tagName.trim()
          })
      })
      .then(response => {
          if (!response.ok) {
              return response.text().then(text => {
                  throw new Error(`서버 응답 오류: ${response.status}, ${text}`);
              });
          }
          return response.json();
      })
      .then(data => {
          console.log('서버 응답:', data); // 디버깅용
          
          if (data.error) {
              throw new Error(data.error);
          }
          
          if (data.success) {
              console.log('태그가 성공적으로 삭제되었습니다.');
              loadAllTags();
          } else {
              throw new Error('태그 삭제 실패');
          }
      })
      .catch(error => {
          console.error('태그 삭제 중 오류 발생:', error);
          alert('태그 삭제 실패: ' + error.message);
      });
  } else {
      console.log('태그 삭제가 취소되었습니다.');
  }
}

// 태그 선택 이벤트 리스너를 초기화하는 함수
function initializeTagSelection() {
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('tag-selector')) {
      console.log("태그 선택됨:", event.target.textContent);
      const tagInput = document.getElementById('new-tag-text');
      const selectedTag = event.target.textContent.trim(); // 선택된 태그의 텍스트 가져오기

      // 입력 필드에 라벨이 있으면, 라벨 뒤에 선택된 태그 추가
      if (tagInput.value) {
        tagInput.value += ` #${selectedTag}`;
      }
    }
  });
}


////////////////////////////////////////////////////////////////////////////
// // 태그 추가 버튼 이벤트 초기화 함수
// // 태그 컨테이너에 이벤트 위임 설정
// document.querySelector('.tags-container').addEventListener('click', function(e) {
//   // 태그 추가 버튼 클릭 시
//   if (e.target.matches('#new-tag')) {
//       e.preventDefault(); // 이벤트 기본 동작 방지
//       handleTagConfirm(); // 이벤트 객체를 전달하지 않음
//   }
// });


// 태그 저장 함수
function saveTagWithGet(tagName) {
  // 1. 입력값 검증 추가
  if (!tagName || tagName.trim() === '') {
      alert('태그 이름을 입력해주세요.');
      return;
  }

  const colorSelector = document.getElementById('tag-color-selector');
  const selectedColor = colorSelector.value;

  // 2. 태그 중복 체크
  if (isDuplicateTag(tagName.trim())) {
      alert('이미 존재하는 태그입니다.');
      return;
  }

  // 3. 인코딩 처리
  const params = new URLSearchParams({
      tag: tagName.trim(),
      color: selectedColor.trim()
  }).toString();
  
  // 4. 에러 처리 개선
  fetch(`js/stack/save_tag.php?${params}`)
  .then(response => {
      if (!response.ok) {
          return response.text().then(text => {
              throw new Error(`저장 실패 (${response.status}): ${text}`);
          });
      }
      return response.json();
  })
  .then(data => {
      console.log('서버 응답:', data);
      // success 필드 대신 message 필드 확인
      if (data.message && data.message === '태그가 성공적으로 저장되었습니다.') {
          loadAllTags();
          
          // 입력 필드 초기화
          document.getElementById('new-tag-text').value = '';
          colorSelector.value = '#ffffff';
          colorSelector.style.color = '#ffffff';
      } else {
          throw new Error(data.error || '알 수 없는 오류가 발생했습니다.');
      }
  })
  .catch(error => {
      console.error('태그 저장 중 오류 발생:', error);
      alert('태그 저장 실패: ' + error.message);
  });
}

// 중복 태그 체크 함수
function isDuplicateTag(tagName) {
  // 모든 태그 선택자를 한 번에 확인
  const allTags = document.querySelectorAll('.hashtag span');
  return Array.from(allTags).some(tag => tag.textContent.trim() === tagName);
}