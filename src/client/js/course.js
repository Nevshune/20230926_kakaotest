const locationMap = document.getElementById("location-map");
let map;
let markers = [];
let isMapDrawn = false;
let userLatitude;
let userLongitude;

// todo 추후 사라질 수 있음
let courseListInfo = [];

//
let clickCourseId = 0;

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
    map.panTo(new kakao.maps.LatLng(latitude, longitude));
};

//코스 마커 찍는 함수
const addCourseMarker = (course) => {
    let markerImage = "/file/map_not_done.png";
    let markerSize = new kakao.maps.Size(22, 35);
    console.log(course);
    if (course.users_course_id) {
        markerImage = "/file/map_complete.jpg";
        markerSize = new kakao.maps.Size(24, 35);
    }

    const image = new kakao.maps.MarkerImage(markerImage, markerSize);
    const position = new kakao.maps.LatLng(
        course.course_latitude,
        course.course_longitude
    );
    new kakao.maps.Marker({
        map: map,
        position: position,
        title: course.course_name,
        image: image,
    });
};

const allCourseMarker = () => {
    for (let i = 0; i < courseListInfo.length; i++) {
        addCourseMarker(courseListInfo[i]);
    }
};

const clickCourseList = (e, courseId) => {
    if (clickCourseId !== courseId) {
        const courseWrap = document.querySelectorAll(".course");
        for (let i = 0; i < courseWrap.length; i++) {
            courseWrap[i].classList.remove("on");
        }
        e.currentTarget.classList.add("on");

        let courseLatitude;
        let courselongitude;

        if (courseId === 0) {
            courseLatitude = userLatitude;
            courselongitude = userLongitude;
        } else {
            let matchedCourse = courseListInfo.find(
                (course) => course.course_id === courseId
            );
            courseLatitude = matchedCourse.course_latitude;
            courselongitude = matchedCourse.course_longitude;
        }
        panTo(courseLatitude, courselongitude);
        clickCourseId = courseId;
    }
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
                allCourseMarker();
            }
            //유저 마커 그리기 실행
            addUserMarker();

            if (clickCourseId === 0) {
                panTo(userLatitude, userLongitude);
            }
            //코스 마커 그리기 실행
        });
    }
};

const makeNavigationHtml = () => {
    const courseWrap = document.getElementById("course-wrap");
    console.log(courseWrap);
    let html = "";

    for (let i = 0; i < courseListInfo.length; i++) {
        html += `<li class="course" onclick="clickCourseList(event, ${courseListInfo[i].course_id})">`;
        if (courseListInfo[i].users_course_id) {
            html += `<div class="mark-wrap"><img src="/file/complete.png" /></div>`;
        }
        html += `<p>${courseListInfo[i].course_name}</p>`;
        html += `</li>`;
    }

    html += `<li id="myPosition" class="course on" onclick="clickCourseList(event, 0)">나의위치</li>`;

    console.log(html);
    courseWrap.innerHTML = html;
};

const afterGetCourseList = () => {
    makeNavigationHtml();
    configrationLocationWatch();
};

const getCourseListFetch = async () => {
    const response = await fetch("/api/courses");
    const result = await response.json();
    courseListInfo = result;
    afterGetCourseList();
    //지도를 그리고 nav
};

getCourseListFetch();
