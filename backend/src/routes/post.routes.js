import { Router } from "express";
import {
  createPost,
  getPosts,
  deletePost,
  likePost,
  getPostById,
} from "../controllers/post.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, createPost);
router.get("/", verifyToken, getPosts);
router.delete("/:id", verifyToken, deletePost);
router.put("/:id/like", verifyToken, likePost);
router.get("/:id", verifyToken, getPostById);

export default router;
