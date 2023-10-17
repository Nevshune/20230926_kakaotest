let stampCountInfo = [];

//스탬프 갯수 카운트하기
const stampCount = () => {
  const stampCountBox = document.getElementById("stamp_count_box");
  const stamp_visited = stampCountInfo.filter((users_stamp) => users_stamp.stamp_level === 1)
  const stamp_experienced = stampCountInfo.filter((users_stamp) => users_stamp.stamp_level === 2)
  let stamp_completed = stamp_visited.length + stamp_experienced.length * 2
  if (stamp_completed >= 6) {
    stamp_completed = 6;
  }
  let html = "";

  html += `<div>${stamp_completed}/6</div>`;

  stampCountBox.innerHTML = html;
  console.log(stamp_completed);
}


//백엔드 서버로 스탬프 갯수 정보 요청
const getStampCountFetch = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    const response = await fetch("/api/stamp", {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      }
    });

    const result = await response.json();
    stampCountInfo = result;

    if (response.status === 200) {
      console.log("getStampCount api 연동 성공");
      stampCount();
    } else {
      console.log("getStampCount api 연동 에러");
    }
  }
};


getStampCountFetch();