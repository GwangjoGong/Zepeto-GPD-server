var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var logSchema = new Schema({
  user_code: { type: String, required: true },
  user_nickname: { type: String },
  user_rank: { type: Number },
  user_votes: { type: Number },

  type: { type: String, required: true, enum: ["participated", "voted"] },

  votee_code: { type: String },
  votee_nickname: { type: String },
  votee_img: { type: String },
  votee_rank: { type: Number },
  votee_votes: { type: Number },

  winner_nickname: { type: String },
  winner_code: { type: String },
  winner_img: { type: String },
  winner_votes: { type: Number },

  comp_code: { type: String, required: true },
  comp_name: { type: String, required: true },

  is_done: { type: Boolean, default: false },
});

module.exports = mongoose.model("Log", logSchema);
