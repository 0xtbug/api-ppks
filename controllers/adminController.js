const { validationResult } = require("express-validator");
const db = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const daftar = async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const email = req.body.email;
    const password = req.body.password;
    const koderahasia = req.body.koderahasia;
  
    db.query('SELECT code FROM secret_code WHERE code = ?', koderahasia, (err, result) => {
      if (err) {
        return res.status(400).send({
          info: err
        });
      }
  
      if (result && result.length) {
        db.query('SELECT * FROM admin WHERE LOWER(email) = LOWER(?)', email, (err, result) => {
          if (err) {
            return res.status(400).send({
              info: err
            });
          }
  
          if (result && result.length) {
            return res.status(409).send({
              isAccepted: false,
              info: 'Email sudah digunakan!'
            });
          } else {
            bcrypt.hash(password, 10, (err, hash) => {
              if (err) {
                return res.status(400).send({
                  info: err
                });
              } else {
                db.query('INSERT INTO admin (email, password) VALUES (?, ? )', [email, hash], (err, result) => {
                  if (err) {
                    return res.status(400).send({
                      info: err
                    });
                  } else {
                    return res.status(201).send({
                      isAccepted: true,
                      info: 'Daftar Berhasil!'
                    });
                  }
                });
              }
            });
          }
        });
      } else {
        return res.status(400).send({
          info: 'Kode tidak valid!'
        });
      }
    });
  }  

const login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;
    const password = req.body.password;

    db.query('SELECT * FROM admin WHERE LOWER(email) = LOWER(?)', email, (err, result) => {
        if (err) {
            return res.status(400).send({
                info: err
            });
        }

        if (!result || result.length === 0) {
            return res.status(401).send({
                isAuth: false,
                info: 'Email atau password salah!'
            });
        }

        const user = result[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(400).send({
                    info: err
                });
            }

            if (!isMatch) {
                return res.status(401).send({
                    isAuth: false,
                    info: 'Email atau password salah!'
                });
            }

            const token = jwt.sign({ email: user.email, id: user.id }, JWT_SECRET, { expiresIn: '1h' });
            db.query('UPDATE admin SET last_login = now(), token = ? WHERE id = ?', [token, user.id], (err, result) => {
                if (err) {
                    return res.status(400).send({
                        info: err
                    });
                }
        
                return res.status(200).send({
                    isAuth: true,
                    token: token,
                    detail: user
                });
            });
        });
    });
}

const logout = (req, res) => {
    const authToken = req.headers.authorization;

    try {
        const token = authToken.split(' ')[0].trim();
        const decoded = jwt.verify(token, JWT_SECRET);
        const deviceId = decoded.id;
        db.query('SELECT token FROM admin WHERE id = ?', [deviceId], (err, result) => {
            if (err) {
                return res.status(400).send({
                    info: err
                });
            }

            const storedToken = result[0].token;

            if (storedToken === null) {
                return res.status(200).send({
                    isAuth: false,
                    info: 'Anda sudah logout'
                });
            }

            db.query('UPDATE admin SET token = NULL WHERE id = ?', [deviceId], (err, result) => {
                if (err) {
                    return res.status(400).send({
                        info: err
                    });
                }

                return res.status(200).send({
                    isAuth: true,
                    info: 'Logout berhasil!'
                });
            });
        });
    } catch (err) {
        return res.status(401).send({
            isAuth: false,
            info: 'Token tidak valid'
        });
    }
}

