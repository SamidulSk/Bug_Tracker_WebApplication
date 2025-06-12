import TodoModel from "../model/todo.model.js";

// CREATE ToDo
export const createTodo = async (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  const todo = new TodoModel({
    title,
    description,
    dueDate,
    priority,
    isComplete: false,
    user: req.user.id
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json({ message: "Todo created successfully", todo: newTodo });
  } catch (error) {
    console.error("Create Todo Error:", error.message);
    res.status(500).json({ message: "Error creating todo" });
  }
};

// READ All ToDos for Logged-in User
export const getTodoList = async (req, res) => {
  try {
    const todos = await TodoModel.find({ user: req.user.id }).sort({ dueDate: 1 });
    res.status(200).json({ message: "Todo list fetched", todos });
  } catch (error) {
    console.error("Fetch Todo Error:", error.message);
    res.status(500).json({ message: "Error fetching todo list" });
  }
};

// UPDATE ToDo by ID
export const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await TodoModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo updated", todo: updatedTodo });
  } catch (error) {
    console.error("Update Todo Error:", error.message);
    res.status(500).json({ message: "Error updating todo" });
  }
};

// DELETE ToDo by ID
export const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await TodoModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted", todo: deletedTodo });
  } catch (error) {
    console.error("Delete Todo Error:", error.message);
    res.status(500).json({ message: "Error deleting todo" });
  }
};
