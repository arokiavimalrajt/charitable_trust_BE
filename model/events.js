const mongoose = require("../util/database");
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    event_name: {
      type: String,
    },
    event_date: {
      type: Date,
    },
    event_location: {
      type: String,
    },
    event_desc: {
      type: String,
    },
    imageName: {
      type: String,
    },
    imageData: {
      type: Buffer,
    },

    contentType: {
      type: String,
    },
  },
  {
    collection: "Event",
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