const generateSecretCode = async (req, res) => {
    const authToken = req.headers.authorization;
  
    try {
      const token = authToken.split(' ')[0].trim();
      const decoded = jwt.verify(token, JWT_SECRET);
      const deviceId = decoded.id;
      const admin = await db.query('SELECT token FROM admin WHERE id = ?', [deviceId]);
      if (admin.error) {
        return res.status(400).send({
          info: admin.error,
        });
      }
  
      const settingTime = 10; // set
      const codeLength = 8;
      const expirationTime = settingTime * 60 * 1000;
  
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let secretCode = '';
      for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        secretCode += characters.charAt(randomIndex);
      }
  
      const updateResult = await db.query('UPDATE secret_code SET code = ?, expiration_date = DATE_ADD(NOW(), INTERVAL ? MINUTE) WHERE id = 1', [secretCode, settingTime]);
      if (updateResult.error) {
        return res.status(400).send({
          info: updateResult.error,
        });
      }
  
      setInterval(async () => {
        const currentDate = new Date();
        const deleteExpiredResult = await db.query('UPDATE secret_code SET expiration_date = NULL, code = NULL WHERE expiration_date < ?', [currentDate]);
        if (deleteExpiredResult.error) {
          console.error('Error updating expired secret codes:', deleteExpiredResult.error);
        }
      }, expirationTime);
  
      return res.status(200).send({
        isAccepted: true,
        info: `Kode rahasia berhasil dibuat, expired dalam ${settingTime} menit`,
        secretCode: secretCode
      });
    } catch (err) {
      return res.status(401).send({
        isAuth: false,
        info: 'Token tidak valid',
      });
    }
  };
  
  
const updateEmail = async (req, res) => {
  const adminId = req.body.id;
  const { email } = req.body;

  try {
    await db.query('UPDATE admin SET email = ? WHERE id = ?', [email, adminId]);

    return res.status(200).json({
      isUpdated: true,
      info: 'Email berhasil diperbarui!',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      isUpdated: false,
      info: 'Terjadi kesalahan saat memperbarui email.',
    });
  }
};

const updatePassword = async (req, res) => {
  const adminId = req.body.id;
  const { password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('UPDATE admin SET password = ? WHERE id = ?', [hashedPassword, adminId]);

    return res.status(200).json({
      isUpdated: true,
      info: 'Password berhasil diperbarui!',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      isUpdated: false,
      info: 'Terjadi kesalahan saat memperbarui Password',
    });
  }
};

  
const deleteAdminById = (req, res) => {
    const adminId = req.params.id;

    db.query('DELETE FROM admin WHERE id = ?', adminId, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          isAccepted: false,
          info: 'Kesalahan saat menghapus admin',
        });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({
          isAccepted: false,
          info: 'Admin tidak ditemukan!',
        });
      }
  
      return res.status(200).json({
        isAccepted: true,
        info: 'Berhasil menghapus admin',
      });
    });
  };

const viewAllAdmins = (req, res) => {
    db.query('SELECT id, email FROM admin', (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          isAccepted: false,
          message: 'Terjadi kesalahan saat mengambil admin.',
        });
      }
  
      return res.status(200).json({
        isAccepted: true,
        admins: result,
      });
    });
  };

  const getAdminById = (req, res) => {
    const adminId = req.params.id; 
  
    db.query('SELECT id, email FROM admin WHERE id = ?', [adminId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          isAccepted: false,
          message: 'Terjadi kesalahan saat mengambil admin.',
        });
      }
  
      if (result.length === 0) {
        return res.status(404).json({
          isAccepted: false,
          message: 'Admin tidak ditemukan!',
        });
      }
  
      return res.status(200).json({
        isAccepted: true,
        admin: result[0],
      });
    });
  };  

  const createArtikel = (req, res) => {
    const { judul, isi, sumber, thumbnail } = req.body;
    
    var filename = "";
    if (req.body.thumbnail) {
      var base64Data = req.body.thumbnail.replace(/^data:image\/png;base64,/, "");
      filename = Date.now() + ".png";
      const filePath = path.join(__dirname, "../src/img/artikel", filename);
      fs.writeFile(filePath, base64Data, "base64", function (err) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            isInserted: false,
            info: "Gagal menyimpan artikel",
          });
        }
  
        db.query(
          "INSERT INTO artikel (judul, isi, sumber, thumbnail) VALUES (?, ?, ?, ?)",
          [judul, isi, sumber, filename],
          (err, result) => {
            if (err) {
              if (filename) {
                const deleteFilePath = path.join(__dirname, "../src/img/artikel", filename);
                fs.unlinkSync(deleteFilePath);
              }
              console.error(err);
              return res.status(500).json({
                isInserted: false,
                info: "Gagal menyimpan artikel",
              });
            }
            return res.status(200).json({ 
                isAccepted: true,
                info: "Berhasil membuat artikel!" 
            });
          }
        );
      });
    } else {
      return res.status(406).json({ isAccepted: false, msg: "Isi data yang diperlukan" });
    }
  }; 
  
