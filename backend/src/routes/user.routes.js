import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  getStats,
  getUserById,
  getUserStats,
  getFollowers,
  getFollowing,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.post("/avatar", verifyToken, upload.single("avatar"), uploadAvatar);
router.get("/stats", verifyToken, getStats);
router.get("/:id/stats", verifyToken, getUserStats);
router.get("/:id/followers", verifyToken, getFollowers);
router.get("/:id/following", verifyToken, getFollowing);
router.get("/:id", verifyToken, getUserById);
router.delete("/:id", verifyToken, deleteUser);

export default router;
