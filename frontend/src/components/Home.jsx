/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "../Helper/axiosConfig";
import { useNavigate } from "react-router-dom";

function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium"
  });

  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodo, setEditedTodo] = useState({ title: "" });

  const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      setLoading(true);
      const response = await axios.get("/todo/getTodoList", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos(response.data.todos || response.data.todoList || []);
    } catch (error) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const createTodo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/todo/createTodo", newTodo, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos([...todos, response.data.todo]);
      setNewTodo({ title: "", description: "", dueDate: "", priority: "Medium" });
    } catch (error) {
      setError("Failed to create task");
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`/todo/updateTodo/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos(todos.map(todo => (todo._id === id ? response.data.todo : todo)));
    } catch (error) {
      setError("Failed to update task");
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/todo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      setError("Failed to delete task");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">ToDo Dashboard</h1>

      <div className="bg-white shadow p-4 rounded-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>
        <input type="text" placeholder="Title" className="input w-full mb-2 p-2 border rounded" value={newTodo.title} onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })} />
        <input type="text" placeholder="Description" className="input w-full mb-2 p-2 border rounded" value={newTodo.description} onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })} />
        <input type="date" className="input w-full mb-2 p-2 border rounded" value={newTodo.dueDate} onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })} />
        <select className="input w-full mb-2 p-2 border rounded" value={newTodo.priority} onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button onClick={createTodo} className="btn-primary bg-blue-600 text-white px-4 py-2 rounded w-full mt-2">Add Task</button>
      </div>

      <div className="space-y-4">
        {todos.map(todo => (
          <div key={todo._id} className="bg-gray-100 p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{todo.title}</h3>
                <p className="text-sm text-gray-600">{todo.description}</p>
                <p className="text-xs text-gray-500">Due: {new Date(todo.dueDate).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500">Priority: {todo.priority}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => updateTodo(todo._id, { isComplete: !todo.isComplete })} className="text-blue-600">
                  {todo.isComplete ? "Undo" : "Complete"}
                </button>
                <button onClick={() => deleteTodo(todo._id)} className="text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={logout} className="btn-secondary mt-6 w-full bg-gray-300 text-black px-4 py-2 rounded">Logout</button>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}

export default Home;
