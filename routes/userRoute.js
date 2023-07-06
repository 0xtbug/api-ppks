const express = require("express");
const router = express.Router();
const { signUpValidationUser, loginValidationUser } = require("../helpers/validation");
const userController = require("../controllers/userController");
const { isAuthorize } = require("../middleware/auth");

router.post("/user/daftar", signUpValidationUser, userController.daftar);
router.post("/user/login", loginValidationUser, userController.login);
router.post("/user/verifikasi", userController.verifikasi);
router.post("/user/logout", isAuthorize, userController.logout);
router.post("/user/setlaporan", isAuthorize, userController.setlaporan);
router.post("/user/getlaporan", isAuthorize, userController.getlaporan);

router.get("/img/:id", userController.showimg);

module.exports = router;