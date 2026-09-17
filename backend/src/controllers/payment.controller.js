import Booking from "../models/Booking.js";
import Membership, { MEMBERSHIP_PLANS } from "../models/Membership.js";
import Payment from "../models/Payment.js";
import { createStripeCheckoutSession, getStripeCheckoutSession } from "../utils/stripe.js";

export const createCheckout = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "el carrito está vacío" });
    }

    const paymentItems = [];
    let amount = 0;

    for (const item of items) {
      if (item.type === "booking") {
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
      } else if (item.type === "membership") {
        if (!MEMBERSHIP_PLANS[item.plan]) {
          return res.status(400).json({ message: "plan de membresía inválido" });
        }
        const existing = await Membership.findOne({ user: req.user.id });
        if (existing) {
          return res.status(400).json({ message: "ya tienes una membresía" });
        }
        amount += MEMBERSHIP_PLANS[item.plan].price;
        paymentItems.push({ type: "membership", plan: item.plan });
      } else {
        return res.status(400).json({ message: "artículo de carrito inválido" });
      }
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
      for (const item of payment.items) {
        if (item.type === "booking") {
          await Booking.findByIdAndUpdate(item.booking, { status: "confirmada" });
        } else if (item.type === "membership") {
          const existing = await Membership.findOne({ user: req.user.id });
          if (!existing) {
            await Membership.create({
              user: req.user.id,
              plan: item.plan,
              hoursRemaining: MEMBERSHIP_PLANS[item.plan].hours,
            });
          }
        }
      }
      payment.status = "pagado";
      await payment.save();
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
