// src/routes/auth.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

router.post(
  "/invite",
  auth,                     // ✅ Auth first
  role("ADMIN", "MANAGER"), // ✅ Role check
  ctrl.inviteUser
);

router.post("/set-password", ctrl.setPassword);
router.post("/login", ctrl.login);
router.post("/logout", ctrl.logout);

module.exports = router;
