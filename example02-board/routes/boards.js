const express = require("express");
const router = express.Router();

const Board = require("../schemas/post.js");

// GET method to retrieve all posts
router.get("/", (req, res) => {
  Board.find({})
  .then((posts) => { 
    res.json({ posts: posts });
  }).catch((err) => {
    console.error(err);
    next(err);
  });
});

router.get("/:id", (req, res) => {
  const postId = req.params.id;
  Board.findOne({ _id: postId })
    .then((post) => {
      res.json({ post: post });
    })
    .catch((err) => {
      res.status(404).json({ message: "Post not found" });
    });
});

// POST method to create a new post
router.post("/", async (req, res) => {
  const newPost = req.body;
  const oldPost = await Board.findOne({
    title: newPost.title,
    author: newPost.author,
    content: newPost.content,
    password: newPost.password,
  });
  if (oldPost) {
    return res.status(409).json({ message: "Post already exists" });
  }

  // check password field is exist or not
  if (!newPost.password) {
    newPost.password = null;
  }

  try {
    const post = await Board.create({
      title: newPost.title,
      author: newPost.author,
      content: newPost.content,
      password: newPost.password,
    });
    res.json({ post });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// PUT method to update an existing post
router.put("/:id", async (req, res) => {
  const postId = req.params.id;
  const updatedPost = req.body;

  try {
    const post = await Board.findOneAndUpdate(
      { _id: postId },
      {
        title: updatedPost.title,
        author: updatedPost.author,
        content: updatedPost.content,
        password: updatedPost.password,
      },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE method to delete an existing post
router.delete("/:id", async (req, res) => {
  const postId = req.params.id;
  const password = req.body ? req.body.password : null;

  const post = await Board.findOne({ _id: postId });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (post.password && post.password !== password) {
    return res.status(401).json({ message: "Password is incorrect" });
  }

  try {
    await Board.deleteOne({ _id: postId });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }

});

module.exports = router;
