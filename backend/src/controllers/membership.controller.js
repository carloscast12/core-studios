import User from "../models/User.js";
import Membership, { MEMBERSHIP_PLANS } from "../models/Membership.js";
import { refreshCycleIfNeeded } from "../utils/membershipCycle.js";

const THREE_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 3;

const withComputedDates = (membership) => {
  const cycleEndsAt = new Date(membership.currentCycleStart);
  cycleEndsAt.setMonth(cycleEndsAt.getMonth() + 1);
  const cancelableFrom = new Date(membership.startDate.getTime() + THREE_MONTHS_MS);
  const hoursUsed = MEMBERSHIP_PLANS[membership.plan].hours - membership.hoursRemaining;
  return { ...membership.toObject(), cycleEndsAt, cancelableFrom, hoursUsed };
};

export const getMyMembership = async (req, res) => {
  try {
    let membership = await Membership.findOne({ user: req.user.id });
    if (!membership) return res.status(200).json(null);
    membership = await refreshCycleIfNeeded(membership);
    return res.status(200).json(withComputedDates(membership));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createMembership = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "no autorizado" });
    }
    const { email, plan } = req.body;
    if (!MEMBERSHIP_PLANS[plan]) {
      return res.status(400).json({ message: "plan inválido" });
    }
    const targetUser = await User.findOne({ email });
    if (!targetUser) {
      return res.status(404).json({ message: "no existe un usuario con ese email" });
    }
    const existing = await Membership.findOne({ user: targetUser._id });
    if (existing) {
      return res.status(400).json({ message: "este usuario ya tiene una membresía" });
    }
    const membership = await Membership.create({
      user: targetUser._id,
      plan,
      hoursRemaining: MEMBERSHIP_PLANS[plan].hours,
    });
    return res.status(201).json(membership);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const cancelMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({ user: req.user.id });
    if (!membership) {
      return res.status(404).json({ message: "no tienes una membresía activa" });
    }
    const cancelableFrom = new Date(membership.startDate.getTime() + THREE_MONTHS_MS);
    if (new Date() < cancelableFrom) {
      return res.status(403).json({
        message: "todavía no puedes cancelar tu membresía",
        cancelableFrom,
      });
    }
    membership.status = "cancelada";
    await membership.save();
    return res.status(200).json(membership);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllMemberships = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "no autorizado" });
    }
    let memberships = await Membership.find().populate("user", "-password");
    memberships = await Promise.all(memberships.map(refreshCycleIfNeeded));
    return res.status(200).json(memberships.map(withComputedDates));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
