import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({
    medicalId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    dob: { type: Date },
    allergies: { type: String },
    medications: { type: String },
    notes: { type: String },
    lastVisit: { type: Date },
    email: { type: String },
    address: { type: String },
    insuranceProvider: { type: String },
    policyNumber: { type: String },
    primaryPhysician: { type: String },
    conditions: { type: [String], default: [] },
    preferredLanguage: { type: String },
    emergencyContactName: { type: String },
    emergencyContactPhone: { type: String }
}, { timestamps: true });
export default mongoose.model("Patient", patientSchema);
//# sourceMappingURL=Patient.js.map