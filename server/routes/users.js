const express = require("express");
const router = express.Router();
const { auth, requireAdmin } = require("../middleware/auth");
const ctrl = require("../controllers/users");

router.get("/", auth, requireAdmin, ctrl.getUsers);
router.delete("/:id", auth, requireAdmin, ctrl.deleteUser);

module.exports = router;
