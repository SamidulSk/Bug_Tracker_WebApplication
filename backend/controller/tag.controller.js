import { Groq } from "groq-sdk";
import TagModel from "../model/tag.model.js";
import BugModel from "../model/bug.model.js";
import dotenv from "dotenv";

dotenv.config();

// 🧠 Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 🎯 Generate AI-based tags for a specific bug
export const generateTagsForBug = async (req, res) => {
  try {
    const { bugId } = req.params;

    const bug = await BugModel.findById(bugId);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found." });
    }

    const prompt = [
      `You are an expert QA engineer.`,
      `Generate a list of relevant tags (like 'frontend', 'database', 'crash') based only on the bug info.`,
      `Return only tags in a comma-separated format. No explanations.`,
      `Bug Title: "${bug.title}"`,
      `Description: "${bug.description}"`,
      bug.stepsToReproduce ? `Steps: "${bug.stepsToReproduce}"` : "",
    ].join("\n");

    const response = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const aiContent = response.choices?.[0]?.message?.content || "";
    console.log("🎯 AI Raw Tags:", aiContent);

    const rawTags = aiContent
      .split(/[,|\n|-]+/)
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    if (rawTags.length === 0) {
      return res.status(400).json({ message: "No valid tags generated from AI." });
    }

    // Save tags in TagModel if not exists, and return full tag object for bug
    const tagObjects = await Promise.all(
      rawTags.map(async (tag) => {
        const exists = await TagModel.findOne({ name: tag });
        if (!exists) {
          await TagModel.create({ name: tag, source: "ai" });
        }
        return { name: tag, source: "ai" };
      })
    );

    bug.tags = tagObjects;
    await bug.save();

    return res.status(200).json({ message: "Tags generated", tags: bug.tags });
  } catch (error) {
    console.error("❌ Tag Generation Error:", error.message);
    return res.status(500).json({ message: "Failed to generate tags", error: error.message });
  }
};

// 📥 Get all tags
export const getAllTags = async (req, res) => {
  try {
    const tags = await TagModel.find({}).sort({ name: 1 });
    res.status(200).json(tags);
  } catch (error) {
    console.error("❌ Get Tags Error:", error.message);
    res.status(500).json({ message: "Error retrieving tags", error: error.message });
  }
};
