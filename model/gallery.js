const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    imageName: { type: String },
    imageData: { type: Buffer },
    contentType: { type: String },
    date: { type: Date, default: Date.now },
  },
  {
    collection: "Gallery",
  }
);

const gallery = mongoose.model("Gallery", gallerySchema);
module.exports = gallery;
