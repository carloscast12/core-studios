import { MEMBERSHIP_PLANS } from "../models/Membership.js";

export const refreshCycleIfNeeded = async (membership) => {
  const nextCycle = new Date(membership.currentCycleStart);
  nextCycle.setMonth(nextCycle.getMonth() + 1);
  if (new Date() >= nextCycle) {
    membership.currentCycleStart = nextCycle;
    membership.hoursRemaining = MEMBERSHIP_PLANS[membership.plan].hours;
    await membership.save();
  }
  return membership;
};
