//view router.js

import express from "express";
import {
    courseViewController,
    homeViewController,
    howToDoController,
    introduceViewController,
    joinViewController,
    loginCallbackController,
    loginViewController,
    profileViewController,
    profileViewEditController,
    qrViewController,
    stampController,
} from "../controller/viewController";

const viewRouter = express.Router();

// controller

viewRouter.get("/", homeViewController);
viewRouter.get("/introduce", introduceViewController);
viewRouter.get("/course", courseViewController);
viewRouter.get("/qr", qrViewController);
viewRouter.get("/stamp", stampController);
viewRouter.get("/howToDo", howToDoController);
viewRouter.get("/profile", profileViewController);
viewRouter.get("/profileEdit", profileViewEditController);
viewRouter.get("/join", joinViewController);
viewRouter.get("/login", loginViewController);
viewRouter.get("/login/callback", loginCallbackController);

export default viewRouter;
