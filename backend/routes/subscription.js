import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import stripe from '../config/stripe.js';

const router = express.Router();

const PLAN_PRICES = {
  'Builder': process.env.STRIPE_BUILDER_PRICE_ID,
  'Pro': process.env.STRIPE_PRO_PRICE_ID,
};

// Create subscription
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!PLAN_PRICES[plan]) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const user = await User.findById(req.user.id);

    let customerId = user.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString(),
        },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLAN_PRICES[plan],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const userId = customer.metadata.userId;

        if (subscription.status === 'active') {
          // Determine plan from price ID
          let plan = 'Starter';
          Object.entries(PLAN_PRICES).forEach(([planName, priceId]) => {
            if (subscription.items.data[0].price.id === priceId) {
              plan = planName;
            }
          });

          await User.findByIdAndUpdate(userId, {
            plan,
            subscription: {
              status: 'active',
              stripeCustomerId: subscription.customer,
              stripeSubscriptionId: subscription.id,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        const userId = customer.metadata.userId;

        await User.findByIdAndUpdate(userId, {
          plan: 'Starter',
          subscription: {
            status: 'canceled',
            stripeCustomerId: subscription.customer,
            stripeSubscriptionId: subscription.id,
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ message: 'Webhook processing error' });
  }
});

export default router;