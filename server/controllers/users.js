const User = require("../models/User");
const Result = require("../models/Result");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passHash").sort({ createdAt: -1 });
    // attach results summary
    const out = await Promise.all(
      users.map(async (u) => {
        const results = await Result.find({ user: u._id }).sort({
          createdAt: -1,
        });
        return {
          id: u._id,
          name: u.name,
          login: u.login,
          role: u.role,
          level: u.level,
          results,
        };
      }),
    );
    res.json({ users: out });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Result.deleteMany({ user: req.params.id });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};
