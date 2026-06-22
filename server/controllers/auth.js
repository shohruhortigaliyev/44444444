const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Result = require("../models/Result");

const signToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  try {
    const { name, login, pass, level } = req.body;
    if (!name || !login || !pass)
      return res.status(400).json({ error: "Missing fields" });
    const exists = await User.findOne({ login });
    if (exists) return res.status(400).json({ error: "Login exists" });
    const passHash = await bcrypt.hash(pass, 10);
    // if no users exist, make first user admin
    const usersCount = await User.countDocuments();
    const role = usersCount === 0 ? "admin" : "user";
    const user = await User.create({ name, login, passHash, level, role });
    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        login: user.login,
        role: user.role,
        level: user.level,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, pass } = req.body;
    const user = await User.findOne({ login });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(pass, user.passHash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = signToken(user);
    // include latest results
    const results = await Result.find({ user: user._id }).sort({
      createdAt: -1,
    });
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        login: user.login,
        role: user.role,
        level: user.level,
        results,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    const h = req.headers.authorization;
    if (!h || !h.startsWith("Bearer ")) return res.json({ user: null });
    const token = h.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-passHash");
    if (!user) return res.json({ user: null });
    const results = await Result.find({ user: user._id }).sort({
      createdAt: -1,
    });
    return res.json({
      user: {
        id: user._id,
        name: user.name,
        login: user.login,
        role: user.role,
        level: user.level,
        results,
      },
    });
  } catch (e) {
    return res.json({ user: null });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const h = req.headers.authorization;
    if (!h || !h.startsWith("Bearer "))
      return res.status(401).json({ error: "Unauthorized" });
    const token = h.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const { current, password } = req.body;
    const ok = await bcrypt.compare(current, user.passHash);
    if (!ok) return res.status(400).json({ error: "Current password wrong" });
    user.passHash = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};
