const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const volunteers = new mongoose.Schema(
  {
    volunteerName: { type: String, required: true },
    volunteerContact: { type: String, required: true },
    volunteerEmail: { type: String },
    volunteerLocation: { type: String, required: true },
    volunteerArea: { type: String, required: true },
    visit: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  {
    collection: "Volunteers",
  }
);
volunteers.plugin(AutoIncrement, {
  inc_field: "VolunteerID",
});
const Volunteers = mongoose.model("Volunteers", volunteers);
module.exports = Volunteers;
