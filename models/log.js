var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var logSchema = new Schema({
  hashCode: { type: String, required: true },
});

module.exports = mongoose.model("Log", logSchema);
