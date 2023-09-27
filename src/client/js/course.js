const locationMap = document.getElementById("location-map");
let map;
let markers = [];
let isMapDrawn = false;
let userLatitude;
let userLongitude;

console.log(locationMap);

//지도그리는 함수
const drawMap = (latitude, longitude) => {
    const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 2,
    };
    map = new kakao.maps.Map(locationMap, options);
    map.setZoomable(true);
};

//유저위치마커 초기화용 함수
const deleteMarkers = () => {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
};

//유저 마커 찍는 함수
const addUserMarker = () => {
    // let markerImage = "/file/people.png";
    // let markerSize = new kakao.maps.Size(20, 30);

    let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(userLatitude, userLongitude),
    });
    markers.push(marker);
};

//해당위치로 지도를 이동한다.
const panTo = (latitude, longitude) => {
    map.panTo(new kakao.map.LatLng(latitude,longitude));
}

//코스 마커 찍는 함수
const addCourseMarker = () => {
    let markerImage = "/file/map_not_done.png";
    let markerSize = new kakao.maps.Size(22, 35);

    const image1 = new kakao.maps.MarkerImage(markerImage, markerSize);
    const position1 = new kakao.maps.LatLng(35.8755512, 128.6814907);
    new kakao.maps.Marker({
        map: map,
        position: position1,
        title: "영진직업전문학교",
        image: image1,
    });
};

//실시간 현재위치 반영 함수 -> 위치정보를 가져오는 허락이 있으면 위치정보가 갱신될 때 마다 계속 정보를 가지고 함수를 실행시킴
const configrationLocationWatch = () => {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            deleteMarkers();

            userLatitude = position.coords.latitude;
            userLongitude = position.coords.longitude;

            if (!isMapDrawn) {
                //false; => true
                drawMap(userLatitude, userLongitude);
                isMapDrawn = true;  
            }
            //유저 마커 그리기 실행
            addUserMarker();
            panTo(userLatitude,userLongitude)
            //코스 마커 그리기 실행
            addCourseMarker();
        });
    }
};

configrationLocationWatch();
