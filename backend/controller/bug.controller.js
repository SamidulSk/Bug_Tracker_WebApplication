import BugModel from "../model/bug.model.js";
import TagModel from "../model/tag.model.js";
import mongoose from "mongoose";

// ✅ Create Bug
export const createBug = async (req, res) => {
  try {
    const { title, description, severity, status, assignedTo, tags = [] } = req.body;

    if (!title || !description || !severity) {
      return res.status(400).json({ message: "Title, description, and severity are required." });
    }

    const bug = new BugModel({
      user: req.user._id,
      title,
      description,
      severity,
      status: status || "Open",
      assignedTo: assignedTo?.trim() ? assignedTo : null,
      tags,
    });

    const newBug = await bug.save();
    res.status(201).json({ message: "Bug created successfully.", bug: newBug });
  } catch (error) {
    console.error("❌ Bug creation error:", error.message);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getBugList = async (req, res) => {
  try {
    const { page = 1, limit = 5, sortBy = "createdAt", order = "desc", tagName } = req.query;

    const filter = { user: req.user._id };

    // Filter by tag name if provided
    if (tagName) {
      const tagDoc = await TagModel.findOne({ name: tagName.toLowerCase() });
      if (tagDoc) {
        filter["tags.tag"] = tagDoc._id;
      } else {
        return res.status(200).json({ bugs: [], total: 0 });
      }
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;

    // If sorting by severity, use custom order
    const sortStage = sortBy === "severity"
      ? {
          $addFields: {
            severityOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ["$severity", "high"] }, then: 3 },
                  { case: { $eq: ["$severity", "medium"] }, then: 2 },
                  { case: { $eq: ["$severity", "low"] }, then: 1 },
                ],
                default: 0,
              },
            },
          },
        }
      : null;

    const aggregationPipeline = [];

    if (Object.keys(filter).length > 0) aggregationPipeline.push({ $match: filter });

    if (sortStage) aggregationPipeline.push(sortStage);

    aggregationPipeline.push(
      {
        $sort: sortStage
          ? { severityOrder: sortOrder, createdAt: -1 }
          : { [sortBy]: sortOrder },
      },
      { $skip: skip },
      { $limit: Number(limit) }
    );

    const bugs = await BugModel.aggregate(aggregationPipeline);

    // Populate manually after aggregation
    const populatedBugs = await BugModel.populate(bugs, [
      { path: "assignedTo", select: "name email" },
      { path: "tags.tag" },
    ]);

    const totalBugs = await BugModel.countDocuments(filter);

    res.status(200).json({ bugs: populatedBugs, total: totalBugs });
  } catch (error) {
    console.error("❌ Bug fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch bugs", error: error.message });
  }
};


// ✅ Update Bug
export const updateBug = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, severity, status, assignedTo, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid bug ID" });
    }

    const updateFields = { title, description, severity, status };
    if (assignedTo?.trim()) updateFields.assignedTo = assignedTo;
    if (tags) updateFields.tags = tags;

    const updatedBug = await BugModel.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updateFields,
      { new: true }
    );

    if (!updatedBug) {
      return res.status(404).json({ message: "Bug not found." });
    }

    res.status(200).json({ message: "Bug updated successfully", bug: updatedBug });
  } catch (error) {
    console.error("❌ Bug update error:", error.message);
    res.status(500).json({ message: "Error updating bug", error: error.message });
  }
};


// ✅ Delete Bug
export const deleteBug = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBug = await BugModel.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deletedBug) {
      return res.status(404).json({ message: "Bug not found." });
    }

    res.status(200).json({ message: "Bug deleted successfully" });
  } catch (error) {
    console.error("❌ Bug delete error:", error.message);
    res.status(500).json({ message: "Error deleting bug", error });
  }
};
