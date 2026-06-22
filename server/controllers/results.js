const Result = require("../models/Result");
const User = require("../models/User");

exports.submitResult = async (req, res) => {
  try {
    const { tid, tname, tcat, tlvl, pct, correct, total, date, answers } =
      req.body;
    const r = await Result.create({
      user: req.user.id,
      tid,
      tname,
      tcat,
      tlvl,
      pct,
      correct,
      total,
      date,
      answers,
    });
    // emit via io with user name
    const io = req.app.get("io");
    const user = await User.findById(req.user.id);
    const payload = { ...r.toObject(), uname: user.name };
    io.emit("result:submitted", payload);
    res.json({ result: r });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("user")
      .sort({ createdAt: -1 });
    res.json({ results });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};
