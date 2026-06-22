const Test = require("../models/Test");

exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.json({ tests });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createTest = async (req, res) => {
  try {
    const { name, cat, level, time, questions } = req.body;
    const t = await Test.create({ name, cat, level, time, questions });
    // emit via io
    const io = req.app.get("io");
    io.emit("test:created", t);
    res.json({ test: t });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};
