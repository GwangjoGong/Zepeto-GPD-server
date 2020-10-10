var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var logSchema = new Schema({
  user_code: { type: String, required: true },
  type: { type: String, required: true, enum: ["participated", "voted"] },
  votee_code: { type: String },
  votee_rank: { type: Number },
  winner_img: { type: String },
  comp_code: { type: String, required: true },
  comp_name: { type: String, required: true },
  is_done: { type: Boolean, default: false },
  end_time: { type: Date },
});

module.exports = mongoose.model("Log", logSchema);
