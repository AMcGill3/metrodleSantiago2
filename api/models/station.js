const mongoose = require("mongoose");

const StationsSchema = new mongoose.Schema({
  name: String,
  lines: Array,
  coordinates: Array,
});

const Station = mongoose.model("Post", PostSchema);

module.exports = Post;
