const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
});

module.exports = new mongoose.model("data", MovieSchema);
