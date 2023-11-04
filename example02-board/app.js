const express = require("express");
const app = express();
const port = 3000;

/* middleware */
app.use(express.json());

/* connect to mongoDB */
const connect = require("./schemas");
connect();

/* default routing */
app.get("/", (req, res) => {
  res.send("Welcome to tiny board system !!");
});

/* router */
const boardRounter = require("./routes/boards.js");
const commentRounter = require("./routes/comments.js");
const accountRounter = require("./routes/accounts.js");

/* board rounter */
app.use("/boards", boardRounter);
app.use("/boards/:postId/comments", commentRounter);
app.use("/accounts", accountRounter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
