const express = require("express");
const app = express();
const port = 3000;

var bodyParser = require("body-parser");
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "tiny board Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "c4fiber",
        url: "https://yousayrun.store",
        email: "qudcjf153@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: ["./routes/*.js", "./schemas/*.js"],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

/* middleware */
app.use(express.json());

/* connect to mongoDB */
const connect = require("./schemas");
connect();

/* router */
const defaultRouter = require("./routes/index.js");
const boardRounter = require("./routes/boards.js");
const commentRounter = require("./routes/comments.js");
const accountRounter = require("./routes/accounts.js");

/* default router */
app.use("/", defaultRouter);

/* board rounter */
app.use("/boards", boardRounter);
app.use("/comments", commentRounter);
app.use("/accounts", accountRounter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
