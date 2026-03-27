const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bloodRequest = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    hospitalName: { type: String, required: true },
    attenderName: { type: String, required: true },
    attenderContact: { type: String, required: true },
    bloodGrpRequested: { type: String, required: true },
    patientLocation: { type: String, required: true },
    patientArea: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  {
    collection: "BloodRequest",
  }
);
bloodRequest.plugin(AutoIncrement, {
  inc_field: "AttenderID",
});
const BloodRequest = mongoose.model("BloodRequest", bloodRequest);
module.exports = BloodRequest;
