import {Router} from "express";
import auth from "../middleware/auth.ts";

import { listSavedCalls, getCallById } from "../controllers/callController.ts";


const router = Router();

router.get("/", auth, listSavedCalls);


router.get("/:id", auth, getCallById);



export default router;


