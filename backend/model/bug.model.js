import mongoose from "mongoose";

const bugSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ Store only tag name and source
    tags: [
      {
        name: {
          type: String,
          required: true,
        },
        source: {
          type: String,
          enum: ["user", "ai"],
          default: "user",
        },
      },
    ],
  },
  { timestamps: true }
);

const BugModel = mongoose.model("Bug", bugSchema);
export default BugModel;
