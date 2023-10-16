let stampListInfo = [];
let stampCountInfo = [];
let missionCompleteInfo = [];

//스탬프 찍기 : 방문qr => 스탬프 1개 / 체험qr => 스탬프 2개 
//스탬프 찍히는 총 개수는 6개 : 실제 스탬프 합산 개수 6개가 넘더라도 6개까지만 스탬프가 찍힘
const makeStampHtml = () => {
    const stampBox = document.getElementById("stamp_box");
    const stamp_visited  = stampListInfo.filter((users_stamp) => users_stamp.stamp_level === 1)
    const stamp_experienced  = stampListInfo.filter((users_stamp) => users_stamp.stamp_level === 2)
    let stamp_completed = stamp_visited.length + stamp_experienced.length*2

    let html = "";

    if(stamp_completed >= 6 ){
        stamp_completed = 6;
        html += `<div class="absolute top-6"><img src="../file/stamp/misson_complete2.png"></div>`
    }
    // console.log(stamp_completed)
    for(let i = 0; i < stamp_completed; i++){
        html += `<div class="stamp_complete w-[82px] h-[82px] flex justify-center items-center">
                    <img src="../file/stamp/stamp_complete.png" alt="stamp_complete" class="w-full h-full">
                </div>`
    }
    for(let i = 0; i < (6-stamp_completed); i++){
        html += `<div class="stamp_preset w-[82px] h-[82px] flex justify-center items-center">
                    <img src="../file/stamp/stamp_preset.png" alt="stamp_preset" class="w-full h-full">
                </div>`
    }
    stampBox.innerHTML = html;
    // console.log(stampBox)
}

//스탬프 6개 다 모으면 미션완료! => 쿠폰보기 메뉴 나옴
const missionComplete = () => {
    const completeBox = document.getElementById("mission_complete");
    const missionBox = document.getElementById("mission_box");
    const couponBox = document.getElementById("coupon_box");

    const userData  = stampListInfo.map((draw_lots_list) => draw_lots_list.drawLotsList_id)
    // console.log(userData)

    const stamp_visited  = stampListInfo.filter((users_stamp) => users_stamp.stamp_level === 1)
    const stamp_experienced  = stampListInfo.filter((users_stamp) => users_stamp.stamp_level === 2)
    const stamp_completed = stamp_visited.length + stamp_experienced.length*2

    let completeHtml = "";
    let missionHtml = "";
    let couponHtml = "";

    if(stamp_completed >= 6){
        if(userData[0]===null){
            //미션완료
            couponBox.classList.add('hidden');
            missionHtml += `<div onclick="clickGetCoupon()" class="w-[160px] h-[40px] flex justify-center items-center bg-[#FFAA2C]">`
            missionHtml += `쿠폰받기`
            missionHtml += `</div>`
        }else{
            //쿠폰보기
            missionBox.classList.add('hidden');
            couponHtml += `<button 
            data-modal-target="defaultModal" data-modal-toggle="defaultModal" type="button" 
            class="w-[160px] h-[40px] flex justify-center items-center bg-[#292929] text-white">`
            couponHtml += `쿠폰 보기`
            couponHtml += `</button>`
        }
    }else{
        missionHtml += `<div id="stamp_count_box" class="flex justify-center items-center w-[164px] h-[41px] border border-gray font-bold bg-[#c8c8c8] text-[#333333] text-[16px] rounded tracking-wide">`
        missionHtml += `<i class="fas fa-stamp"></i>`
        missionHtml += `<div>${stamp_completed} / 6</div>`
        missionHtml += `</div>`
    }
    completeBox.innerHTML = completeHtml;
    missionBox.innerHTML = missionHtml;
    couponBox.innerHTML = couponHtml;
}

const clickGetCoupon = () => {
    missionCompleteListFetch();
    location.reload(); return;
}


//쿠폰보기
// couponHtml += `<button 
// data-modal-target="defaultModal" data-modal-toggle="defaultModal" type="button" 
// class="w-[160px] h-[40px] flex justify-center items-center bg-[#292929] text-white">`
// couponHtml += `쿠폰 보기`
// couponHtml += `</button>`


//스탬프 갯수 카운트하기
const stampCount = () => {
    const stampCountBox = document.getElementById("stamp_count_box");
    const stamp_visited  = stampListInfo.filter((users_stamp) => users_stamp.stamp_level === 1)
    const stamp_experienced  = stampListInfo.filter((users_stamp) => users_stamp.stamp_level === 2)
    let stamp_completed = stamp_visited.length + stamp_experienced.length*2
    if(stamp_completed >= 6 ){
        stamp_completed = 6;
    }
    let html = "";

    html+= `<div>${stamp_completed}/6</div>`;

    stampCountBox.innerHTML = html;
    console.log(stamp_completed);
}   

//백엔드 서버로 스탬프 리스트 정보 요청
const getStampListFetch = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch("/api/stamp",{
        method : 'POST',
        headers : {
            'Content-Type' : "application/json",
            Accept : "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
    });
    const result = await response.json();
    stampListInfo = result;

    if (response.status === 200) {
      console.log("getStampList api 연동 성공");
    //   console.log(stampListInfo)
      makeStampHtml(); 
      missionComplete(); 
    } else {
      console.log("getStampList api 연동 에러");
    }
  };

  //백엔드 서버로 스탬프 갯수 정보 요청
const getStampCountFetch = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch("/api/stamp",{
        method : 'POST',
        headers : {
            'Content-Type' : "application/json",
            Accept : "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
    });
    const result = await response.json();
    stampCountInfo = result;

    if (response.status === 200) {
      console.log("getStampCount api 연동 성공");
    //   console.log(stampListInfo)
      stampCount(); 
    } else {
      console.log("getStampCount api 연동 에러");
    }
  };

//   스탬프 미션 완료 => 미션완료 데이터 서버에 넣기
const missionCompleteListFetch = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch("/api/stamp/mission",{
        method : 'POST',
        headers : {
            'Content-Type' : "application/json",
            Accept : "application/json",
            Authorization: `Bearer ${accessToken}`,
        }
    });
    const result = await response.json();
    missionCompleteInfo = result;
    console.log(missionCompleteInfo)

    if (response.status === 200) {
      console.log("getStampCount api 연동 성공");
      clickGetCoupon();
    } else {
      console.log("getStampCount api 연동 에러");
    }
  };
  
  getStampListFetch();
  getStampCountFetch();
//   missionCompleteListFetch();