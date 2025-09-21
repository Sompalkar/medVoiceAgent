import {Router} from "express";

import { handlePreCall, handleGetPatient, handlePostCall } from "../controllers/webhooks.js";

const router = Router();
 
router.post("/pre-call", handlePreCall);


router.post("/get-patient", handleGetPatient);  


router.post("/post-call", handlePostCall);


export default router;
