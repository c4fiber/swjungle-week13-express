const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to tiny board system !!");
});

router.get("/about", (req, res) => {
  res.send("check /api-docs for more information");
});

// Export router
module.exports = router;
