const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const donors = new mongoose.Schema(
  {
    donorName: { type: String, required: true },
    donorContact: { type: String, required: true },
    donorBloodGrp: { type: String, required: true },
    donorCity: { type: String, required: true },
    donorArea: { type: String },
    visit: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  {
    collection: "Donors",
  }
);
donors.plugin(AutoIncrement, {
  inc_field: "DonorsID",
});
const Donors = mongoose.model("Donors", donors);
module.exports = Donors;
