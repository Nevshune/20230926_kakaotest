const msgAlert = (position, message, type) => {
  const Toast = Swal.mixin({
    toast: true,
    position: position,
    showConfirmButton: false,
    timer: 2000,
  })
  Toast.fire({ title: message, icon: type })
}

const usersNav = document.getElementById("usersNav");

const notLoginHtml = () => {
  msgAlert("center", "로그인이 필요합니다.", "error");
  return setTimeout(() => {
    window.location.href = "/login";
  }, 1200);
}

const logout = () => {
  localStorage.removeItem('accessToken');
  location.reload();
}

const loginHtml = (data) => {
  console.log(data);

  let html = "";
  html += `
  <div class="flex justify-center items-center text-[24px] text-[#FFAA2C] font-bold">
    My Page
  </div>
  <div class="flex justify-center items-center mt-[7px]">
    <div class="w-[80px] h-[80px] rounded-full overflow-hidden">`;

  // 프로필 이미지가 있는 경우를 분리
  if (data.user_image) {
    html += `<img src="${data.user_image}" alt="유저 이미지" class=" bg-cover h-[80px] w-[80px]" />`
  } else {
    html += `<img src="../file/cat.png" alt="유저 이미지" class="bg-cover h-[80px] w-[80px]" />`
  }

  html +=
    `
    </div>
  </div>
  
  <div class="flex items-center mt-[20px] h-[40px] ml-[15px]">
      <p class="text-[16px] font-bold">아이디</P>
  </div>
  <div class="flex justify-center items-center px-5">
    <div class="w-full border-b border-[#FFAA2C] px-4">
      ${data.user_provider==="kakao" ? "카카오 로그인 유저입니다." : data.user_email}
    </div>  
  </div>

  <div class="flex items-center mt-[20px] h-[40px] ml-[15px]">
      <p class="text-[16px] font-bold">이름</P>
  </div>
  <div class="flex justify-center items-center px-5">
    <div class="w-full border-b border-[#FFAA2C] px-4">
      ${data.user_name}
    </div>  
  </div>

  <div class="flex items-center mt-[20px] h-[40px] ml-[15px]">
      <p class="text-[16px] font-bold">모바일</P>
  </div>
  <div class="flex justify-center items-center px-5">
    <div class="w-full border-b border-[#FFAA2C] px-4">
      ${data.user_email}
    </div>  
  </div>

  <div>
  <div class="flex justify-center items-center mt-[32px]">
      <Button
          class="flex justify-center items-center w-[164px] h-[41px] border border-gray font-bold bg-[#292929] text-[#C8C8C8] text-[16px] rounded">
          프로필 수정하기
      </Button>
  </div>
  <div class="w-full flex justify-center mt-2">
    <button class="logout-btn flex justify-center items-center w-[164px] h-[41px] border border-gray font-bold bg-[#FFAA2C] text-[#333333] text-[16px] rounded" onclick="logout()">로그아웃</button>
  </div>
  </div>
  `
  usersNav.innerHTML = html;
}


const checkUserInfo = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    notLoginHtml();
    return;
  }
  const response = await fetch("/api/token/check", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }
  });
  const result = await response.json();

  if (response.status === 200) {
    loginHtml(result);
  } else {
    notLoginHtml();
  }
}
checkUserInfo();