const mongoose = require("mongoose");
const { post } = require("../routes/boards");

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
