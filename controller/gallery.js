const Gallery = require("../model/gallery");
const crypto = require("crypto");
const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const binaryData = req.file.buffer;
    const imageName = randomImageName();

    const gallery = new Gallery({
      imageName: imageName,
      imageData: binaryData,
      contentType: req.file.mimetype,
    });

    await gallery.save();
    res.status(201).json({
      message: "Image saved successfully to the gallery",
      imagename: imageName,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error saving Image", message: error.message });
  }
};
exports.getAllImageNames = async (req, res) => {
  try {
    const imageNames = await Gallery.find().select("imageName _id");

    res.status(200).json(imageNames);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving images", message: error.message });
  }
};
exports.getImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.imageId);
    if (image) {
      res.set("Content-Type", image.contentType);
      res.send(image.imageData);
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving image", message: error.message });
  }
};
