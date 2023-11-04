const express = require("express");
const router = express.Router();
const Account = require("../schemas/account");

// specific account
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

// account create
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
