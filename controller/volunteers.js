const Volunteers = require("../model/volunteers");

exports.createVolunteer = async (req, res) => {
  const {
    volunteerName,
    volunteerContact,
    volunteerEmail,
    volunteerLocation,
    volunteerArea,
  } = req.body;

  try {
    const newVolunteer = new Volunteers({
      volunteerName,
      volunteerContact,
      volunteerEmail,
      volunteerLocation,
      volunteerArea,
    });

    const volt = await newVolunteer.save();

    res.status(201).json({
      message: "Volunteer created successfully",
      volt,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error creating volunteer",
      message: error.message,
    });
  }
};
exports.getAllVolunteers = async (req, res, next) => {
  try {
    await Volunteers.updateMany({ visit: false }, { visit: true });

    const volunteers = await Volunteers.find()
      .select("-_id -visit -date -__v")
      .sort({ done: -1, date: 1 });

    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnvisitedVolunteersCount = async (req, res, next) => {
  try {
    const unvisitedCount = await Volunteers.countDocuments({ visit: false });

    res.status(200).json({ unvisitedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentVolunteers = async (req, res, next) => {
  try {
    await Volunteers.updateMany({ visit: false }, { visit: true });

    const volunteers = await Volunteers.find()
      .select("-_id -visit -date -__v")
      .sort({ date: -1 })
      .limit(3);

    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
