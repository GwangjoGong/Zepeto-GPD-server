var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var competitionSchema = new Schema({
  hoster_code: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cover_image: { type: String, required: true },
  capacity: { type: Number, required: true },
  theme: { type: Array, required: true },
  booth: { type: String },
  booth_fixed: { type: Boolean, default: false },
  status: {
    type: String,
    required: true,
    default: "ongoing",
    enum: ["ongoing", "voting", "finished", "archived"],
  },
  num_participants: { type: Number, default: 0 },
  participants: { type: Array, default: [] },

  end_time: { type: Date },
  archive_time: { type: Date },
});

module.exports = mongoose.model("Competition", competitionSchema);
