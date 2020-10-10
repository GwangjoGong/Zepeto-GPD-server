var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  hashcode: { type: String, required: true },
  nickname: { type: String, required: true },
  medal_num_1r: { type: Number, default: 0 },
  medal_num_2r: { type: Number, default: 0 },
  medal_num_3r: { type: Number, default: 0 },
  medal_num_vote: { type: Number, default: 0 },
  medal_num_win: { type: Number, default: 0 },
  participating_comps: { type: Array, default: [] },
  hosting_comps: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
