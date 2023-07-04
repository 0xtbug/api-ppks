const express = require("express");
const router = express.Router();
const { signUpValidation, loginValidation } = require("../helpers/validation");
const userController = require("../controllers/userController");
const { isAuthorize } = require("../middleware/auth");

router.post("/user/login", loginValidation, userController.login);
router.post("/user/daftar", signUpValidation, userController.daftar);
router.post("/user/verifikasi", userController.verifikasi);
router.post("/user/logout", isAuthorize, userController.logout);

router.get("/user", isAuthorize, userController.getUser);

module.exports = router;
