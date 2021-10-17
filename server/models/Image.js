const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  base64: { type: String },
});

module.exports = mongoose.model("Image", imageSchema);
