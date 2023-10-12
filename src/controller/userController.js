import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/DB.config";


export const join = async (request, response) => {
    const joinData = request.body;
    
    // id가 중복인지 여부 체크 (duplicate id)
    const QUERY1 = `SELECT * FROM users WHERE user_email=?`;
    const user = await db.execute(QUERY1, [joinData.userId])
                    .then((result) => result[0][0]);
    if(user) {
        return response.status(400).json({ status : "ID 중복" })
    }
    // 비밀번호 암호화
    const hashPassword = await bcrypt.hash(joinData.userPassword, 8);
    
    // 회원가입
    const QUERY2 = `
        INSERT INTO users
            (user_email, user_password, user_name)
        VALUES
            (?, ?, ?)`
    
    db.execute(QUERY2, [joinData.userId, hashPassword, joinData.userName]);

    response.status(201).json({ status : "success" });
}

export const login = async (request, response) => {
    const loginData = request.body; // userId, userPassword

    // 1. 들어온 이메일에 해당하는 유저가 있는지 확인
    const QUERY1 = `SELECT * FROM users WHERE user_email = ?`;
    const user = await db.execute(QUERY1, [loginData.userId]).then((result) => result[0][0]);
    
    if(!user) {
        return response.status(400).json({ status : "아이디, 비밀번호 확인" });
    }
    // 2. 비밀번호 확인 - DB비밀번호(암호화된 값 - bcrypt), 프론트에서 보낸 비밀번호(1234)
    const isPasswordRight = await bcrypt.compare(loginData.userPassword, user.user_password);

    if(!isPasswordRight) { // !true = false => 비밀번호가 틀리면
        return response.status(400).json({ status : "아이디, 비밀번호 확인" });
    }

    // 3. json web Token 토큰을 만들어야함 -> 로그인 유지 
    // npm install jsonwebtoken
    // 3개 넣으실값, 시크릿값, 만료일
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjk2OTkzMTcwLCJleHAiOjE2OTk1ODUxNzB9.9LMGJo-Wg0xsyfyB-AkEV4ZZ0Y9T23YNqzM_mMXdOqA
    const accessToken = jwt.sign({ id: user.user_id }, process.env.SECRET_KEY, { expiresIn : "30d" }) 

    return response.status(200).json({ accessToken: accessToken });
} 

export const authMe = async(request, response) => {
    const user = request.user;
    return response.status(200).json(user);
}