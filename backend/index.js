// EXPRESS 사용
const PORT = 4000;
const express = require('express');
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


// login api
const bcrypt = require('bcrypt');

app.post('/api/register', async (req, res) => {
    const {userPw, userId} = req.body;
    
    try {
        // 비밀번호 해시
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userPw, saltRounds);

        // DB 저장
        const user = await user_auth.create({
            id: userId,
            pw: hashedPassword,
        });

        res.json({ message: '회원가입 성공', userId: user.id }); // 성공 응답
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '회원가입 실패' }); // 에러 응답
    }
})

app.post('/api/login', async (req, res) => {
    const {userId, userPw} = req.body; 

    try {
        // ID 체크
        const user = await user_auth.findOne({ where: { id: userId } });
        if(!user) {
            return res.status(400).json({message: '사용자 정보를 확인할 수 없습니다.'});
        }

        // 비밀번호 체크
        const match = await bcrypt.compare(userPw, user.pw);

        if(match) {
            res.json({ message: '로그인 성공' });
            console.log('success');
        } else {
            res.status(400).json({ message: '비밀번호 오류' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '로그인 실패' });
    }
})
