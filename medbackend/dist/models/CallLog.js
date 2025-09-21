import mongoose from "mongoose";
const callSchema = new mongoose.Schema({
    sessionId: String,
    fromNumber: String,
    toNumber: String,
    transcript: { type: Array, default: [] },
    summary: String,
    isSuccessful: Boolean,
    dynamicVariables: { type: Object, default: {} },
    toolResults: {
        type: [
            {
                tool: String,
                args: Object,
                dynamicVariables: Object,
                at: { type: Date, default: Date.now }
            }
        ],
        default: []
    },
    tags: { type: [String], default: [] },
    followupRequired: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model("CallLog", callSchema);
//# sourceMappingURL=CallLog.js.map