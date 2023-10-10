const msgAlert = (position, message, type) => {
    const Toast = Swal.mixin({
        toast: true,
        position: position,
        showConfirmButton : false,
        timer : 2000,
    })
    Toast.fire({ title: massage, icon : type })
}

const courseCheckFetch = async(qrCode) => {
    console.log(qrCode)
    // 로그인여부 체크 ->

    // qrCode 올바른 데이터인지
    if(!qrCode) {
        magAlert("bottom","잘못된 QR코드 입니다.", "error")
    }
}

let video = document.createElement('video');
const canvasElement = document.getElementById('canvas');
let canvas = canvasElement.getContext('2d');

const startScan = () => {
    // 줄그리기
    const drowLine = (begin, end, color) => {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 10;
        canvas.strokeStyle = color;
        canvas.stroke();
    };

    // 비디오스트림에 QR 적용
    const tick = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvasElement.height = 500;
            canvasElement.width = 500;

            canvas.drawImage(
                video,
                0,
                0,
                canvasElement.width,
                canvasElement.height
            );

            // 캔버스에서 이미지 데이터를 가져와서 QR코드를 스캔
            let imageDate = canvas.getImageData(
                0,
                0,
                canvasElement.width,
                canvasElement,
                height
            );

            let code = jsQR(imageDate.data, imageDate.width, imageDate.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code) {
                drowLine(
                    code.location.topLeftCorner,
                    code.location.topRightCorner,
                    '#FF0000'
                );
                drowLine(
                    code.location.topRightCorner,
                    code.location.bottomRightCorner,
                    '#FF0000'
                );
                drowLine(
                    code.location.topLeftCorner,
                    code.location.bottomLeftCorner,
                    '#FF0000'
                );
                drowLine(
                    code.location.bottomLeftCorner,
                    code.location.bottomRightCorner,
                    '#FF0000'
                );
                // TODO 추가작업
                return;
            }

            console.log(code);
        }
        requestAnimationFrame(tick);
    };

    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'eveironment' } })
        .then((stream) => {
            video.srcObject = stream;
            video.setAttribute('playsinline', true);
            video.play();
            requestAnimationFrame(tick);
        })
        .catch(function (err) {
            console.error(err);
        });
};

startScan();
