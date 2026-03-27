const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    contactName: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    visit: { type: Boolean, default: false },
    done: { type: Boolean, default: false },
  },
  {
    collection: "ContactUs",
  }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
