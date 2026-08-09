import { Router } from "express";
import {
  getSuggestions,
  followUser,
  unfollowUser,
} from "../controllers/follow.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/suggestions", verifyToken, getSuggestions);
router.post("/:userId", verifyToken, followUser);
router.delete("/:userId", verifyToken, unfollowUser);

export default router;
