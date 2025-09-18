import mongoose from "mongoose";
const callSchema = new mongoose.Schema({

  sessionId: String,
  fromNumber: String,
  toNumber: String,

  transcript: { type: Array, default: [] },  

  summary: String,
  isSuccessful: Boolean,

  dynamicVariables: { type: Object, default: {} }
  
}, { timestamps: true });

export default mongoose.model("CallLog", callSchema);
