const usersNav = document.getElementById("usersNav");

const notLoginHtml = () => {
  let html = "";
  html += `<a href="/login"><button>로그인</button></a>`
  console.log(html);
  usersNav.innerHTML = html;
}

const logout = () => {
  localStorage.removeItem('accessToken');
  location.reload();
}

const loginHtml = (data) => {
  console.log(data);

  let html = "";
  html += `
  <div class="flex justify-center items-center text-[36px] text-[#FFAA2C] font-bold">
    My Page
  </div>
  <div class="flex justify-center items-center mt-[7px]">`;

  // 프로필 이미지가 있는 경우를 분리
  if (data.user_image) {
    html += `<img src="${data.user_image}" alt="유저 이미지" class="rounded-full bg-cover h-[90px] w-[90px]" />`
  } else {
    html += `<img src="../file/cat.png" alt="유저 이미지" class="rounded-full bg-cover h-[90px] w-[90px]" />`
  }

  html +=
    `
  </div>
  <div class="flex items-center mt-[30px] h-[40px] ml-[15px]">
      <p class="text-[16px] font-bold">아이디</P>
  </div>
  <div class="flex justify-center items-center">
      <input type="text" name="phone" placeholder="${data.user_name}"
          class="w-[90%] text-[14px] border-0 border-b-[1px] border-[#FFAA2C] h-0" readonly />
  </div>
  <div class="flex items-center mt-[26px] h-[40px] ml-[15px]">
      <p class="text-[16px] font-bold">E-mail</p>
  </div>

  <div class="flex justify-center items-center">
      <input type="email" name="name" placeholder="이메일을 입력해주세요."
          class="w-[90%] text-[14px] border-0 border-b-[1px] border-[#FFAA2C] h-0" readonly />
  </div>
  <div class="flex items-center mt-[26px] h-[40px] ml-[15px]">
      <p class="text-[16px] font-bold">연락처</P>
  </div>
  <div class="flex justify-center items-center">
      <input type="text" name="phone" placeholder="연락처를 입력해주세요."
          class="w-[90%] text-[14px] border-0 border-b-[1px] border-[#FFAA2C] h-0" readonly />
  </div>
  <div class="flex justify-center items-center mt-[61px]">
      <Button
          class="flex justify-center items-center w-[164px] h-[41px] border border-gray font-bold bg-[#292929] text-[#C8C8C8] text-[20px] rounded">
          프로필 수정하기
      </Button>
  </div>
  <button class="logout-btn" onclick="logout()">로그아웃</button>
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