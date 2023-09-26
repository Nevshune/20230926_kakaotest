// common js
// const express = require("espress")
// -> build ->
// build -> common js
import express from "express";

const app = express();

// node는 middleware 시스템으로 이루어져있음

// ejs 템플릿 엔진

// ejs사용선언
app.set("view engine", "ejs");
// 경로 지정
// console.log(process.cwd()); //절대경로 확인해보기
app.set("views", process.cwd() + "/src/client/html");

app.use((req, res, next) => {
    console.log("지나갑니다");
    next();
});

// controller

app.get("/", (req, res, next) => {
    // mvc
    const homeData = {
        data: [{ name: "철수" }, { name: "영희" }, { name: "민수" }],
    };
    res.render("home", homeData);
    next();
});

app.use((req, res, next) => {
    console.log("지나갑니다2");
    next();
});

app.get("/introduce", (req, res) => {
    const homeData = {
        data: [{ name: "철수" }, { name: "영희" }, { name: "민수" }]}
    res.render("introduce", homeData);
});

app.get("/common", (req, res) => {
    res.render("common");
});

app.listen(8080, () => {
    console.info("8080 포트 서버 열림 😀 http://localhost:8080");
});
