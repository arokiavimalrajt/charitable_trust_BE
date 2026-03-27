const mongoose = require("mongoose");

const annualReport = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      unique: true,
      min: 2000,
      max: new Date().getFullYear(),
    },
    PDFName: { type: String },
    PDFData: { type: Buffer },
    contentType: { type: String },
    date: { type: Date, default: Date.now },
  },
  {
    collection: "Annual Report",
  }
);

const AnnualReport = mongoose.model("Annual Report", annualReport);
module.exports = AnnualReport;
