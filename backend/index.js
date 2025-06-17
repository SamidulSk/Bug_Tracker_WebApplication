import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bugRoute from "./routes/bug.route.js";
import userRoute from "./routes/user.route.js";
import tagRoute from "./routes/tag.route.js";
import cors from "cors";
import "./cron/reminderJob.js";
const app = express();
dotenv.config();

// port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server up on ${port}`);
});

// database connection
const DB_URI = process.env.MONGO_URI || "mongodb+srv://mrsamidul2002:40VlIn15YPG7GMlY@cluster0.rzt0wzm.mongodb.net/";
(async () => {
  try {
    const { connection } = await mongoose.connect(DB_URI);
    if (connection) {
      console.log(`Connected to MongoDB: ${connection.host} ${connection.name}`);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();


app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
// routes
app.use("/user", userRoute);
app.use("/bug", bugRoute);
app.use("/tag", tagRoute);

app.get(`/`, (req, res) => {
  res.send(`Bug Tracker App`);
})
