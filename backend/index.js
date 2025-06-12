import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import todoRoute from "./routes/todo.route.js";
import userRoute from "./routes/user.route.js";
import cors from "cors";

const app = express();
dotenv.config();

// port
const port = process.env.PORT || 4002;
app.listen(port, () => {
  console.log(`server up on ${port}`);
});

// database connection
const DB_URI = process.env.MONGODB_URI || "mongodb+srv://mrsamidul2002:CmQCIQzqRGWLLgyP@cluster0.dxkeu1q.mongodb.net/";
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
  origin: "*",// check tutorial @2:38 // fetch from .env file
  // credentials: true, // enable cookies
  methods: ["GET", "POST", "PUT", "DELETE"]
  // allowedHeaders: ["Content-Type", "Authorization"] //  allowed headers
}));
app.use(express.json());
// routes
app.use("/user", userRoute);
app.use("/todo", todoRoute);


app.get(`/`, (req, res) => {
  res.send(`TODO App`);
})
