import db from "../config/DB.config.js"

export const getCourseList = async (req, res) => {

    const userId = req.user ? req.user.user_id : null;
    
    const QUERY = `
    SELECT * FROM ateliers_list
    `

    const courseList =await db.execute(QUERY, [1]).then((result) => result[0]);
    res.json(courseList);
    // console.log(courseList);
}