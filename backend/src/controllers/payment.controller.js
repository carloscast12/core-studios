import Booking from "../models/Booking.js";
import Membership, { MEMBERSHIP_PLANS } from "../models/Membership.js";
import Payment from "../models/Payment.js";
import {
  createStripeCheckoutSession,
  createStripeSubscriptionSession,
  getStripeCheckoutSession,
  constructStripeEvent,
} from "../utils/stripe.js";

const PRICE_IDS = {
  basic: process.env.STRIPE_PRICE_BASIC,
  premium: process.env.STRIPE_PRICE_PREMIUM,
};

const fulfillPayment = async (payment, session) => {
  if (payment.status === "pagado") return;
  for (const item of payment.items) {
    if (item.type === "booking") {
      await Booking.findByIdAndUpdate(item.booking, { status: "confirmada" });
    } else if (item.type === "membership") {
      const existing = await Membership.findOne({ user: payment.user });
      if (!existing) {
        await Membership.create({
          user: payment.user,
          plan: item.plan,
          hoursRemaining: MEMBERSHIP_PLANS[item.plan].hours,
          stripeSubscriptionId: session?.subscription,
          stripeCustomerId: session?.customer,
        });
      }
    }
  }
  payment.status = "pagado";
  await payment.save();
};

const createMembershipCheckout = async (req, res, item) => {
  if (!MEMBERSHIP_PLANS[item.plan]) {
    return res.status(400).json({ message: "plan de membresía inválido" });
  }
  const existing = await Membership.findOne({ user: req.user.id });
  if (existing) {
    return res.status(400).json({ message: "ya tienes una membresía" });
  }

  const reference = `pago-${req.user.id}-${Date.now()}`;
  const session = await createStripeSubscriptionSession({
    priceId: PRICE_IDS[item.plan],
    reference,
    successUrl: `${process.env.FRONTEND_URL}/pago-completado?ref=${reference}`,
    cancelUrl: `${process.env.FRONTEND_URL}/membresias`,
  });

  await Payment.create({
    user: req.user.id,
    checkoutId: session.id,
    checkoutReference: reference,
    amount: MEMBERSHIP_PLANS[item.plan].price,
    items: [{ type: "membership", plan: item.plan }],
  });

  return res.status(201).json({ hostedCheckoutUrl: session.url });
};

const createBookingsCheckout = async (req, res, items) => {
  const paymentItems = [];
  let amount = 0;

  for (const item of items) {
    if (item.type !== "booking") {
      return res.status(400).json({ message: "artículo de carrito inválido" });
    }
    const booking = await Booking.findOne({
      _id: item.bookingId,
      user: req.user.id,
      status: "pendiente",
    });
    if (!booking) {
      return res.status(400).json({ message: "una de las reservas ya no está disponible" });
    }
    amount += booking.price;
    paymentItems.push({ type: "booking", booking: booking._id });
  }

  const reference = `pago-${req.user.id}-${Date.now()}`;
  const session = await createStripeCheckoutSession({
    amount,
    reference,
    description: "Compra en Core Studios",
    successUrl: `${process.env.FRONTEND_URL}/pago-completado?ref=${reference}`,
    cancelUrl: `${process.env.FRONTEND_URL}/dashboard`,
  });

  await Payment.create({
    user: req.user.id,
    checkoutId: session.id,
    checkoutReference: reference,
    amount,
    items: paymentItems,
  });

  return res.status(201).json({ hostedCheckoutUrl: session.url });
};

export const createCheckout = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "el carrito está vacío" });
    }

    const hasMembership = items.some((item) => item.type === "membership");
    if (hasMembership) {
      if (items.length > 1) {
        return res.status(400).json({ message: "compra la membresía por separado de las reservas" });
      }
      return await createMembershipCheckout(req, res, items[0]);
    }

    return await createBookingsCheckout(req, res, items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const confirmCheckout = async (req, res) => {
  try {
    const { reference } = req.params;
    const payment = await Payment.findOne({ checkoutReference: reference, user: req.user.id });
    if (!payment) {
      return res.status(404).json({ message: "pago no encontrado" });
    }
    if (payment.status === "pagado") {
      return res.status(200).json({ status: "pagado" });
    }

    const session = await getStripeCheckoutSession(payment.checkoutId);

    if (session.payment_status === "paid") {
      await fulfillPayment(payment, session);
      return res.status(200).json({ status: "pagado" });
    }

    if (session.status === "expired") {
      payment.status = "fallido";
      await payment.save();
      return res.status(200).json({ status: "fallido" });
    }

    return res.status(200).json({ status: "pendiente" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSubscriptionId = (invoice) =>
  invoice.subscription || invoice.parent?.subscription_details?.subscription;

export const stripeWebhook = async (req, res) => {
  let event;
  try {
    event = constructStripeEvent(req.body, req.headers["stripe-signature"]);
  } catch (error) {
    return res.status(400).json({ message: `firma de webhook inválida: ${error.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const payment = await Payment.findOne({ checkoutId: session.id });
    if (payment && session.payment_status === "paid") {
      await fulfillPayment(payment, session);
    }
  }

  if (event.type === "invoice.payment_failed") {
    const subscriptionId = getSubscriptionId(event.data.object);
    if (subscriptionId) {
      await Membership.findOneAndUpdate(
        { stripeSubscriptionId: subscriptionId, status: "activa" },
        { status: "pausada" },
      );
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    await Membership.findOneAndUpdate(
      { stripeSubscriptionId: subscription.id },
      { status: "cancelada" },
    );
  }

  return res.status(200).json({ received: true });
};
