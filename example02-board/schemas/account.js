const mongoose = require("mongoose");


/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       required:
 *         - id
 *         - pwd
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: user id
 *         pwd:
 *           type: string
 *           description: user password
 *         name:
 *           type: string
 *           description: user's nickname
 *       example:
 *         id: guest01
 *         pwd: test1234
 *         name: c4fiber
 */
const accountSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  pwd: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Account", accountSchema);
