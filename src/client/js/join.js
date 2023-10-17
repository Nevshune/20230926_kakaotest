const joinBtn = document.getElementById('joinBtn');
const userIdInput = document.getElementById('userId');
const userPasswordInput = document.getElementById('userPassword');
const userPasswordInput2 = document.getElementById('userPassword2');
const userNameInput = document.getElementById('userName');
const userMobileInput = document.getElementById('userMobile');
const agreeInput = document.getElementById('agree');

const msgAlert = (position, message, type) => {
  const Toast = Swal.mixin({
    toast: true,
    position: position,
    showConfirmButton: false,
    timer: 2000,
  })
  Toast.fire({ title: message, icon: type })
}

const joinFetch = async () => {
  const userId = userIdInput.value;
  const userPassword = userPasswordInput.value;
  const userPassword2 = userPasswordInput2.value;
  const userName = userNameInput.value;
  const userMobile = userMobileInput.value;

  if (!userId || !userPassword || !userName || !userMobile) {
    msgAlert("bottom", "모든 필드를 채워주세요.", "error");
    return;
  }

  if (userPassword !== userPassword2) {
    msgAlert("bottom", "비밀번호가 동일하지 않아요.", "error");
    return; // 추가된 부분
  }

  if (!agreeInput.checked) {
    msgAlert("bottom", "개인정보 처리방침에 동의해주세요.", "error");
    return; // 추가된 부분
  }

  const response = await fetch("/api/join", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      userPassword: userPassword,
      userName: userName,
      userMobile: userMobile,
    })
  })
  // console.log(response);
  const result = await response.json();
  // console.log(result);

  if (response.status === 201) {
    msgAlert("center", "회원가입 성공", "success");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000)
  } else {
    msgAlert("bottom", result.status, "error");
    return;
  };
};

joinBtn.addEventListener("click", joinFetch);