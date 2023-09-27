import db from "../config/DB.config.js"

export const getCourseList = async (req, res) => {

    const userId = req.user ? req.user.user_id : null;
    
    const QUERY = `
    SELECT c.*, uc.users_course_id
    FROM course c
    LEFT JOIN users_course uc
    ON c.course_id = uc.course_id AND uc.user_id = ?
    `

    const courseList =await db.execute(QUERY, [1]).then((result) => result[0]);

    res.json(courseList);
}