import express from 'express';
const router = express.Router();
import { PaymentRequest,PaymentVerification } from '../controllers/paymentController.js';
import { isLoggedIn } from '../middleware/isLoggedIn.js'

// Route to create a payment
router.post('/create', isLoggedIn, PaymentRequest);
// Route to verify a payment
router.post('/verify', isLoggedIn, PaymentVerification);

export default router;