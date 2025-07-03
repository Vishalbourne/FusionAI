import razorpay from "../services/paymentGateway.js";
import crypto from "crypto";
import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";

export const PaymentRequest = async (req, res) => {
  const { amount, currency, planId } = req.body;

  console.log("PaymentRequest called with:", { amount, currency, planId });

  const options = {
    amount: amount , // Razorpay expects amount in subunits
    currency: currency,
    // receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);


    const user = await User.findById(req.user._id);
    if (!user) {  
      return res.status(404).json({ error: 'User not found' });
    }

    // Optional: You can store order in DB here (before or after verification)

    res.status(200).json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        // phone: user.phone
      }
    });

  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ error: 'Error creating order' });
  }
};



export const PaymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, planId } = req.body;

  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest('hex');

  if (digest === razorpay_signature) {
    // ✅ Save verified payment to DB
    await Payment.create({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount,
      currency,
      status: "paid",
      planId
    });

    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
};
