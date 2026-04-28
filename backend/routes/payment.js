import express from 'express';
import Stripe from 'stripe'; // Import Stripe
import { authenticate } from '../middleware/auth.js'; // Optional: Use your auth middleware if you want only logged-in users to pay

const router = express.Router();

// Notice that the const stripe = new Stripe(...) line is GONE from here!

router.post('/create-payment-intent', authenticate, async (req, res) => {
  try {
    // 1. We moved the Stripe initialization INSIDE the route. 
    // Now it waits for the server to fully start before looking for the key!
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { amount } = req.body; 

    // Create the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount must be in cents (e.g., RM 10.00 = 1000)
      currency: 'myr', 
      metadata: { integration_check: 'accept_a_payment' },
    });

    // Send the client_secret back to the frontend
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
    
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;