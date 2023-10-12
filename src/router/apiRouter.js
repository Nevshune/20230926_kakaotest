//api router.js

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { getCourseList, qrCheck } from "../controller/courseController";
import { join, login } from "../controller/userController";
// import { handleKakaoLogin, isAuth } from "../middleware/auth";
import { Strategy as KakaoStrategy } from "passport-kakao";

const apiRouter = express.Router();

//코스
apiRouter.get("/courses", getCourseList)
apiRouter.get("/home", getCourseList)

// 회원가입
apiRouter.post("/join", join)
apiRouter.post("/login", login)

export default apiRouter;