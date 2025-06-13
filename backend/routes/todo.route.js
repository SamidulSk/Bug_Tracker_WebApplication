import express from "express";
import {
  createTodo,
  getTodoList,
  updateTodo,
  deleteTodo
} from "../controller/todo.controller.js";
import { verifyToken } from "../jwt/token.js";

const router = express.Router();

// 
// @desc    Create a new task
router.post('/createTodo', verifyToken, createTodo);

// 
// @desc    Get all tasks for logged-in user
router.get("/getTodoList", verifyToken, getTodoList);

// @route   PUT /todo/:id
// @desc    Update a task
router.put("/updateTodo/:id", verifyToken, updateTodo);

// @route   DELETE /todo/:id
// @desc    Delete a task
router.delete("/:id", verifyToken, deleteTodo);

export default router;
