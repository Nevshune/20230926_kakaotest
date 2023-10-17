const msgAlert = (position, message, type) => {
    const Toast = Swal.mixin({
        toast: true,
        position: position,
        showConfirmButton: false,
        timer: 2000,
    });
    Toast.fire({ title: message, icon: type });
};

const usersNav = document.getElementById('usersNav');

const notLoginHtml = () => {
    msgAlert('center', '로그인이 필요합니다.', 'error');
    return setTimeout(() => {
        window.location.href = '/login';
    }, 1200);
};

const logout = () => {
    localStorage.removeItem('accessToken');
    location.reload();
};

const loginHtml = (data) => {
    // console.log(data);

    let html = '';
    html += `
  <div class="flex justify-center items-center text-[24px] text-[#FFAA2C] font-bold">
    My Page
  </div>
  <div class="flex justify-center items-center mt-[7px]">
    <div class="w-[80px] h-[80px] rounded-full overflow-hidden">`;

    // 프로필 이미지가 있는 경우를 분리
    if (data.user_image) {
        html += `<img src="${data.user_image}" alt="유저 이미지" class=" bg-cover h-[80px] w-[80px]" />`;
    } else {
        html += `<img src="../file/cat.png" alt="유저 이미지" class="bg-cover h-[80px] w-[80px]" />`;
    }

    html += `
    </div>
  </div>
  
  <div class="flex items-center mt-[20px] h-[40px] ml-[15px]">
      <p class="text-[16px] font-bold">아이디</P>
  </div>
  <div class="flex justify-center items-center px-5">
    <div class="w-full border-b border-[#FFAA2C] px-4">
      ${data.user_provider === 'kakao'
            ? '카카오 로그인 유저입니다.'
            : data.user_email
        }
    </div>  
  </div>

  <div class="flex items-center mt-[20px] h-[40px] ml-[15px]">
      <p class="text-[16px] font-bold">이름</P>
  </div>
  <div class="flex justify-center items-center px-5">
    <input type="text" id="userNameEdit" 
    class="w-full ring-0 border-0 border-b-[1px] border-[#FFAA2C] px-4 focus:ring-0" placeholder="${data.user_name
        }" value="${data.user_name
        }">      
    </input>  
  </div>

  <div class="flex items-center mt-[20px] h-[40px] ml-[15px]">
      <p class="text-[16px] font-bold">모바일</P>
  </div>
  <div class="flex justify-center items-center px-5">
    <input type="text" id="userMobileEdit"
    class="w-full ring-0 border-0 border-b-[1px] border-[#FFAA2C] px-4 focus:ring-0" placeholder="${data.user_mobile
        }" value="${data.user_mobile
        }">
      
    </input>  
  </div>

  <div>
        <div class="flex justify-center items-center mt-[32px]">
            <Button
                id="editBtn"
                class="flex justify-center items-center w-[164px] h-[41px] border border-gray font-bold bg-[#292929] text-[#C8C8C8] text-[16px] rounded">
                수정 완료
            </Button>
        </div>
    </div>

  `;
    usersNav.innerHTML = html;

    const editBtn = document.getElementById('editBtn');
    const userNameEdit = document.getElementById('userNameEdit');
    const userMobileEdit = document.getElementById('userMobileEdit');

    editBtn.addEventListener('click', async () => {
        const userName = userNameEdit.value;
        const userMobile = userMobileEdit.value;
        const userId = `${data.user_id}`
        // console.log(userName, userMobile, userId)

        if (!userName || !userMobile) {
            msgAlert('bottom', '모든 필드를 채워주세요.', 'error');
            return;
        }

        // editFetch()라는 별도의 함수 없이 바로 fetch 요청을 보냅니다.
        const response = await fetch('/api/profileEdit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                userName: userName,
                userMobile: userMobile,
                userId: userId,
            }),
        });
        // console.log(response);
        const result = await response.json();
        // console.log(result);

        if (response.status === 201) {
            msgAlert('center', '회원정보 수정 완료', 'success');
            setTimeout(() => {
                window.location.href = '/profile';
            }, 2000);
        } else {
            msgAlert('bottom', result.status, 'error');
            return;
        }
    });
};

const checkUserInfo = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        notLoginHtml();
        return;
    }
    const response = await fetch('/api/token/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const result = await response.json();

    if (response.status === 200) {
        loginHtml(result);
    } else {
        notLoginHtml();
    }
};
checkUserInfo();
