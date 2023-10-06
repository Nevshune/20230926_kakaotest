const getCourseListFetch = async () => {
    const response = await fetch('/api/home');
    if (response.status === 200) {
        console.log('getCourseList api 연동 성공');
        const result = await response.json();
        courseListInfo = result;
        //   console.log(courseListInfo)
    } else {
        console.log('getCourseList api 연동 에러');
    }

    const container = document.getElementById('container'); // 컨테이너 div의 id가 'container'라고 가정
    for (let i = 0; i < courseListInfo.length; i++) {
        const course = courseListInfo[i];
        if (course.recommendation_status === 1) {
            const html = `
            <div class="w-full h-[180px] flex flex-row space-x-4 items-center border-b-[1px] border-neutral-200">
                <div class="w-[160px] h-[160px] rounded-md overflow-hidden">
                    <img src="${course.img_src}" />
                </div>
                <div class="h-[150px] w-[calc(100%-176px)] flex flex-col justify-between">
                    <div class="text-[28px] font-black">${course.title}</div>
                    <div class="flex flex-col">
                        <div class="text-[12px] font-normal">
                            <i class="fa-solid fa-map-location-dot text-green-700"></i>&nbsp;${course.address}
                        </div>
                        <div class="text-[12px] font-normal">
                            <i class="fa-solid fa-phone"></i>&nbsp;${course.number}
                        </div>
                    </div>
                    <div class="text-[12px] font-normal flex flex-wrap">${course.hashtag}</div>
                </div>
            </div>`;
            container.innerHTML += html;
        }
    }
};

getCourseListFetch();
