import express from 'express';
import Stripe from 'stripe';

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// POST /api/payment/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Valid amount in cents is required.' });
    }

    if (stripe) {
      // Real Stripe integration
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert USD dollars to cents
        currency,
        metadata: { orderId },
        automatic_payment_methods: { enabled: true },
      });

      return res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        mode: 'live_stripe'
      });
    } else {
      // Demo / Mock Stripe payment intent fallback for local testing without secret key
      return res.json({
        success: true,
        clientSecret: `mock_pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
        mode: 'demo_mode',
        message: 'Stripe Secret Key not set; running in simulated online payment mode.'
      });
    }
  } catch (err) {
    console.error('Stripe PaymentIntent error:', err);
    res.status(500).json({ success: false, error: err.message || 'Payment intent creation failed' });
  }
});

// POST /api/payment/webhook - Verification callback for Stripe Webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.log('Stripe webhook received in demo mode');
    return res.json({ received: true });
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful! Order: ${paymentIntent.metadata.orderId}`);
      // In production, update paymentStatus to 'PAID' via store
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
