import { Router } from "express";
import { createCheckout, confirmCheckout } from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/checkout", verifyToken, createCheckout);
router.get("/checkout/:reference/confirm", verifyToken, confirmCheckout);

export default router;
