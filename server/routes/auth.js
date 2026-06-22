const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/auth");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/me", ctrl.me);
router.post("/change-password", ctrl.changePassword);

module.exports = router;
