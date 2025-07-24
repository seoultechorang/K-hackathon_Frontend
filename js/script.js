document.addEventListener('DOMContentLoaded', () => {
    // 상단 네비게이션 버튼
    const liveStatusBtn = document.getElementById('liveStatusBtn');
    const reportMapBtn = document.getElementById('reportMapBtn');

    // 메인 콘텐츠 섹션
    const liveStatusSection = document.getElementById('liveStatusSection');
    const reportMapSection = document.getElementById('reportMapSection');

    // 하단 푸터 버튼
    const homeBtn = document.getElementById('homeBtn');
    const searchBtn = document.getElementById('searchBtn');
    const addBtn = document.getElementById('addBtn');
    const messageBtn = document.getElementById('messageBtn');
    const profileBtn = document.getElementById('profileBtn');
    const footerButtons = [homeBtn, searchBtn, addBtn, messageBtn, profileBtn];

    // --- 상단 네비게이션 기능 ---
    function showSection(sectionToShow, buttonToActivate) {
        // 모든 섹션 숨기기
        liveStatusSection.classList.remove('active-section');
        reportMapSection.classList.remove('active-section');

        // 선택된 섹션 보이기
        sectionToShow.classList.add('active-section');

        // 모든 상단 버튼 비활성화
        liveStatusBtn.classList.remove('active');
        reportMapBtn.classList.remove('active');

        // 선택된 상단 버튼 활성화
        buttonToActivate.classList.add('active');
    }

    liveStatusBtn.addEventListener('click', () => {
        showSection(liveStatusSection, liveStatusBtn);
    });

    reportMapBtn.addEventListener('click', () => {
        showSection(reportMapSection, reportMapBtn);
        // '제보 지도' 섹션이 활성화될 때 지도를 로드하고 현재 위치를 사용
        if (typeof loadMapWithCurrentLocation === 'function') { // 함수가 정의되어 있는지 확인
            loadMapWithCurrentLocation();
        }
        console.log('제보 지도 섹션으로 전환');
    });

    // --- 하단 푸터 기능 ---
    // 홈 버튼 클릭 시 (index.html이 홈 페이지이므로 '실시간 현황' 섹션으로)
    homeBtn.addEventListener('click', () => {
        showSection(liveStatusSection, liveStatusBtn); // 홈은 실시간 현황과 연결
        activateFooterButton(homeBtn);
        console.log('홈 페이지로 이동 (실시간 현황)');
    });

    // 푸터 버튼 활성화/비활성화 함수
    function activateFooterButton(buttonToActivate) {
        footerButtons.forEach(btn => btn.classList.remove('active'));
        buttonToActivate.classList.add('active');
    }

    // 나머지 푸터 버튼 클릭 이벤트 (임시)
    searchBtn.addEventListener('click', () => {
        alert('돋보기 페이지로 이동 (구현 예정)');
        activateFooterButton(searchBtn);
    });
    addBtn.addEventListener('click', () => {
        alert('게시물 추가 페이지로 이동 (구현 예정)');
        activateFooterButton(addBtn);
    });
    messageBtn.addEventListener('click', () => {
        alert('메시지 페이지로 이동 (구현 예정)');
        activateFooterButton(messageBtn);
    });
    profileBtn.addEventListener('click', () => {
        alert('프로필 페이지로 이동 (구현 예정)');
        activateFooterButton(profileBtn);
    });

    // 초기 로드 시 '실시간 현황' 섹션 활성화 및 '홈' 버튼 활성화
    showSection(liveStatusSection, liveStatusBtn);
    activateFooterButton(homeBtn);
});