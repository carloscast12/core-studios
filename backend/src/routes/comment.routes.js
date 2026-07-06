import { Router } from "express";
import {
  createComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:id", verifyToken, createComment);
router.delete("/:id", verifyToken, deleteComment);

export default router;
