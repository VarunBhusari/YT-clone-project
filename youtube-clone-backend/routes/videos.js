import express from "express";
import {
    getAllVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
} from "../controllers/videoController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.post("/", verifyToken, createVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);

export default router;
