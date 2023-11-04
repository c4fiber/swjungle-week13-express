const express = require("express");
const router = express.Router();

const Board = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

// GET all posts
router.get("/", (req, res) => {
  Board.find({})
    .then((posts) => {
      res.json({ posts: posts });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

// GET a post by id
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

  // check if the post already exists
  if (oldPost) {
    return res.status(409).json({ message: "Post already exists" });
  }
  // if password is not provided, set it to null
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
    res.json({ post }); // 파라미터 이름과 동일하게 맞춰준다.
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// PUT method to update an existing post
router.put("/:id", async (req, res) => {
  const postId = req.params.id;
  const updatedPost = req.body;

  // TODO 데이터 업데이트를 확인하고 response를 보내줄지 말지 결정해야함.
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
  // no post
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  // validate password
  if (post.password && post.password !== password) {
    return res.status(401).json({ message: "Password is incorrect" });
  }

  // TODO 게시글 삭제를 진행하는데, 결과를 확인하고 response를 보내줄지
  //      아니면 그냥 삭제를 진행할지 결정해야 함
  try {
    await Board.deleteOne({ _id: postId });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }

  // TODO 사용자가 기다릴 필요가 없다. await 사용하지 않아도 됨.
  // res.json() 호출만으로 클라이언트에게 response를 보내는지 확인해야 한다.
  try {
    Comment.deleteMany({ post_id: postId });
  } catch (error) {
    // TODO 댓글을 삭제하다가 실패하면 로그를 기록해야 한다.
    next(error);
  }
});

module.exports = router;
