import db from "../config/DB.config.js"

//공방목록 데이터 가져오기
export const getCourseList = async (req, res) => {
    const userId = req.user ? req.user.user_id : null;

    const QUERY = `
        SELECT * FROM ateliers_list
    `

    const courseList = await db.execute(QUERY, [userId]).then((result) => result[0]);
    res.json(courseList);

    // console.log(courseList);
}

//공방 방문여부 => 스탬프 데이터 가져오기
export const getStampList = async (req, res) => {
    const userId = req.user ? req.user.user_id : null;
    console.log(userId);
    //users_stamp에  user_id와 atelier_id, stamp_level(lever 1:방문/lever 2:체험) 가져오기
    const QUERY = `
        SELECT * FROM users_stamp WHERE user_id = ?
    `
    const stampLevel =await db.execute(QUERY, [userId]).then((result) => result[0]);
    res.json(stampLevel)
    // console.log("=========");
    // console.log(stampLevel);
    
}

export const qrCheck = async (request, response) => {
    const userId = request.user.user_id;

    const qrInfoData = request.body;
    // console.log(qrInfoData);

    // 검증코드 1: 들어온 qr 코드에 해당하는 코스가 있는지 여부
    // qrInfoData.qrCode의 값이 ateliers_list의 visited_qr에 있는지 확인
    const QUERY1 = "SELECT * FROM ateliers_list WHERE visited_qr = ?";
    const visitedCourse = await db.execute(QUERY1, [qrInfoData.qrCode]).then((result) => result[0][0]);

    // qrInfoData.qrCode의 값이 ateliers_list의 experienced_qr에 있는지 확인
    const QUERY2 = "SELECT * FROM ateliers_list WHERE experienced_qr = ?";
    const experiencedCourse = await db.execute(QUERY2, [qrInfoData.qrCode]).then((result) => result[0][0]);

    let stampLevel;
    let course;

    if (visitedCourse) {
        stampLevel = 1;
        course = visitedCourse;
    } else if (experiencedCourse) {
        stampLevel = 2;
        course = experiencedCourse;
    } else {
        return response.status(400).json({ status: "올바른 qr 코드가 아닙니다." });
    }

    // console.log("stampLevel", stampLevel);
    // console.log("course", course);

    // 검증코드 2: 해당유저 이 코스에 방문한적이 있는지
    const QUERY3 = `SELECT * FROM users_stamp WHERE user_id = ? AND atelier_id = ?`
    const userVisited = await db.execute(QUERY3, [userId, course.atelier_id]).then((result) => result[0][0]);

    if (userVisited) return response.status(400).json({ status: "이미 방문한 장소입니다." });

    console.log("성공");

    // 검증코드 3 (수학) : 반경 100m내에 있을때만 qr코드 찍을 수 있음 - 선택
    // dist m로 나옴
    // const dist = calculatorDistance(qrInfoData.latitude, qrInfoData.longitude, course.latitude, course.longitude)

    // if (dist > 100) return response.status(400).json({ status: "거리가 너무 멉니다." });

    // 방문완료 - 데이터베이스에 추가
    const QUERY4 = "INSERT INTO users_stamp (user_id, atelier_id, stamp_level) VALUES (?, ?, ?)";
    await db.execute(QUERY4, [userId, course.atelier_id, stampLevel]);
    return response.status(201).json({ status: "success" });
}

const calculatorDistance = (currentLat, currentLon, targetLat, targetLon) => {
    currentLat = parseFloat(currentLat); // 35.875533...(문자) -> 35.875533...(실수)
    currentLon = parseFloat(currentLon);
    targetLat = parseFloat(targetLat);
    targetLon = parseFloat(targetLon);

    const dLat = (targetLat - currentLat) * 111000 // 111km
    const dLon = (targetLon - currentLon) * 111000 * Math.cos(currentLat * (Math.PI / 180))

    return Math.sqrt(dLat * dLat + dLon * dLon);
}