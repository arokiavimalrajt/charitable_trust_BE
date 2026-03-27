const Donors = require("../model/donors");
const BloodRequest = require("../model/bloodRequest");

const ExcelJS = require("exceljs");
exports.postDonor = async (req, res) => {
  try {
    const { donorName, donorContact, donorBloodGrp, donorCity, donorArea } =
      req.body;

    if (!donorName || !donorContact || !donorCity || !donorBloodGrp) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const newDonor = new Donors({
      donorName,
      donorContact,
      donorBloodGrp,
      donorCity,
      donorArea,
    });

    await newDonor.save();

    res.status(201).json({
      message: "Donor successfully created",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating donor",
      error,
    });
  }
};
exports.getDonors = async (req, res) => {
  try {
    await Donors.updateMany({ visit: false }, { visit: true });
    const donors = await Donors.find()
      .select("-_id -visit -date -__v")
      .sort({ done: -1, date: 1 });
    if (donors.length === 0) {
      return res.status(404).json({ message: "No donors found." });
    }
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving donors",
      error,
    });
  }
};

exports.unvisitedDonors = async (req, res) => {
  try {
    const unvisitedCount = await Donors.countDocuments({ visit: false });
    res.status(200).json({ unvisitedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.downloadDonorsExcel = async (req, res) => {
  try {
    const donors = await Donors.find();
    if (donors.length === 0) {
      return res.status(404).json({ message: "No donors found." });
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Donors");
    worksheet.columns = [
      { header: "S.no", key: "id", width: 10 },
      { header: "Donor Name", key: "donorName", width: 30 },
      { header: "Donor Contact", key: "donorContact", width: 20 },
      { header: "Blood Group", key: "donorBloodGrp", width: 15 },
      { header: "Donor City", key: "donorCity", width: 20 },
      { header: "Donor Area", key: "donorArea", width: 20 },
      { header: "Date", key: "date", width: 20 },
    ];
    donors.forEach((donor, index) => {
      worksheet.addRow({
        id: index + 1,
        donorName: donor.donorName,
        donorContact: donor.donorContact,
        donorBloodGrp: donor.donorBloodGrp,
        donorCity: donor.donorCity,
        donorArea: donor.donorArea,
        date: donor.date.toISOString().split("T")[0],
      });
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=donors.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      message: "Error generating Excel file",
      error,
    });
  }
};
exports.getDonorForRequest = async (req, res) => {
  try {
    const { donorBloodGrp } = req.query;

    let filter = {};
    if (donorBloodGrp) filter.donorBloodGrp = donorBloodGrp;

    const donors = await Donors.find(filter).select("-_id -visit -date -__v");

    if (donors.length === 0) {
      return res
        .status(404)
        .json({ message: "No donors found matching the criteria." });
    }
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving donors",
      error,
    });
  }
};

exports.createBloodRequest = async (req, res) => {
  try {
    const {
      patientName,
      hospitalName,
      attenderName,
      attenderContact,
      bloodGrpRequested,
      patientLocation,
      patientArea,
    } = req.body;
    if (
      !patientName ||
      !hospitalName ||
      !attenderName ||
      !attenderContact ||
      !bloodGrpRequested ||
      !patientLocation ||
      !patientArea
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const newBloodRequest = new BloodRequest({
      patientName,
      hospitalName,
      attenderName,
      attenderContact,
      bloodGrpRequested,
      patientLocation,
      patientArea,
    });
    await newBloodRequest.save();
    res.status(201).json({
      message: "Blood request successfully created",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating blood request",
      error: error.message,
    });
  }
};
