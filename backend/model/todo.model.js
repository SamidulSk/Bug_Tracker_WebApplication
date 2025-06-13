import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  dueDate: {
    type: Date,
    required: true
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },

  isComplete: {
    type: Boolean,
    default: false
  },

  aiSummary: {
    type: String,  
    default: ""
  },
  reminder: {
  type: Boolean,
  default: false,
},


}, { timestamps: true }); 
const TodoModel = mongoose.model('todo', todoSchema);
export default TodoModel;
