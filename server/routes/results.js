const express = require("express");
const router = express.Router();
const { auth, requireAdmin } = require("../middleware/auth");
const ctrl = require("../controllers/results");

router.post("/", auth, ctrl.submitResult);
router.get("/me", auth, ctrl.getMyResults);
router.get("/", auth, requireAdmin, ctrl.getAllResults);

module.exports = router;
