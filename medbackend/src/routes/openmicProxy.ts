import {Router} from "express";
import auth from "../middleware/auth.js";


import { listBots, createBot, updateBot, deleteBot, listOpenMicCalls, getBot } from "../controllers/openmicProxy.js";
const router = Router();
 
router.use(auth);


router.get("/bots", listBots);

router.get("/bots/:uid", getBot);


router.post("/bots", createBot);

router.patch("/bots/:uid", updateBot);

router.delete("/bots/:uid", deleteBot);


router.get("/calls/openmic", listOpenMicCalls);


export default router;
