const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     post:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - author
 *         - content
 *         - password
 *       properties:
 *         title:
 *           type: string
 *           description: 게시글 제목
 *         date:
 *           type: string
 *           format: date
 *           description: 작성 시간
 *         author:
 *           type: string
 *           description: 작성자의 아이디
 *         content:
 *           type: string
 *           description: 게시글 내용
 *        password:
 *          type: string
 *          description: 게시글 비밀번호
 *       example:
 *         title: 새로운 포스트 1
 *         date: 2021-09-01
 *         author: guest01
 *         content: 새로운 포스트 내용 1
 *         pwd: 1234
 */
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Post", postSchema);
