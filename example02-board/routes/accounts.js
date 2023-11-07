const express = require("express");
const router = express.Router();
const Account = require("../schemas/account");


/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: API for managing accounts
 */

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Get a specific account by ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the account to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The account object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: account not found
 */
router.get("/:id", async (req, res, next) => {
  try {
    const account = await Account.findOne({ id: req.params.id });
    if (!account) {
      return res.status(404).json({ message: "account not found" });
    }
    res.json(account);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the new account
 *                 example: myusername
 *               pwd:
 *                 type: string
 *                 description: Password of the new account
 *                 example: mypassword
 *               name:
 *                 type: string
 *                 description: Name of the new account
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: The newly created account object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: id length must be 3~12
 */
router.post("/", async (req, res, next) => {
  const { id, pwd, name } = req.body;

  // id validation
  if (id.length < 3 || id.length > 12) {
    return res.status(400).json({ message: "id length must be 3~12" });
  }
  if (!id.match(/^[a-zA-Z0-9]+$/)) {
    return res
      .status(400)
      .json({ message: "id must consist of alphabet and number" });
  }

  // pwd validation
  if (pwd.length < 4 || pwd.length > 12) {
    return res.status(400).json({ message: "pwd length must be 4~12" });
  }
  const re = new RegExp("/[" + id + "]/g");
  if (pwd.match(re)) {
    return res.status(400).json({ message: "pwd must not include pwd" });
  }

  // name validation
  if (name.length < 2 || name.length > 30) {
    return res.status(400).json({ message: "name length must be 2~30" });
  }
  if (!name.match(/^[a-zA-Z0-9]+$/)) {
    return res
      .status(400)
      .json({ message: "name must consist of alphabet and number" });
  }

  try {
    const account = await Account.create({
      id,
      pwd,
      name,
    });
    res.status(201).json(account);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
