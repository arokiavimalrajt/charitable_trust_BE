const mongoose = require("../util/database");
const { Schema } = mongoose;
const adminSchema = new Schema(
  {
    adm_email: {
      type: String,
      required: true,
    },
    adm_password: {
      type: String,
      required: true,
    },
    adm_login: {
      type: Boolean,
      default: false,
    },
    adm_jwt: {
      type: String,
    },
  },
  {
    collection: "Admin",
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
