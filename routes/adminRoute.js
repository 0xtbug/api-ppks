const express = require("express");
const router = express.Router();
const { signUpValidationAdmin, loginValidationAdmin } = require("../helpers/validation");
const adminController = require("../controllers/adminController");
const { isAuthorize } = require("../middleware/auth");

router.post("/admin/daftar", signUpValidationAdmin, adminController.daftar);
router.post("/admin/login", loginValidationAdmin, adminController.login);
router.post("/admin/logout", isAuthorize, adminController.logout);
router.post("/admin/generatecode", isAuthorize, adminController.generateSecretCode);
router.post("/admin/update/email", isAuthorize, adminController.updateEmail);
router.post("/admin/update/password", isAuthorize, adminController.updatePassword);
router.delete("/admin/delete/:id", isAuthorize, adminController.deleteAdminById);
router.get("/admin/all", isAuthorize, adminController.viewAllAdmins);
router.get('/admin/:id', isAuthorize, adminController.getAdminById);
router.post("/admin/artikel/create", isAuthorize, adminController.createArtikel);
router.put("/admin/artikel/update/:id", isAuthorize, adminController.updateArtikel);
router.delete("/admin/artikel/delete/:id", isAuthorize, adminController.deleteArtikelById);
router.get("/admin/artikel/:id", isAuthorize, adminController.getArtikelById);
router.post("/admin/artikel/all", isAuthorize, adminController.viewAllArtikel);

module.exports = router;