const locationMap = document.getElementById("location-map");
let map;
let markers = [];
let isMapDrawn = false;
let userLatitude;
let userLongitude;

let courseListInfo = [];
let clickShopId = 0;

let overlays = null;

//지도 그리는 함수
const drawMap = (latitude, lognitude) => {
  return new Promise((resolve) => {
    const options = {
      center: new kakao.maps.LatLng(latitude, lognitude),
      level: 5,
    };
    map = new kakao.maps.Map(locationMap, options);
    map.setZoomable(true);
    resolve();
  });
};

//마커를 초기화하는 함수(유저 마커가 새로 생길 때 기존꺼를 지워버리기 위한 용도)
const deleteMakers = () => {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
};

//유저 마커 그리기
const addUserMarker = () => {
  let usermarkerImage = "/file/marker/user_marker.png";
  let usermarkerSize = new kakao.maps.Size(35, 35);
  const image = new kakao.maps.MarkerImage(usermarkerImage, usermarkerSize);

  let marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(userLatitude, userLongitude),
    image: image,
  });
  markers.push(marker);
};

//해당 위치로 지도를 이동한다
const panTo = (latitude, longitude) => {
  map.panTo(new kakao.maps.LatLng(latitude, longitude));
};

let clickMyPosition = () => {
  panTo(userLatitude, userLongitude);
  clickShopId = 0; // 추가
}

//코스 마커 그리기
const addCourseMarker = (data) => {
  let markerImage = "";
  let markerSize = new kakao.maps.Size(33, 44);

  if (data.category == "도자기") {
    markerImage = "/file/marker/dojaki_marker.png";
  }
  else if (data.category == "페인팅") {
    markerImage = "/file/marker/painting_marker.png";
  }
  else if (data.category == "쿠킹베이킹") {
    markerImage = "/file/marker/cooking_marker.png";
  }
  else if (data.category == "목공예라탄") {
    markerImage = "/file/marker/wood_marker.png";
  }
  else if (data.category == "기타") {
    markerImage = "/file/marker/etc_marker.png";
  }
  const image = new kakao.maps.MarkerImage(markerImage, markerSize);

  const position = new kakao.maps.LatLng(data.latitude, data.longitude);
  const marker = new kakao.maps.Marker({
    map: map,
    position: position,
    title: data.title,
    image: image,
  });

  kakao.maps.event.addListener(marker, 'click', function () {
    panTo(data.latitude, data.longitude);

    // overlay 호출 시 matchedShop 정보 전달
    overlay(data);

    let overlay_item = document.querySelectorAll('.overlay');
    overlay_item.forEach(function (e) {
      e.parentElement.previousSibling.style.display = "none";
      e.parentElement.parentElement.style.border = "0px";
      e.parentElement.parentElement.style.background = "unset";
    });
  })
};

// 모든 코스를 돌면서 마커를 그리기 위한 함수
const allCourseMarker = () => {
  for (let i = 0; i < courseListInfo.length; i++) {
    addCourseMarker(courseListInfo[i]);
  }
};

//현재 위치 감시 함수 => 계속 내 위치 정보를 가져오는 허락이 있으면 위치정보가 갱신될 대마다 곗속 정보를 가지고 함수를 실행시켜줌
const configurationLocationWatch = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(async (position) => {
      deleteMakers();

      userLatitude = position.coords.latitude;
      userLongitude = position.coords.longitude;
      if (!isMapDrawn) {
        await drawMap(35.86551347318857, 128.59342095643586);
        allCourseMarker();
        isMapDrawn = true;
      }

      //유저 마커 그리기
      addUserMarker();
    });
  }
};

//커스텀 오버레이 complete
const overlay = (matchedShop) => {
  return new Promise((resolve) => {
    // 기존의 overlays가 있다면 삭제
    if (overlays) {
      overlays.setMap(null);
      overlays = null;
    }

    const content = `
        <div class="overlay relative drop-shadow-lg">
            <div class="w-[250px] h-full bg-white z-99">
                <div class="w-full flex justify-between items-center p-[6px] bg-gray-300">
                    <div class="text-lg">${matchedShop.title}</div>
                </div>
                <div class="w-full h-full flex justify-between items-center p-[6px] gap-4">
                    <div class="w-[70px] h-[70px]">
                        <img src="${matchedShop.img_src}" alt="공방 이미지"
                            class="w-full h-full object-cover"
                        >
                    </div>
                    <div class="w-[150px] h-full">
                        <p class="w-full h-full text-xs mb-1 text-gray-500 whitespace-normal break-all">${matchedShop.address}</p>
                        <p class="w-full h-full text-xs text-gray-600 whitespace-normal break-all">${matchedShop.hashtag}</p>
                    </div>
                </div>
            </div>
            <div class="h-8 w-8 -z-10 bg-white transform translate-x-28 rotate-45 absolute -bottom-2"></div>
        </form>`;

    overlays = new kakao.maps.CustomOverlay({
      content: content,
      map: map,
      position: new kakao.maps.LatLng(matchedShop.latitude, matchedShop.longitude),
      xAnchor: 0.5,
      yAnchor: 1.5,
      zIndex: 3
    });

    resolve();
  });
}

