// common js
// const express = require("espress")
// -> build ->
// build -> common js

import "dotenv/config";
import "regenerator-runtime"
import express from "express";
import viewRouter from "./router/viewRouter";
import apiRouter from "./router/apiRouter";

const app = express();

// node는 middleware 시스템으로 이루어져있음

// ejs 템플릿 엔진

// ejs사용선언
app.set("view engine", "ejs");
// 경로 지정
// console.log(process.cwd()); //절대경로 확인해보기
app.set("views", process.cwd() + "/src/client/html");



// json 데이터 파싱 미들웨어
app.use(express.json());

// 
app.use("/css", express.static("src/client/css"));
app.use("/js", express.static("src/client/js"));
app.use("/file", express.static("src/client/file"));


// 주소: /**, view만 전달하는 router viewRouter -> ejs만
// 주소: /api/** api만 전달하는 router apiRouter -> 데이터만


app.use("/", viewRouter);
app.use("/api", apiRouter);



app.listen(8080, () => {
    console.info("8080 포트 서버 열림 😀 http://localhost:8080");
});

// module.exports = router