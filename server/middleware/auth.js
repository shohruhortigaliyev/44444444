const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });
  const token = h.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-passHash");
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });
  next();
};

module.exports = { auth, requireAdmin };
