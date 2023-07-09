const db = require("../config/dbConnection");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const getlaporan = (req, res) => {
    const authToken = req.headers.authorization;
    const token = authToken.split(' ')[0].trim();
    const decoded = jwt.verify(token, JWT_SECRET);
    const deviceId = decoded.device_id;
  
    db.query('SELECT is_verified, is_private FROM users WHERE device_id = ?', [deviceId], (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500);
      } else {
        if (rows && rows.length) {
          const user = rows[0];
          if (user.is_verified && user.is_private === 1) {
            db.query('SELECT * FROM laporan ORDER BY tanggal_kejadian', (err, rows) => {
              if (err) {
                return res.status(500);
              } else {
                const list = rows;
                list.forEach((val) => {
                  val.bukti = process.env.HOST + ":" + process.env.PORT_SERVER + "/src/img/laporan/" + val.bukti;
                })
                return res.status(200).json({"listData": list});
              }
            })
          } else {
            return res.status(403).json({ "isAuth": false, "info": "Anda bukan admin" });
          }
        } else {
          return res.status(401).json({ "isAuth": false, "info": "user belum terverifikasi" })
        }
      }
    })
  }
  
  const updateStatusLaporan = (req, res) => {
    const authToken = req.headers.authorization;
    const token = authToken.split(" ")[0].trim();
    const decoded = jwt.verify(token, JWT_SECRET);
    const deviceId = decoded.device_id;
  
    const laporanId = req.body.id;
    const status = req.body.status;
  
    db.query("SELECT is_verified, is_private FROM users WHERE device_id = ?", [deviceId], (err, rows) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ info: err });
      } else {
        if (rows.length && rows[0].is_verified === 1 && rows[0].is_private === 1) {
          if (status >= 2 && status <= 3) {
            db.query("UPDATE laporan SET status = ? WHERE id = ?", [status, laporanId], (err, result) => {
              if (err) {
                console.log(err);
                return res.status(500).json({ info: err });
              } else {
                if (result.affectedRows > 0) {
                  return res.status(200).json({ isUpdated: true, info: "Status laporan berhasil diperbarui!" });
                } else {
                  return res.status(400).json({ isUpdated: false, info: "Gagal memperbarui status laporan. Laporan tidak ditemukan." });
                }
              }
            });
          } else {
            return res.status(400).json({ isUpdated: false, info: "Status laporan tidak valid. Harus dalam rentang 2 sampai 3." });
          }
        } else {
          return res.status(401).json({ isUpdated: false, info: "User belum terverifikasi atau Anda bukan admin." });
        }
      }
    });
  };
  

module.exports = {
    getlaporan,
    updateStatusLaporan,
}