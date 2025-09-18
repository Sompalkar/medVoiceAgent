import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    medicalId: { type: String, required: true, unique: true },


    name: { type: String, required: true },


    phone: { type: String, required: true, unique: true },


    dob: { type: Date },

    allergies: { type: String },

    medications: { type: String },

    notes: { type: String },

    lastVisit: { type: Date }

}, { timestamps: true });

export default mongoose.model("Patient", patientSchema);
