const express = require("express");
const router = express.Router();
const { signUpValidationAdmin, loginValidationAdmin } = require("../helpers/validation");
const adminWebController = require("../controllers/adminWebController");
const { isAuthorize } = require("../middleware/auth");

router.post("/admin/daftar", signUpValidationAdmin, adminWebController.daftar);
router.post("/admin/login", loginValidationAdmin, adminWebController.login);
router.post("/admin/logout", isAuthorize, adminWebController.logout);
router.post("/admin/generatecode", isAuthorize, adminWebController.generateSecretCode);
router.post("/admin/update/email", isAuthorize, adminWebController.updateEmail);
router.post("/admin/update/password", isAuthorize, adminWebController.updatePassword);
router.delete("/admin/delete/:id", isAuthorize, adminWebController.deleteAdminById);
router.get("/admin/all", isAuthorize, adminWebController.viewAllAdmins);
router.get('/admin/:id', isAuthorize, adminWebController.getAdminById);
router.post("/admin/artikel/create", isAuthorize, adminWebController.createArtikel);
router.put("/admin/artikel/update/:id", isAuthorize, adminWebController.updateArtikel);
router.delete("/admin/artikel/delete/:id", isAuthorize, adminWebController.deleteArtikelById);
router.get("/admin/artikel/:id", isAuthorize, adminWebController.getArtikelById);
router.post("/admin/artikel/all", isAuthorize, adminWebController.viewAllArtikel);
router.post("/admin/create/appadmin", isAuthorize, adminWebController.createAdminUserApp);

module.exports = router;