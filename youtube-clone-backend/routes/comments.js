import express from "express";
import {
    addComment,
    getCommentsByVideo,
    updateComment,
    deleteComment,
} from "../controllers/commentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:videoId", verifyToken, addComment);
router.get("/:videoId", getCommentsByVideo);
router.put("/:commentId", verifyToken, updateComment);
router.delete("/:commentId", verifyToken, deleteComment);

export default router;
