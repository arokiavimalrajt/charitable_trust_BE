const Annual = require("../model/annualRepot");
const crypto = require("crypto");
const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
exports.createAnnualReport = async (req, res) => {
  const { year } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const existingReport = await Annual.findOne({ year });

    if (existingReport) {
      return res.status(409).json({ error: "Year already submitted" });
    }
    const binaryData = req.file.buffer;
    const PDFName = randomImageName();
    const annualReport = new Annual({
      year,
      PDFName,
      PDFData: binaryData,
      contentType: req.file.mimetype,
    });
    await annualReport.save();
    res.status(201).json({
      message: "Annual Report is set successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error saving Image", message: error.message });
  }
};
exports.getAllYears = async (req, res) => {
  try {
    const years = await Annual.find().select("year ");

    res.status(200).json(years);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving years", message: error.message });
  }
};
exports.getReportPDF = async (req, res) => {
  try {
    const annual = await Annual.findById(req.params.PDFid);

    if (!annual) {
      return res.status(404).json({ error: "Annual Report Data not found" });
    }

    if (!annual.PDFData) {
      return res
        .status(404)
        .json({ error: "PDF not found for this Annual year" });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename= HelpingHands ${annual.year}.pdf`
    );
    res.setHeader("Content-Type", annual.contentType);
    res.send(annual.PDFData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error retrieving PDF", message: error.message });
  }
};
exports.deleteAnnualReport = async (req, res) => {
  try {
    const result = await Annual.findByIdAndDelete(req.params.PDFid);

    if (!result) {
      return res.status(404).json({ error: "Annual Report not found" });
    }

    res.status(200).json({ message: "Annual Report deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting Annual Report", message: error.message });
  }
};
