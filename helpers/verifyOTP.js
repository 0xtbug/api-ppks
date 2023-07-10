const axios = require("axios");

const verifyOTP = async (deviceId, otp, nomorhp) => {
  try {
    const response = await axios.post("http://47.254.66.241:1337/api/otpverify", { 
        id: deviceId,
        otp: otp,
        phone: nomorhp
    });
    return {
      isAccepted: response.data.isAccepted,
      info: response.data.info,
      token: response.data.token,
      phone: response.data.phone,
      statusCode: response.data["status-code"]
    };
  } catch (error) {
    throw {
      isAccepted: false,
      error: error.message
    };
  }
};

module.exports = verifyOTP;