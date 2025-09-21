import {Router} from "express";
import { register, login, logout } from "../controllers/auth.ts";
import auth from "../middleware/auth.ts";

const router = Router();

// Auth check endpoint
router.get("/me", auth, (req, res) => {

  res.json({ user: (req as any).user });

});

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

export default router;
