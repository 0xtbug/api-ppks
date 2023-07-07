const { ECDH } = require("crypto");
const { check } = require("express-validator");

exports.signUpValidationUser = [
  check("deviceid", "Deviceid tidak boleh kosong!").not().isEmpty(),
  check("nama", "Nama tidak boleh kosong!").not().isEmpty(),
  check("nomorhp", "Isi nomor hp dengan benar!").isLength({ min: 11, max: 11 })
];

exports.loginValidationUser = [
  check("deviceid", "Deviceid tidak boleh kosong!").not().isEmpty(),
  check("nomorhp", "Isi nomor hp dengan benar!").isLength({ min: 11, max: 11 })
];

exports.signUpValidationAdmin = [
  check("email", "tolong isi email dengan benar!").isEmail().normalizeEmail({ gmail_remove_dots: true }),
]

exports.loginValidationAdmin = [
  check("email", "email tidak boleh kosong!").not().isEmpty(),
]