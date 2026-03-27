const express = require("express");
const router = express.Router();

const commonController = require("../controller/common");
const contactController = require("../controller/contact");
const volunteerController = require("../controller/volunteers");
const galleryController = require("../controller/gallery");
const annualController = require("../controller/annualReport");
const donorController = require("../controller/donor");
const eventController = require("../controller/events");
const donationPaymentController = require("../controller/donationPayment");

router.get("/dashboard", commonController.getDashboard);
//gallery
router.get("/galleryImageName", galleryController.getAllImageNames);
router.get("/gallery/:imageId", galleryController.getImage);
//contact
router.post("/contact", contactController.postCreateContact);
//events
router.get("/getevent", eventController.getLastThreeEvents);
router.get("/event/:imageId", eventController.getImage);
//volunteers
router.post("/voluteer", volunteerController.createVolunteer);
//reportyear
router.get("/reportYears", annualController.getAllYears);
router.get("/report/:PDFid", annualController.getReportPDF);
//donor
router.post("/donor", donorController.postDonor);
router.post("/bloodRequest", donorController.createBloodRequest);
router.get("/donors", donorController.getDonorForRequest);
//payment routes
router.post("/pay", donationPaymentController.checkOutPayment);
router.get("/piKey", donationPaymentController.piKey);
router.post("/verify", donationPaymentController.paymentVerification);
module.exports = router;
