import { Router } from "express";
import {
  createBooking,
  getBooking,
  getAdminBooking,
  getAvailableSlots,
  updateBooking,
  deleteBooking,
  updateBookingStatus,
} from "../controllers/booking.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, createBooking);
router.get("/my", verifyToken, getBooking);
router.get("/admin", verifyToken, getAdminBooking);
router.get("/slots", verifyToken, getAvailableSlots);
router.put("/:id", verifyToken, updateBooking);
router.delete("/:id", verifyToken, deleteBooking);
router.put("/:id/status", verifyToken, updateBookingStatus);

export default router;
