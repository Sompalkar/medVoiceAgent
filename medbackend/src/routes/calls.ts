import {Router} from "express";
import auth from "../middleware/auth.js";

import { listSavedCalls, getCallById } from "../controllers/callController.js";


const router = Router();

router.get("/", auth, listSavedCalls);


router.get("/:id", auth, getCallById);



export default router;


