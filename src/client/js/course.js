const locationMap = document.getElementById("location-map");
let map;
let markers = [];
let isMapDrawn = false;
let userLatitude;
let userLongitude;

console.log(locationMap);

const drawMap = (latitude, longitude) => {
    const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 2,
    };
    map = new kakao.maps.Map(locationMap, options);
    map.setZoomable(true);
};

const deleteMarkers = () => {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
};

const addUserMarker = () => {
    // let markerImage = "/file/people.png";
    // let markerSize = new kakao.maps.Size(20, 30);

    let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(userLatitude, userLongitude),
    });
    markers.push(marker);
};

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
            //유저 마커 그리기
            addUserMarker();
            addCourseMarker();
        });
    }
};

configrationLocationWatch();
