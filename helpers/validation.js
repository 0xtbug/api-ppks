const { check } = require("express-validator");

exports.signUpValidation = [
  check("deviceid", "Deviceid tidak boleh kosong!").not().isEmpty(),
  check("nama", "Nama tidak boleh kosong!").not().isEmpty(),
  check("nomorhp", "Isi nomor hp dengan benar!").isLength({ min: 11, max: 11 })
];

exports.loginValidation = [
  check("deviceid", "Deviceid tidak boleh kosong!").not().isEmpty(),
  check("nomorhp", "Isi nomor hp dengan benar!").isLength({ min: 11, max: 11 })
];