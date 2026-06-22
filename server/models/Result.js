const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tid: String,
    tname: String,
    tcat: String,
    tlvl: String,
    pct: Number,
    correct: Number,
    total: Number,
    date: String,
    answers: { type: Array },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Result", ResultSchema);
