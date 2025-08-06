import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", getMe); // For getting current user details if JWT is valid

export default router;
