var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  hashCode: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
