import TodoModel from "../model/todo.model.js";

// ✅ CREATE ToDo
export const createTodo = async (req, res) => {
  try {
    const { title, description, dueDate, priority, reminder } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found in request" });
    }

    const todo = new TodoModel({
      title,
      description,
      dueDate,
      priority,
      reminder: !!reminder,
      user: req.user._id,
    });

    const newTodo = await todo.save();
    res.status(201).json({ message: "Todo created successfully", todo: newTodo });
  } catch (error) {
    console.error("Create Todo Error:", error);
    res.status(500).json({ message: "Error creating todo", error: error.message });
  }
};

// ✅ READ ToDos (with pagination and sorting)
export const getTodoList = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = "dueDate", order = "asc" } = req.query;

    const sortOptions = {
      dueDate: { dueDate: order === "asc" ? 1 : -1 },
      priority: { priority: order === "asc" ? 1 : -1 },
      isComplete: { isComplete: order === "asc" ? 1 : -1 },
    };

    const todos = await TodoModel.find({ user: req.user._id })
      .sort(sortOptions[sortBy] || { dueDate: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await TodoModel.countDocuments({ user: req.user._id });

    res.status(200).json({
      message: "Todo list fetched",
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      todos,
    });
  } catch (error) {
    console.error("Fetch Todo Error:", error.message);
    res.status(500).json({ message: "Error fetching todo list" });
  }
};

// ✅ UPDATE ToDo
export const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await TodoModel.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
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

// ✅ DELETE ToDo
export const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await TodoModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
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
