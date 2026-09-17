import Stripe from "stripe";

let stripe;
const getStripe = () => {
  if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
};

export const createStripeCheckoutSession = async ({ amount, reference, description, successUrl, cancelUrl }) => {
  return getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: description },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    client_reference_id: reference,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
};

export const createStripeSubscriptionSession = async ({ priceId, reference, successUrl, cancelUrl }) => {
  return getStripe().checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: reference,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
};

export const getStripeCheckoutSession = async (sessionId) => {
  return getStripe().checkout.sessions.retrieve(sessionId);
};

export const cancelStripeSubscription = async (subscriptionId) => {
  return getStripe().subscriptions.cancel(subscriptionId);
};

export const constructStripeEvent = (rawBody, signature) => {
  return getStripe().webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
};