//클릭이벤트
const clickShopList = async (e, atelierId) => {

  if (clickShopId !== atelierId) {

    let shopLatitude;
    let shopLongitude;
    let matchedShop;

    matchedShop = courseListInfo.find((atelier_list) => atelier_list.atelier_id === atelierId);
    shopLatitude = matchedShop.latitude;
    shopLongitude = matchedShop.longitude;

    panTo(shopLatitude, shopLongitude);

    await overlay(matchedShop);

    let overlay_item = document.querySelectorAll('.overlay');

    overlay_item.forEach(function (e) {
      e.parentElement.previousSibling.style.display = "none";
      e.parentElement.parentElement.style.border = "0px";
      e.parentElement.parentElement.style.background = "unset";
    });

    clickShopId = atelierId;
  }
};

//카테고리 선택하기(라디오버튼) => 선택된 카테고리에 따라 공방목록 나오기
const selectedCategory = () => {
  const radioButtons = document.querySelectorAll('input[type="radio"]:checked');

  if (radioButtons.length > 0) {
    const selectedId = radioButtons[0].getAttribute("id");
    // console.log(`선택된 항목의 id: ${selectedId}`);

    const shopsWrap = document.getElementById("category_shops");
    let html = "";

    if (selectedId === "추천") {
      let recommendationCategory = courseListInfo.filter((atelier_list) => atelier_list.recommendation_status === 1);

      for (let i = 0; i < recommendationCategory.length; i++) {
        //공방 카테고리별 색상설정
        let ringColor = ""; // 초기화
        switch (recommendationCategory[i].category) {
          case "도자기":
            ringColor = '#F54747';
            break;
          case "페인팅":
            ringColor = '#4AC2CA';
            break;
          case "쿠킹베이킹":
            ringColor = '#B5D35F';
            break;
          case "목공예라탄":
            ringColor = '#D2963C';
            break;
          case "기타":
            ringColor = '#9984D3';
            break;
          // default:
          // 기본값 설정 (원하는 값이 없는 경우)
          // ringColor = "red";
          // break;
        }

        html += `
          <li class="course" role="presentation" onclick="clickShopList(event, ${recommendationCategory[i].atelier_id})">
            <button
              id ="course" 
              class="group rounded-full w-16 h-16 bg-black/30 ring-2 bg-center ring-[${ringColor}] ring-inset text-white font-[Pretendard-Regular] relative flex justify-center items-center transition-all duration-75 "
              type="button"
              role="tab"
              aria-selected="false"
            >
              <div class="-z-10 absolute w-[100%] h-[100%] rounded-full bg-[url(${recommendationCategory[i].img_src})] bg-contain"></div>
              <div class=" text-white/90">${recommendationCategory[i].title}</div>
            </button>
          </li>
        `
      }
    } else {
      let Categories = courseListInfo.filter((atelier_list) => atelier_list.category === selectedId);

      for (let i = 0; i < Categories.length; i++) {
        //공방 카테고리별 색상설정
        let ringColor = ""; // 초기화
        switch (Categories[i].category) {
          case "도자기":
            ringColor = '#F54747';
            break;
          case "페인팅":
            ringColor = '#4AC2CA';
            break;
          case "쿠킹베이킹":
            ringColor = '#B5D35F';
            break;
          case "목공예라탄":
            ringColor = '#D2963C';
            break;
          case "기타":
            ringColor = '#9984D3';
            break;
          // default:
          // 기본값 설정 (원하는 값이 없는 경우)
          // ringColor = "red";
          // break;
        }

        html += `
          <li class="course" role="presentation" onclick="clickShopList(event, ${Categories[i].atelier_id})">
          <button
            id ="course" 
            class="group rounded-full w-16 h-16 bg-black/30 ring-2 bg-center ring-[${ringColor}] ring-inset text-white font-[Pretendard-Regular] relative flex justify-center items-center transition-all duration-75 "
            type="button"
            role="tab"
            aria-selected="false"
          >
              <div class="-z-10 absolute w-[100%] h-[100%] rounded-full bg-[url(${Categories[i].img_src})] bg-contain"></div>
              <div class=" text-white/90">${Categories[i].title}</div>
            </button>
          </li>
        `
      }
    }
    shopsWrap.innerHTML = html;
  } else {
    // console.log("라디오 버튼이 선택되지 않았습니다.");
  }
};

//백엔드 서버로 코스정보 요청
const getCourseListFetch = async () => {
  const response = await fetch("/api/courses");

  if (response.status === 200) {
    console.log("getCourseList api 연동 성공");
    const result = await response.json();
    courseListInfo = result;
    await configurationLocationWatch();
    selectedCategory();
  } else {
    console.log("getCourseList api 연동 에러");
  }
};

getCourseListFetch();