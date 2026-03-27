const Contact = require("../model/contact");
exports.postCreateContact = async (req, res, next) => {
  try {
    const { contactName, contact, email, message } = req.body;
    const newContact = new Contact({
      contactName,
      contact,
      email,
      message,
    });
    await newContact.save();
    res.status(201).json({ message: "Contact created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllContacts = async (req, res, next) => {
  try {
    await Contact.updateMany({ visit: false }, { visit: true });

    const contacts = await Contact.find({ done: false })
      .select("-__v")
      .sort({ done: -1, date: -1 });

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getCheckedContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ done: true })
      .select("-__v")
      .sort({ done: -1, date: -1 });

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getUnvisitedContactsCount = async (req, res, next) => {
  try {
    const unvisitedCount = await Contact.countDocuments({ visit: false });

    res.status(200).json({ unvisitedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.putContactCheck = async (req, res) => {
  const { contactId } = req.body;

  try {
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { done: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json({ message: "Contact marked successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error Updating Contact", message: error.message });
  }
};
exports.deleteContact = async (req, res) => {
  const { contactId } = req.params;

  try {
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting contact", message: error.message });
  }
};
