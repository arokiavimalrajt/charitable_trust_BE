const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const adminModel = require("../model/admin");
const OTPModel = require("../model/otp");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASS,
  },
});

exports.postLogin = async (req, res, next) => {
  const { adminEmail, adminPassword } = req.body;
  const admin = await adminModel.findOne({ adm_email: adminEmail });

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }
  try {
    const isPasswordMatch = await bcrypt.compare(
      adminPassword,
      admin.adm_password
    );

    if (admin.adm_email === adminEmail && isPasswordMatch) {
      const otp = OTPModel.generateOTP();
      const mailOptions = {
        from: "contact@grandcateringg.com",
        to: adminEmail,
        subject: "Your OTP Code",
        text: `Here is your OTP code: ${otp}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Email sent: " + info.response);
      });
      const currentTimestamp = new Date();
      const token = jwt.sign(
        { email: adminEmail, admOtp: otp, admTime: currentTimestamp },
        process.env.JWT_SECRET,
        {
          expiresIn: "6m",
        }
      );
      admin.adm_jwt = token;
      await admin.save();
      return res
        .status(200)
        .json({ message: "We Send OTP to the mail id", jwt: token });
    } else if (!isEmailMatch) {
      return res.status(401).json({
        message: "Unauthorized as Email MisMatch",
      });
    } else if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Unauthorized as Passcode MisMatch",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
exports.getVerify = async (req, res, next) => {
  const userEmail = req.user.email;
  const userOtp = req.user.admOtp;
  const userTime = req.user.admTime;
  const enteredOTP = req.params.otp;
  try {
    const admin = await adminModel.findOne({ adm_email: userEmail });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const otpExpires = new Date(userTime);
    const currentTimestamp = new Date();

    const timeDifference = currentTimestamp.getTime() - otpExpires.getTime();
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    if (minutesDifference <= 5) {
      const isVerified = OTPModel.verifyOTP(userOtp, enteredOTP);
      if (isVerified) {
        const token = jwt.sign(
          { email: userEmail, admOtp: userOtp },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        await adminModel.findOneAndUpdate(
          { adm_email: userEmail },
          {
            adm_login: true,
            adm_jwt: token,
          },
          { new: true }
        );
        req.userAuth = token;
        return next();
      } else {
        return res.status(400).json({ message: "OTP verification failed!" });
      }
    } else {
      admin.update({
        adm_login: false,
      });
      return res.json({ message: "Time Out for the verification" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};
exports.getAdminDashboard = async (req, res, next) => {
  const token = req.userAuth;
  return res.status(200).json({
    message: `Welcome to the Admin DASHBOARD`,
    jwt: token,
  });
};
exports.putLogout = async (req, res, next) => {
  const { email } = req.user;
  try {
    const updatedUser = await adminModel.findOneAndUpdate(
      { adm_email: email },
      {
        adm_login: false,
        adm_jwt: null,
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};
