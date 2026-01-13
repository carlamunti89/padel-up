import { Router } from "express";
import { registerPair, loginPair } from "../controllers/authController.js";

const router = Router();

router.post("/register", registerPair);

router.post("/login", loginPair);

export default router;
