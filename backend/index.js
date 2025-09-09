// EXPRESS 사용
const PORT = 4000;
const express = require('express');
const session = require('express-session');
const app = express();
app.use(express.json());

// CORS 설정
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
}));

// mySQL ORM 설정
require('dotenv').config(); // env 불러오기
const {Sequelize, DataTypes, ConnectionTimedOutError} = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,   // 데이터베이스 이름
  process.env.DB_USER,   // 사용자
  process.env.DB_PASS,   // 비밀번호
  {
    host: process.env.DB_HOST,  // 호스트
    port: process.env.DB_PORT,  // 포트
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: parseInt(process.env.DB_TIMEOUT)  // 연결 타임아웃
    }
  }
);

// session 설정
app.use(session({
    secret: 'super-sceret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 30
    }
}));

// 세션 확인
app.get('/api/session-check', (req, res) => {
    if(req.session.userId) {
        res.json({loggedIn: true, userId: req.session.userId });
    } else {
        res.json({loggedIn: false});
    }
});

// 세션 삭제
app.post("/api/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("세션 삭제 에러:", err);
      return res.status(500).json({ success: false });
    }

    // 브라우저 쿠키 삭제
    res.clearCookie("connect.sid"); // express-session 기본 쿠키 이름

    // 성공 응답
    res.json({ success: true });
  });
});

// ORM 모델
const user_auth = sequelize.define('user_auth',{
    idx: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true, 
    },
    id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    pw: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

// DB 연동
(async () => {
    try {
        await sequelize.authenticate();
        console.log('DB 연동 완료');
        await sequelize.sync({ alter: true }); // 없으면 생성, 있으면 구조 수정
        console.log('테이블 동기화 완료')
    } catch(err) {
        console.error(err);
    }
})();

// 서버 시작
app.listen(PORT, ()=> {
    console.log(`${PORT}번 포트 개방`);
});

// 프론트-백 테스트 확인 api
app.get('/api/test', (req, res) => {
    res.json({message: `백엔드 ${PORT} 포트 연결 완료함!`});
})

// 암호화 모듈
const bcrypt = require('bcrypt');

// 회원가입 모듈
app.post('/api/register', async (req, res) => {
    const {userPw, userId} = req.body;
    
    try {
        // 아이디 중복
        const isDuplicated = await user_auth.findOne({ where: {id: userId}});
        if(isDuplicated) {
            return res.status(400).json({ authenticated: false, message: "아이디가 중복되었습니다."});
        }

        // 비밀번호 해시
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userPw, saltRounds);
        
        // DB 저장
        const user = await user_auth.create({
            id: userId,
            pw: hashedPassword,
        });
        
        res.json({ authenticated: true, userId: user.id }); // 성공 응답
    } catch(err) {
        console.error(err);
        res.status(500).json({ authenticated: false }); // 에러 응답
    }
})

// login api
app.post('/api/login', async (req, res) => {
    const {userId, userPw} = req.body; 

    try {
        // ID 체크
        const user = await user_auth.findOne({ where: { id: userId } });
        if(!user) {
            return res.status(400).json({ authenticated: false, message: '아이디가 존재하지 않습니다.' });
        }

        // 비밀번호 체크
        const match = await bcrypt.compare(userPw, user.pw);

        if(match) {
            req.session.userId = userId; // 세션 ID 추가
            res.json({ authenticated: true, message: '로그인에 성공하였습니다.' });
            console.log('success');
        } else {
            res.status(400).json({ authenticated: false, message: '비밀번호가 일치하지 않습니다.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '로그인 실패' });
    }
})
