const { validationResult } = require("express-validator");
const db = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const sendOTP = require("../helpers/sendOTP");
const verifyOTP = require("../helpers/verifyOTP");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const id = "62";

const daftar = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const nomorhp = id + req.body.nomorhp;
  const nama = req.body.nama;
  const deviceId = req.body.deviceid;

  try {
    db.query(
      "SELECT * FROM users WHERE nomorhp = ?",
      [nomorhp],
      async (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (result && result.length) {
          return res
            .status(409)
            .json({ isAccepted: false, msg: "Nomor ini sudah digunakan!" });
        } else {
          try {
            const otpResponse = await sendOTP(deviceId, nomorhp);
            const otp = otpResponse.info.split(" ")[4];
            const hashedOTP = await bcrypt.hash(otp, 10);

            const query = `INSERT INTO users (nama, nomorhp, device_id, otp) VALUES (?, ?, ?, ?)`;
            const values = [nama, nomorhp, deviceId, hashedOTP];

            db.query(query, values, (err) => {
              if (err) {
                return res.status(400).json({ msg: err.message });
              }

              return res.status(200).json({
                isAccepted: true,
                msg: "Registrasi berhasil!",
                data: otpResponse,
              });
            });
          } catch (error) {
            return res.status(500).json({ error: error.message });
          }
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const verifikasiDaftar = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const deviceId = req.body.deviceid;
  const otp = req.body.otp;
  const otpResponse = await verifyOTP(deviceId, otp);

  if (!deviceId || !otp) {
    return res
      .status(400)
      .json({ error: "Permintaan tidak valid. DeviceId atau otp tidak ada." });
  }

  try {
    await db.query(
      "UPDATE users SET is_verified = 1 WHERE device_id = ?",
      [deviceId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (otpResponse.isAccepted) {
          const token = jwt.sign({ deviceId }, JWT_SECRET);
          otpResponse.token = token;

          db.query("UPDATE users SET token = ? WHERE device_id = ?",
            [token, deviceId],
            (err) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
          });
        }
        
        return res.status(200).json({ data: otpResponse });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const nomorhp = id + req.body.nomorhp;

  try {
    db.query(
      "SELECT * FROM users WHERE nomorhp = ?",
      [nomorhp],
      async (err, result) => {
        if (err) {
          return res.status(400).send({
            msg: err,
          });
        }

        if (!result.length) {
          return res.status(401).send({
            msg: "Nomor hp salah atau tidak terdaftar!",
          });
        }

        const deviceId = result[0].device_id;
        const otpResponse = await sendOTP(deviceId, nomorhp);
        const otp = otpResponse.info.split(" ")[4];
        const hashedOTP = await bcrypt.hash(otp, 10);

        db.query(
          "UPDATE users SET otp = ? WHERE device_id = ?",
          [hashedOTP, deviceId],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            return res.status(200).json({
              isAccepted: true,
              msg: "OTP terkirim!",
              data: otpResponse,
            });
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

verifikasiLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const deviceId = req.body.deviceid;
  const otp = req.body.otp;
  const otpResponse = await verifyOTP(deviceId, otp);

  if (!deviceId || !otp) {
    return res
      .status(400)
      .json({ error: "Permintaan tidak valid. DeviceId atau otp tidak ada." });
  }

  try {
    await db.query(
      "UPDATE users SET last_login = now() WHERE device_id = ?",
      [deviceId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (otpResponse.isAccepted) {
          const token = jwt.sign({ deviceId }, JWT_SECRET);
          otpResponse.token = token;

          db.query("UPDATE users SET token = ? WHERE device_id = ?",
            [token, deviceId],
            (err) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
          });
        }
        
        return res.status(200).json({ data: otpResponse });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const logout = (req, res) => {
  const authToken = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(authToken, JWT_SECRET);
    const deviceId = decoded.deviceId;

    db.query("UPDATE users SET token = NULL WHERE device_id = ?", [deviceId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      return res.status(200).json({ success: true, message: "Logout berhasil" });
    });
  } catch (error) {
    return res.status(401).json({ error: "Token tidak valid" });
  }
};

getUser = (req, res) => {
  const authToken = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(authToken, JWT_SECRET);

    db.query('SELECT * FROM users WHERE device_id = ? AND token = ?',
      [decoded.deviceId, authToken],
      function(error, result, fields){
        if (error) throw error;

        if (result.length === 0) {
          return res.status(401).json({ error: "Token tidak valid" });
        }

        return res.status(200).json({ success: true, data:result[0], message: 'Data berhasil diambil!' });
      }
    );
  } catch (error) {
    return res.status(401).json({ error: "Token tidak valid" });
  }
};

module.exports = {
  daftar,
  verifikasiDaftar,
  login,
  verifikasiLogin,
  logout,
  getUser,
};
