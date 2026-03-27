const jwt = require("jsonwebtoken");
const Admin = require("../model/admin");

exports.jwtLogAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const admin = await Admin.findOne({ adm_email: req.user.email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.adm_jwt === token) {
      return next();
    } else {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or expired token" });
    }

    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
exports.jwtAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    const admin = await Admin.findOne({ adm_email: req.user.email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.adm_jwt !== token || admin.adm_jwt === null) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    if (admin.adm_login === true) {
      return next();
    } else {
      admin.adm_jwt = null;
      await admin.save();
      return res
        .status(401)
        .json({ message: "Session expired, please log in again" });
    }
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or expired token" });
    }

    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
