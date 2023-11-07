const express = require("express");
const router = express.Router();

const Board = require("../schemas/post.js");
const Comment = require("../schemas/comment.js");

/**
 * @swagger
 * tags:
 *   name: Boards
 *   description: API for managing posts
 */

/**
 * @swagger
 * /boards:
 *   get:
 *     summary: Get all posts
 *     tags: [Boards]
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
*              schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /boards/{id}:
 *   get:
 *     summary: Get a post by id
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post id
 *     responses:
 *       200:
 *         description: A post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /boards:
 *   post:
 *     summary: Create a new post
 *     tags: [Boards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: A post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       409:
 *         description: Post already exists
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /boards/{id}:
 *   put:
 *     summary: Update an existing post
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: A post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /boards/{id}:
 *   delete:
 *     summary: Delete an existing post
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post id
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Whether the post was successfully deleted
 *       401:
 *         description: Password is incorrect
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
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

  try {
    await Board.deleteOne({ _id: postId });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }

  try {
    Comment.deleteMany({ post_id: postId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
