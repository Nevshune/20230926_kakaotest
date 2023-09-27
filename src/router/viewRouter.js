//view router.js

import express from "express";
import {
    courseViewController,
    homeViewController,
    introduceViewController,
    joinViewController,
    loginViewController,
    profileViewController,
    qrViewController,
} from "../controller/viewController";

const viewRouter = express.Router();

// controller

viewRouter.get("/", homeViewController);
viewRouter.get("/introduce", introduceViewController);
viewRouter.get("/course", courseViewController)
viewRouter.get("/qr", qrViewController)
viewRouter.get("/profile", profileViewController)
viewRouter.get("/join", joinViewController)
viewRouter.get("/login", loginViewController)

export default viewRouter;

