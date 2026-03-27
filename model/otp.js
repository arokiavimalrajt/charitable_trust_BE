const otpGenerator = require("otp-generator");

class OTPModel {
  static generateOTP() {
    return otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      lowerCaseAlphabets: false,
      lowerCase: false,
      upperCase: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
  }

  static verifyOTP(otp, enteredOTP) {
    return otp === enteredOTP;
  }
}

module.exports = OTPModel;
