const express = require('express');
const PORT = 4000;

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());


const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('codePixel', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
});

const user_auth = {
    idx: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
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
}

sequelize.sync()
.then(()=> console.log('DB sync success'))
.catch(()=> console.log('DB sync fail'));


let login = [];

app.use(express.urlencoded({extended: true}));

app.listen(PORT, ()=> {
    console.log(`${PORT}번 포트 개방`);
});

app.get('/', (req, res) => {
    res.json(login);
});

app.post('/posts', (req, res) => {
    console.log('posts');
    const {id, pw, name} = req.body;

    login.push({idx: login.length+1, id, pw, name});
    res.json({id, pw, name});
});

app.delete('/posts/:id', (req, res) => {
    const id = req.params.id
    const filteredLogin = login.filter((lg) => lg.idx !== +id);
    const isDeleted = login.length !== filteredLogin.length;
    login = filteredLogin;

    if(isDeleted) {
        console.log("삭제 완");
        return;
    }
    console.log('삭제 안됨 ㅅㅂ');
    return res.status(404).send('삭제 실패');
});

app.get('/user', user);
function user(req, res) {
    const user = url.parse(req.url, true).query;

    res.json(`[user] name: ${user.name}`)
}

app.get('/api/test', (req, res)=> {
    res.json({message: `백엔드 ${PORT} 포트 연결 완료함!`});
})
