import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Patient from "../models/Patient.js";
async function run() {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/meddb";
    await mongoose.connect(uri);
    await Patient.deleteMany({ medicalId: { $in: ["M100", "M101"] } });
    await Patient.create([
        {
            medicalId: "M100",
            name: "Alice Smith",
            phone: "+15551111111",
            email: "alice@example.com",
            address: "123 Maple St, Springfield",
            insuranceProvider: "Acme Health",
            policyNumber: "AC-100-200",
            primaryPhysician: "Dr. House",
            conditions: ["Hypertension"],
            allergies: "Penicillin",
            medications: "Aspirin",
            preferredLanguage: "en",
            lastVisit: new Date("2024-08-20"),
            emergencyContactName: "John Smith",
            emergencyContactPhone: "+15553334444",
            notes: "Prefers morning appointments"
        },
        {
            medicalId: "M101",
            name: "Bob Kumar",
            phone: "+15552222222",
            email: "bob@example.com",
            address: "456 Oak Ave, Metropolis",
            insuranceProvider: "BetterCare",
            policyNumber: "BC-300-400",
            primaryPhysician: "Dr. Strange",
            conditions: ["Diabetes"],
            allergies: "None",
            medications: "Insulin",
            preferredLanguage: "en",
            lastVisit: null,
            emergencyContactName: "Anita Kumar",
            emergencyContactPhone: "+15554445555",
            notes: "Needs translator for complex topics"
        }
    ]);
    console.log("seeded");
    await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
//# sourceMappingURL=seed.js.map