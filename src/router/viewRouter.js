//view router.js

import express from "express";
import {
    courseViewController,
    homeViewController,
    howToDoController,
    introduceViewController,
    joinViewController,
    loginViewController,
    profileViewController,
    qrViewController,
    stampController,
} from "../controller/viewController";

const viewRouter = express.Router();

// controller

viewRouter.get("/", homeViewController);
viewRouter.get("/introduce", introduceViewController);
viewRouter.get("/course", courseViewController)
viewRouter.get("/qr", qrViewController)
viewRouter.get("/stamp", stampController)
viewRouter.get("/howToDo", howToDoController)
viewRouter.get("/profile", profileViewController)
viewRouter.get("/join", joinViewController)
viewRouter.get("/login", loginViewController)

export default viewRouter;

