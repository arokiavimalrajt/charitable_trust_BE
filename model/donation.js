const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const donation = new mongoose.Schema(
  {
    donotorName: { type: String, default: "" },
    donationType: { type: String, required: true },
    donationAmount: { type: String, required: true },
    conOMY: { type: String, required: true },
    paymentStatus: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  {
    collection: "Donation",
  }
);
donation.plugin(AutoIncrement, {
  inc_field: "Receipt_id",
});
const Donation = mongoose.model("Donation", donation);
module.exports = Donation;
