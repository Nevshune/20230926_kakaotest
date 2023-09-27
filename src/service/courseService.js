import { findCourseListWithUser } from "../repository/courseRepository"

export const getCourseList = async () => {
    const userID = req.user ? req.user.user_id : null;
    await findCourseListWithUser(UserID)
}