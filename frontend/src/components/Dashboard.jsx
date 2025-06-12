import { useEffect, useState } from "react";
import axios from "../Helper/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", priority: "Medium" });
  const [summary, setSummary] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("dueDate");
  const [order, setOrder] = useState("asc");

  const navigate = useNavigate();

  const fetchTodos = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const response = await axios.get(`/todo/getTodoList?page=${page}&limit=5&sortBy=${sortBy}&order=${order}`);
      setTodos(response.data.todos || response.data.todoList || []);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      setError("Unable to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [page, sortBy, order]);

  const handleCreate = async () => {
    try {
      await axios.post("/todo/createTodo", newTask);
      fetchTodos();
      setNewTask({ title: "", description: "", dueDate: "", priority: "Medium" });
    } catch (err) {
      setError("Failed to create task");
    }
  };

  const handleStatusToggle = async (id) => {
    const task = todos.find((t) => t._id === id);
    await axios.put(`/todo/updateTodo/${id}`, { isComplete: !task.isComplete });
    fetchTodos();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/todo/${id}`);
    fetchTodos();
  };

  const handleGenerateSummary = async () => {
    try {
      const response = await axios.post("/summary/generate");
      setSummary(response.data.summary.content);
      setShowModal(true);
    } catch (err) {
      setSummary("Failed to generate summary");
      setShowModal(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = todos.filter((t) => t.dueDate?.slice(0, 10) === today && !t.isComplete);
  const upcoming = todos.filter((t) => t.dueDate?.slice(0, 10) > today && !t.isComplete);
  const completed = todos.filter((t) => t.isComplete);

  const TaskGroup = ({ title, tasks }) => (
    <div className="mb-8">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h2 className="text-xl font-semibold text-white">{title} <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full ml-2">{tasks.length}</span></h2>
      </div>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="p-4 bg-slate-800 border border-slate-600 rounded-lg shadow-md text-white flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
              <h3 className="text-lg font-bold">{task.title}</h3>
              <p className="text-sm text-slate-300">{task.description}</p>
              <p className="text-xs text-slate-400">Due: {task.dueDate?.slice(0, 10)}</p>
              <p className="text-xs text-slate-400">Priority: {task.priority}</p>
            </div>
            <div className="flex space-x-4 mt-3 sm:mt-0">
              <button onClick={() => handleStatusToggle(task._id)} className="text-sm text-green-400 hover:underline">{task.isComplete ? "Undo" : "Complete"}</button>
              <button onClick={() => handleDelete(task._id)} className="text-sm text-red-400 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <div className="flex gap-3">
            <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Logout</button>
            <button onClick={handleGenerateSummary} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">AI Summary</button>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-slate-800 text-white p-6 rounded shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-2">AI Summary</h2>
              <p className="text-sm whitespace-pre-line">{summary}</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}

        <div className="bg-slate-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Add New Task</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <input type="text" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="p-2 border rounded-md bg-slate-700 text-white" />
            <input type="text" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="p-2 border rounded-md bg-slate-700 text-white" />
            <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="p-2 border rounded-md bg-slate-700 text-white" />
            <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="p-2 border rounded-md bg-slate-700 text-white">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <button onClick={handleCreate} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Task</button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="space-x-2">
            <label className="text-white text-sm">Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded-md bg-slate-700 text-white">
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="isComplete">Status</option>
            </select>
            <select value={order} onChange={(e) => setOrder(e.target.value)} className="p-2 border rounded-md bg-slate-700 text-white">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className="space-x-2">
            <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700">Previous</button>
            <button onClick={() => setPage(prev => prev + 1)} className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700">Next</button>
          </div>
        </div>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <TaskGroup title="Today's Focus" tasks={todayTasks} />
        <TaskGroup title="Upcoming" tasks={upcoming} />
        <TaskGroup title="Completed" tasks={completed} />
      </div>
    </div>
  );
}
