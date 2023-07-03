const axios = require("axios");

const sendOTP = async (deviceId, nomorhp) => {
  try {
    const response = await axios.post("http://47.254.66.241:1337/api/otp", { 
        id: deviceId,
        phone: nomorhp
    });
    return {
      info: response.data.info,
      msg: "Otp telah terkirim!",
      statusCode: response.data["status-code"]
    };
  } catch (error) {
    throw {
      isAccepted: false,
      error: error.message
    };
  }
};

module.exports = sendOTP;
