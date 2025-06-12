import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Summary = mongoose.model("Summary", summarySchema);
export default Summary;
