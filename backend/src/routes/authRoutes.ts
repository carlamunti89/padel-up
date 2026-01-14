import { Router } from "express";
import { registerPair, loginPair } from "../controllers/authController.js";
import { validateRegistration } from "../middleware/validateRegistration.js";

const router = Router();

router.post("/register", validateRegistration, registerPair);

router.post("/login", loginPair);

export default router;
