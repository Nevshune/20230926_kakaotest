const locationMap = document.getElementById("location-map");
let map;
let markers = []; 
let isMapDrawn = false;
let userLatitude;
let userLongitude;

let courseListInfo = [];ㅋ
let clickCourseId = 0;

//지도 그리는 함수
const drawMap = (latitude, lognitude) => {
    const options = {
        center : new kakao.maps.LatLng(latitude, lognitude),
        level : 3
    };
    map = new kakao.maps.Map(locationMap, options);
    map.setZoomable(true);
}

//마커를 초기화하는 함수(유저 마커가 새로 생길 때 기존꺼를 지워버리기 위한 용도)
const deleteMakers = () => {
    for(let i=0; i<markers.length; i++){
        markers[i].setMap(null);
    }
    markers = [];
}

//유저 마커 그리기
const addUserMarker = () =>{
    let marker = new kakao.maps.Marker({
        map : map,
        position : new kakao.maps.LatLng(userLatitude, userLongitude)
    });
    markers.push(marker);
}

//해당 위치로 지도를 이동한다
const panTo = (latitude, longitude) => {
    map.panTo(new kakao.maps.LatLng(latitude, longitude));
}

//코스 마커 그리기
const addCourseMaker = (data) =>  {
    // let markerImage = "/file/map_not_done.png";
    // let markerSize = new kakao.maps.Size(24, 35);

    if (data.분류 === "도자기") {
        markerImage = "/file/marker/dojaki_marker.png";
        markerSize = new kakao.maps.Size(40, 40);
    }
    if (data.분류 === "페인팅") {
        markerImage = "/file/marker/painting_marker.png";
        markerSize = new kakao.maps.Size(40, 40);
    }
    if (data.분류 === "쿠킹베이킹") {
        markerImage = "/file/marker/cooking_marker.png";
        markerSize = new kakao.maps.Size(40, 40);
    }
    if (data.분류 === "목공예라탄") {
        markerImage = "/file/marker/wood_marker.png";
        markerSize = new kakao.maps.Size(40, 40);
    }
    if (data.분류 === "기타") {
        markerImage = "/file/marker/etc_marker.png";
        markerSize = new kakao.maps.Size(40, 40);
    }
    const image = new kakao.maps.MarkerImage(markerImage, markerSize);
    const position = new kakao.maps.LatLng(data.위도, data.경도);
    new kakao.maps.Marker({
        map : map,
        position : position,
        title : data.상호,
        image : image
    })
}

// 모든 코스를 돌면서 마커를 그리기 위한 함수
const allCourseMarker = () => {
    for (let i = 0; i < courseListInfo.length; i++) {
        addCourseMarker(courseListInfo[i]);
    }
}
  
const clickCourseList = (e, courseId) => {
    if (clickCourseId !== courseId) {
        const courseWrap = document.querySelectorAll(".course");
        for (let i = 0; i < courseWrap.length; i++) {
        courseWrap[i].classList.remove("on");
        }
        e.currentTarget.classList.add("on");

        let courseLatitude;
        let courseLongitude;

        if (courseId === 0) {
        courseLatitude = userLatitude;
        courseLongitude = userLongitude;
        } else {
        let matchedCourse = courseListInfo.find(course => course.공방_id === courseId);
        courseLatitude = matchedCourse.course_latitude;
        courseLongitude = matchedCourse.course_longitude;
        }
        panTo(courseLatitude, courseLongitude);
        clickCourseId = courseId;
    }
}

//현재 위치 감시 함수 => 계속 내 위치 정보를 가져오는 허락이 있으면 위치정보가 갱신될 대마다 곗속 정보를 가지고 함수를 실행시켜줌
const configurationLocationWatch = () => {
    if(navigator.geolocation){
        navigator.geolocation.watchPosition((position) => {

            deleteMakers();

            userLatitude = position.coords.latitude;
            userLongitude = position.coords.longitude;
            if(!isMapDrawn){
                drawMap(courseListInfo[1].위도,courseListInfo[1].경도);
                allCourseMarker();
                isMapDrawn  = true;
            }
            //유저 마커 그리기
            addUserMarker();
            if (clickCourseId === 0) {
                panTo(userLatitude, userLongitude);
            }
        })
    }
}

const makeNavigationHtml = () => {
    const courseWrap = document.getElementById("course-wrap");
    let html = "";

    for(let i = 0; i < courseListInfo.length; i++){
        html += `<li class="course" onclick="clickCourseList(event, ${courseListInfo[i].상호})">`
        // if(courseListInfo[i].공방_id){
        //     html += `<div class="mark-wrap"><img src="/file/complete.png"/></div>`
        // }
        html += `<p>${courseListInfo[i].상호}</p>`
        html += `</li>`
    }
    html += `<li id="myPosition" class="course on" onclick="clickCourseList(event, 0)">나의 위치</li>`
    courseWrap.innerHTML = html;
    console.log(courseWrap)
}

//코스 정보 받아온 다음에 할 일
const afterGetCourseList = () => {
    makeNavigationHtml();
    configurationLocationWatch();
}

//백엔드 서버로 코스정보 요청
const getCourseListFetch = async () => {
    const response = await fetch("/api/courses");
    if (response.status === 200) {
      console.log("getCourseList api 연동 성공");
      const result = await response.json();
      courseListInfo = result;
      console.log(courseListInfo[1].상호)
      afterGetCourseList();
    } else {
      console.log("getCourseList api 연동 에러")
    }
};


getCourseListFetch();