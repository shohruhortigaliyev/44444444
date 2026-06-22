const express = require("express");
const router = express.Router();
const { auth, requireAdmin } = require("../middleware/auth");
const ctrl = require("../controllers/tests");

router.get("/", ctrl.getTests);
router.post("/", auth, requireAdmin, ctrl.createTest);
router.delete("/:id", auth, requireAdmin, ctrl.deleteTest);

module.exports = router;
