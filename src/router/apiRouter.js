//api router.js

import express from "express";
import { getCourseList } from "../controller/courseController";

const apiRouter = express.Router();

apiRouter.get("/courses", getCourseList)
apiRouter.get("/home", getCourseList)

export default apiRouter;