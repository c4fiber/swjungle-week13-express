const mongoose = require("mongoose");

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
