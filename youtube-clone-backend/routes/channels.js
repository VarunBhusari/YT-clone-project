import express from "express";
import {
    createChannel,
    getAllChannels,
    getChannelById,
    updateChannel,
    deleteChannel,
} from "../controllers/channelController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createChannel);
router.get("/", getAllChannels);
router.get("/:id", getChannelById);
router.put("/:id", verifyToken, updateChannel);
router.delete("/:id", verifyToken, deleteChannel);

export default router;
