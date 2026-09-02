import { Router } from "express";
import {
  getMyMembership,
  createMembership,
  cancelMembership,
  getAllMemberships,
} from "../controllers/membership.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", verifyToken, getMyMembership);
router.delete("/me", verifyToken, cancelMembership);
router.post("/", verifyToken, createMembership);
router.get("/admin", verifyToken, getAllMemberships);

export default router;
