const Event = require("../model/events");
const crypto = require("crypto");
const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

exports.postEvent = async (req, res, next) => {
  const { event_name, event_date, event_location, event_desc } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const [day, month, year] = event_date.split("/");
    const formattedEventDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
    const event = new Event({
      event_name,
      event_date: formattedEventDate,
      event_location,
      event_desc,
      imageName: randomImageName(),
      imageData: req.file.buffer,
      contentType: req.file.mimetype,
    });
    await event.save();
    res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create event" });
  }
};
exports.getEvents = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const events = await Event.find({ event_date: { $gte: currentDate } })
      .sort({ event_date: 1 })
      .select("-imageData -contentType -__v");

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event" });
  }
};
exports.getLastThreeEvents = async (req, res, next) => {
  try {
    const currentDate = new Date();

    const events = await Event.find({ event_date: { $gte: currentDate } })
      .sort({ event_date: 1 })
      .limit(3)
      .select("-imageData -imageName -contentType -__v");

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error });
  }
};
exports.getImage = async (req, res) => {
  try {
    const image = await Event.findById(req.params.imageId);
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
