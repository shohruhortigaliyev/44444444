const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    login: { type: String, required: true, unique: true },
    passHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    level: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
