import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, logout, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Demasiados intentos, intenta de nuevo en unos minutos" },
  skip: () => process.env.NODE_ENV === "test",
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", verifyToken, logout);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

export default router;
