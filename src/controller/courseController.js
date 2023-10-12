import db from "../config/DB.config.js"

//공방목록 데이터 가져오기
export const getCourseList = async (req, res) => {
    const userId = req.user ? req.user.user_id : null;
    
    const QUERY = `
        SELECT * FROM ateliers_list
    `

    const courseList =await db.execute(QUERY, [1]).then((result) => result[0]);
    res.json(courseList);

    // console.log(courseList);
}

//공방 방문여부 => 스탬프 데이터 가져오기
export const getStampList = async (req, res) => {
    const userId = 1; //test용 임의값

    //users_stamp에  user_id와 atelier_id, stamp_level(lever 1:방문/lever 2:체험) 가져오기
    const QUERY = `
        SELECT * FROM users_stamp WHERE user_id = ?
    `
    const stampLevel =await db.execute(QUERY, [userId]).then((result) => result[0]);
    res.json(stampLevel)
    // console.log("=========");
    // console.log(stampLevel);
}