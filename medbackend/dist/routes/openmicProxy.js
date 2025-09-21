import { Router } from "express";
import auth from "../middleware/auth.js";
import { listBots, createBot, updateBot, deleteBot, listOpenMicCalls } from "../controllers/openmicProxy.js";
const router = Router();
router.use(auth);
router.get("/bots", listBots);
router.post("/bots", createBot);
router.patch("/bots/:uid", updateBot);
router.delete("/bots/:uid", deleteBot);
router.get("/calls/openmic", listOpenMicCalls);
export default router;
//# sourceMappingURL=openmicProxy.js.map