import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    source: {
      type: String,
      enum: ["ai", "manual"],
      default: "manual",
    },
  },
  { timestamps: true }
);

const TagModel = mongoose.model("Tag", tagSchema);
export default TagModel;
