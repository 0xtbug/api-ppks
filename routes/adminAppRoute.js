const express = require("express");
const router = express.Router();
const adminAppController = require("../controllers/adminAppController");
const { isAuthorize } = require("../middleware/auth");

router.post("/adminapp/laporan/all", isAuthorize, adminAppController.getlaporan);
router.post("/adminapp/laporan/update/status", isAuthorize, adminAppController.updateStatusLaporan);

module.exports = router;