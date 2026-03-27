const RazorPay = require("razorpay");
const Donation = require("../model/donation");

exports.checkOutPayment = async (req, res) => {
  const { donationType, donationAmount, conOMY } = req.body;
  try {
    const donation = new Donation({
      donationType,
      donationAmount,
      conOMY,
    });
    await donation.save();
    const instance = new RazorPay({
      key_id: process.env.PI_KEY_ID,
      key_secret: process.env.PI_KEY_SECRET,
    });

    const options = {
      amount: donationAmount * 100,
      currency: "INR",
      receipt: donation.Receipt_id.toString(),
    };

    const order = await instance.orders.create(options);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server",
      error: error.message,
    });
  }
};
exports.piKey = async (req, res) => {
  res.status(200).json({ success: true, key: process.env.PI_KEY_ID });
};
exports.paymentVerification = async (req, res) => {
  res.status(200).json({ success: true, message: "payment successful" });
};
