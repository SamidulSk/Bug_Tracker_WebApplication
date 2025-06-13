import Summary from "../model/summary.model.js";
import Todo from "../model/todo.model.js";
import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});


export const generateDailySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const completedTasks = await Todo.find({
      user: userId,
      isComplete: true,
      dueDate: { $lte: new Date(today + "T23:59:59") }
    });

    const taskList = completedTasks.map(task => `- ${task.title}`).join("\n");

    if (!taskList.length) {
      return res.status(404).json({ message: "No completed tasks for today" });
    }

    const prompt = `congradulate me and Summarize the following tasks I completed today without any further question:\n${taskList}`;

    const completion = await openai.chat.completions.create({
  messages: [{ role: "user", content: prompt }],
  model: "llama3-8b-8192" 
});

    const summaryText = completion.choices[0].message.content;

    const saved = await Summary.create({
      user: userId,
      content: summaryText
    });

    res.status(200).json({ message: "Summary created", summary: saved });

  } catch (err) {
    console.error("❌ AI Summary Error:", err);
    res.status(500).json({ message: "Failed to generate summary", error: err.message });
  }
};

export const getSummaryHistory = async (req, res) => {
  try {
    const summaries = await Summary.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json({ summaries });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch summaries" });
  }
};
