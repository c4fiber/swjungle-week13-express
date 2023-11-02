const express = require('express');
const app = express();
const port = 3000;

/* middleware */
app.use(express.json());

/* connect to mongoDB */
const connect = require("./schemas");
connect();

/* default router */
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});

/* specific routers */
const goodsRouter = require('./routes/goods');
const cartsRouter = require('./routes/carts');
app.use('/api', [goodsRouter, cartsRouter]);
