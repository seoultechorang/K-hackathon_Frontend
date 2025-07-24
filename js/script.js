// 지도 인스턴스를 저장할 변수 (전역 접근을 위해 전역 스코프에 선언)
let mapInstance = null; 

// Geolocation API를 사용하여 현재 위치를 가져오고 지도를 로드하는 함수
// 이 함수는 script.js 내에서 또는 HTML에서 호출될 수 있도록 전역으로 선언
function loadMapWithCurrentLocation() {
    // sop 객체가 로드되었는지 확인 (통계청 지도 API 스크립트 로드 후에 실행되어야 함)
    // sop 객체가 정의되지 않았다면, 지도를 초기화할 수 없으므로 함수를 종료합니다.
    if (typeof sop === 'undefined' || typeof sop.map === 'undefined') {
        console.error("통계청 지도 API (sop 객체)가 아직 로드되지 않았거나 정의되지 않았습니다.");
        // API 로드 실패 시 대체 동작을 여기에 추가할 수 있습니다.
        // 예를 들어, 일정 시간 후 재시도하거나 사용자에게 알림을 띄울 수 있습니다.
        return; 
    }

    if (mapInstance === null) { // 지도가 아직 생성되지 않았을 경우에만 생성
        mapInstance = sop.map('map-container'); // 지도 컨테이너에 지도 생성
    }

    // 기본 위치 (대전) 설정: 사용자 위치를 가져오지 못할 경우 사용
    let defaultCenter = sop.utmk(953427, 1950827); 
    let defaultZoom = 9; 

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // 위치 정보 가져오기 성공
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                const utmkXY = new sop.LatLng(lat, lng);
                const currentUtmk = sop.utmk(utmkXY.x, utmkXY.y); 

                mapInstance.setView(currentUtmk, defaultZoom); 
                console.log(`현재 위치: 위도 ${lat}, 경도 ${lng}`);
                console.log(`변환된 UTM-K: x=${utmkXY.x}, y=${utmkXY.y}`);

                // ---------- 현재 위치에 기본 마커 추가 시작 ----------
                const currentPositionMarker = sop.marker([utmkXY.x, utmkXY.y]); 
                currentPositionMarker.addTo(mapInstance);
                currentPositionMarker.bindPopup("<b>현재 나의 위치</b><br>여기에요!");
                // ---------- 현재 위치에 기본 마커 추가 끝 ----------

            },
            (error) => {
                // 위치 정보 가져오기 실패 또는 권한 거부
                console.error("위치 정보를 가져오는데 실패했습니다:", error);
                alert("위치 정보를 가져올 수 없습니다. 기본 위치로 지도를 표시합니다.");
                mapInstance.setView(defaultCenter, defaultZoom); 
                
                // 기본 위치에 기본 마커 추가 (위치 정보 실패 시)
                const defaultPositionMarker = sop.marker([defaultCenter.x, defaultCenter.y]);
                defaultPositionMarker.addTo(mapInstance);
                defaultPositionMarker.bindPopup("<b>기본 위치</b><br>위치 정보를 가져올 수 없습니다.");

            },
            {
                enableHighAccuracy: true, 
                timeout: 5000, 
                maximumAge: 0 
            }
        );
    } else {
        // Geolocation을 지원하지 않는 브라우저
        alert("이 브라우저에서는 위치 정보를 지원하지 않습니다. 기본 위치로 지도를 표시합니다.");
        mapInstance.setView(defaultCenter, defaultZoom); 

        // 기본 위치에 기본 마커 추가 (Geolocation 미지원 시)
        const defaultPositionMarker = sop.marker([defaultCenter.x, defaultCenter.y]);
        defaultPositionMarker.addTo(mapInstance);
        defaultPositionMarker.bindPopup("<b>기본 위치</b><br>브라우저가 Geolocation을 지원하지 않습니다.");
    }
}


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
        // 중요: 통계청 API 스크립트 (sop 객체)가 로드된 후에 loadMapWithCurrentLocation이 호출되어야 합니다.
        // 현재는 HTML에서 통계청 API 스크립트가 먼저 로드된 후 script.js가 로드되므로 문제 없습니다.
        loadMapWithCurrentLocation(); 
        console.log('제보 지도 섹션으로 전환');
    });

    // --- 하단 푸터 기능 ---
    homeBtn.addEventListener('click', () => {
        showSection(liveStatusSection, liveStatusBtn); 
        activateFooterButton(homeBtn);
        console.log('홈 페이지로 이동 (실시간 현황)');
    });

    function activateFooterButton(buttonToActivate) {
        footerButtons.forEach(btn => btn.classList.remove('active'));
        buttonToActivate.classList.add('active');
    }

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