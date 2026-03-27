const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const adminController = require("../controller/admin");
const galleryController = require("../controller/gallery");
const eventController = require("../controller/events");
const contactController = require("../controller/contact");
const volunteerController = require("../controller/volunteers");
const annualController = require("../controller/annualReport");
const donorController = require("../controller/donor");
const auth = require("../middelware/auth");
//login credentials
router.post("/login", adminController.postLogin);
router.get(
  "/verify/:otp",
  auth.jwtLogAuth,
  adminController.getVerify,
  adminController.getAdminDashboard
);
router.put("/logout", auth.jwtAuth, adminController.putLogout);
//adminDashboard
router.get("/unvisitedContacts", contactController.getUnvisitedContactsCount);
router.get(
  "/unvisitedVolunteers",
  volunteerController.getUnvisitedVolunteersCount
);
router.get("/unvisitedDonors", donorController.unvisitedDonors);
//gallery
router.post(
  "/gallery",
  upload.single("galleryImage"),
  auth.jwtAuth,
  galleryController.uploadImage
);
//events
router.post(
  "/event",
  upload.single("eventImage"),
  auth.jwtAuth,
  eventController.postEvent
);
router.get("/events", auth.jwtAuth, eventController.getEvents);
router.delete("/event/:eventId", auth.jwtAuth, eventController.deleteEvent);
//contact
router.get("/contacts", auth.jwtAuth, contactController.getAllContacts);
router.get("/checkContact", auth.jwtAuth, contactController.getCheckedContacts);
router.put("/contact", contactController.putContactCheck);
router.delete("/contact/:contactId", contactController.deleteContact);
//volunteers
router.get("/volunteers", auth.jwtAuth, volunteerController.getAllVolunteers);
router.get(
  "/recentVolunteers",
  auth.jwtAuth,
  volunteerController.getRecentVolunteers
);
//annualReport
router.post(
  "/annual",
  auth.jwtAuth,
  upload.single("annualReport"),
  annualController.createAnnualReport
);
router.get("/reportYears", auth.jwtAuth, annualController.getAllYears);
router.delete(
  "/reportYear/:PDFid",
  auth.jwtAuth,
  annualController.deleteAnnualReport
);
//donors
router.get("/donors", auth.jwtAuth, donorController.getDonors);
router.get(
  "/downloadDonors",
  auth.jwtAuth,
  donorController.downloadDonorsExcel
);
module.exports = router;
