var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var competitionSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cover_image: { type: String, required: true, enum: ["style", "pose"] },
  capacity: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true, default: "ongoing" },
  num_participants: { type: Number, default: 1 },
  participants: [
    {
      type: Schema.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Competition", competitionSchema);
