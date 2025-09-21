import { Router } from "express";
import auth from "../middleware/auth.js";
import { listPatients, createPatient, deletePatient, updatePatient } from "../controllers/patientController.js";
const router = Router();
router.use(auth);
router.get("/", listPatients);
router.post("/", createPatient);
router.patch("/:id", updatePatient);
router.delete("/:id", deletePatient);
export default router;
//# sourceMappingURL=patients.js.map