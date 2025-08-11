const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Express 서버 시작');
});

app.listen(PORT, ()=> {
    console.log('${PORT}번 포트 개방');
});