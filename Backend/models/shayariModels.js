const mongoose = require("mongoose");

const shayariSchema = mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const shayariModel = mongoose.model("Shayari", shayariSchema);

module.exports = { shayariModel };