const updateArtikel = (req, res) => {
    const artikelId = req.params.id;
    const { judul, isi, sumber, thumbnail } = req.body;
  
    if (thumbnail) {
      var base64Data = thumbnail.replace(/^data:image\/png;base64,/, "");
      var filename = Date.now() + ".png";
      const filePath = path.join(__dirname, "../src/img/artikel", filename);
      fs.writeFile(filePath, base64Data, "base64", function (err) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            isUpdated: false,
            info: "Gagal menyimpan thumbnail artikel",
          });
        }
        
        db.query(
          "UPDATE artikel SET judul = ?, isi = ?, sumber = ?, thumbnail = ? WHERE id = ?",
          [judul, isi, sumber, filename, artikelId],
          (err, result) => {
            if (err) {
              if (filename) {
                const deleteFilePath = path.join(__dirname, "../src/img/artikel", filename);
                fs.unlinkSync(deleteFilePath);
              }
              console.error(err);
              return res.status(500).json({
                isUpdated: false,
                info: "Gagal mengupdate artikel",
              });
            }
            return res.status(200).json({ 
                isUpdated: true,
                info: "Artikel berhasil diupdate!"
            });
          }
        );
      });
    } else {
      db.query(
        "UPDATE artikel SET judul = ?, isi = ?, sumber = ? WHERE id = ?",
        [judul, isi, sumber, artikelId],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              isUpdated: false,
              info: "Gagal mengupdate artikel",
            });
          }
          return res.status(200).json({ isUpdated: true });
        }
      );
    }
  };
  
const deleteArtikelById = (req, res) => {
    const artikelId = req.params.id;
  
    db.query('SELECT thumbnail FROM artikel WHERE id = ?', artikelId, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          isDeleted: false,
          info: 'Kesalahan saat menghapus artikel',
        });
      }
  
      if (result.length === 0) {
        return res.status(404).json({
          isDeleted: false,
          info: 'Artikel tidak ditemukan!',
        });
      }
  
    //   const thumbnailPath = result[0].thumbnail;
    //   if (thumbnailPath) {
    //     fs.unlinkSync(path.join(__dirname, '../src/img/artikel', thumbnailPath));
    //   }
  
      db.query('DELETE FROM artikel WHERE id = ?', artikelId, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            isDeleted: false,
            info: 'Kesalahan saat menghapus artikel',
          });
        }
  
        return res.status(200).json({
          isDeleted: true,
          info: 'Berhasil menghapus artikel',
        });
      });
    });
  };  

const getArtikelById = (req, res) => {
    const artikelId = req.params.id;
  
    db.query('SELECT * FROM artikel WHERE id = ?', artikelId, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          isRetrieved: false,
          info: 'Terjadi kesalahan saat mengambil artikel',
        });
      }
  
      if (result.length === 0) {
        return res.status(404).json({
          isRetrieved: false,
          info: 'Artikel tidak ditemukan!',
        });
      }
  
      return res.status(200).json({
        isRetrieved: true,
        artikel: result[0],
      });
    });
  };  

const viewAllArtikel = (req, res) => {
    db.query('SELECT * FROM artikel', (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          isRetrieved: false,
          info: 'Terjadi kesalahan saat mengambil artikel',
        });
      }
  
      return res.status(200).json({
        isRetrieved: true,
        artikel: result,
      });
    });
};
  

module.exports = {
    daftar,
    login,
    logout,
    generateSecretCode,
    updateEmail,
    updatePassword,
    deleteAdminById,
    viewAllAdmins,
    getAdminById,
    createArtikel,
    updateArtikel,
    deleteArtikelById,
    getArtikelById,
    viewAllArtikel,
};