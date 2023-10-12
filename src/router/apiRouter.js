//api router.js

import express from "express";
import { getCourseList, getStampList } from "../controller/courseController";

const apiRouter = express.Router();

apiRouter.get("/courses", getCourseList)
apiRouter.get("/home", getCourseList)
apiRouter.post("/stamp", getStampList)

export default apiRouter;