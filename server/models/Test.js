const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  q: String,
  opts: [String],
  ans: Number,
});

const TestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cat: String,
    level: String,
    time: Number,
    questions: [QuestionSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Test", TestSchema);
