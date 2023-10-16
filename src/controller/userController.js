import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/DB.config';

// 회원가입
export const join = async (request, response) => {
    const joinData = request.body;

    // id 중복인지 여부 체크 (duplicate id)
    const QUERY1 = 'SELECT * FROM users WHERE user_email=?';
    const user = await db
        .execute(QUERY1, [joinData.userId])
        .then((result) => result[0][0]);

    if (user) {
        return response.status(400).json({ status: 'email 중복' });
    }

    // 비밀번호 암호화
    // 8번 최소, 12 좀 많은데? 높을수록 암호화가 높고, 시간이 많이 든다.
    const hashPassword = await bcrypt.hash(joinData.userPassword, 8);
    // console.log(hashPassword);

    const QUERY2 = `INSERT INTO users
      (user_email, user_password, user_name, user_mobile, createdDate, isDeleted)
    VALUES
      (?, ?, ?, ?, NOW(), 0)
    `;

    db.execute(QUERY2, [
        joinData.userId,
        hashPassword,
        joinData.userName,
        joinData.userMobile,
    ]);

    response.status(201).json({ status: 'success' });
};

// 로그인
export const login = async (request, response) => {
    const loginData = request.body; //userId, userPassword

    // 1. 들어온 이메일에 해당하는 유저가 있는지 확인
    const QUERY1 = `SELECT * FROM users WHERE user_email = ?`;
    const user = await db
        .execute(QUERY1, [loginData.userId])
        .then((result) => result[0][0]);

    if (!user) {
        return response.status(400).json({ status: '아이디, 비밀번호 확인!' });
    }

    // console.log(user);
    // 2. 비밀번호 확인 - DB 비밀번호(암호화된 값 = bcrypt), 프론트에서 보낸 비밀번호(1234)
    const isPasswordRight = await bcrypt.compare(
        loginData.userPassword,
        user.user_password
    );
    // True, False
    if (!isPasswordRight) {
        // 비밀번호가 틀렸을 때 들어옴
        return response.status(400).json({ status: '아이디, 비밀번호 확인!!' });
    }

    // 3. json web Token을 만들어야한다. -> 로그인 유지
    // 3개. 넣으실값, 시크릿값, 만료일
    const accessToken = jwt.sign({ id: user.user_id }, process.env.SECRET_KEY, {
        expiresIn: '30d',
    });

    // console.log(accessToken);
    return response.status(200).json({ accessToken: accessToken });
};

export const authMe = async (request, response) => {
    const user = request.user;
    return response.status(200).json(user);
};

// 회원정보 수정

export const profileEdit = async (request, response) => {

  console.log("#####################")
  console.log(response.req.body)
  console.log("#####################")
const profileEditData = response.req.body;

  // id 중복인지 여부 체크 (duplicate id)

  // console.log(hashPassword);

  
  const QUERY2 = `
  UPDATE users
  SET user_name = ?, user_mobile = ?
  WHERE user_id = ?;
`;

  db.execute(QUERY2, [
    profileEditData.userName,
    profileEditData.userMobile,
    profileEditData.userId,
  ]);

  response.status(201).json({ status: 'success' });
};
