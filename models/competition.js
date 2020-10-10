var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var competitionSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cover_image: { type: String, required: true, enum: ["style", "pose"] },
  capacity: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true, default: "ongoing" },
  num_participants: { type: Number, default: 0 },
  participants: { type: Array, default: [] },
});

module.exports = mongoose.model("Competition", competitionSchema);
