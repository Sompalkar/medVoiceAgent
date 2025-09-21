import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/meddb";
export default async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");
    }
    catch (err) {
        console.error("MongoDB connect error:", err);
        process.exit(1);
    }
}
//# sourceMappingURL=database.js.map