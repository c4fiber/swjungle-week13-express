const express = require('express');
const app = express();
const port = 3000;

const connect = require("./schemas");
connect();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});


const goodsRouter = require('./routes/goods');
const { default: mongoose } = require('mongoose');
app.use('/api', goodsRouter);
