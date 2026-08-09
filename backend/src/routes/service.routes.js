import { Router } from "express";
import { sendServiceInquiry } from "../controllers/service.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/inquiry", verifyToken, sendServiceInquiry);

export default router;
