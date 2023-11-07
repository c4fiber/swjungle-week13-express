/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - author
 *         - content
 *       properties:
 *         post_id:
 *           type: string
 *           description: The ID of the post that the comment belongs to
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time when the comment was created
 *         author:
 *           type: string
 *           description: The name of the author of the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *         password:
 *           type: string
 *           description: The password of the comment (if required)
 *       example:
 *         post_id: 65447544eeb746556bec7796
 *         date: 2023-11-03T04:21:24.555+00:00
 *         content: good day!
 *         password: null
 */
const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
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

module.exports = mongoose.model("Comment", commentSchema);