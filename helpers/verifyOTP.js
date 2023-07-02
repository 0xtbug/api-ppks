const axios = require("axios");

const verifyOTP = async (deviceId, otp) => {
  try {
    const response = await axios.post("http://47.254.66.241:1337/api/otpverify", { 
        id: deviceId,
        otp: otp
    });
    return {
      isAccepted: response.data.isAccepted,
      info: response.data.info,
    };
  } catch (error) {
    throw {
      isAccepted: false,
      error: error.message
    };
  }
};

module.exports = verifyOTP;
