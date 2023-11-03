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
  res.send('Welcome to tiny board system !!');
});

/* board rounter */
app.use("/boards", require("./routes/boards.js"));

app.listen(3000, () => {
        console.log('Server started on port 3000');
});
