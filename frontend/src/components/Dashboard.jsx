// dashboard.jsx
import { useEffect, useState } from "react";
import axios from "../Helper/axiosConfig.js";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [bugs, setBugs] = useState([]);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("severity");
  const [order, setOrder] = useState("desc");
  const [view, setView] = useState("all");
  const [filterTags, setFilterTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "low",
    status: "Open",
    assignedTo: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  const fetchBugs = async () => {
    try {
      const res = await axios.get(
        `/bug/getBugList?page=${page}&limit=100&sortBy=${sortBy}&order=${order}`
      );
      setBugs(res.data.bugs || []);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      setError("Unable to fetch bugs");
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get("/user/me");
      setUser(res.data.user);
    } catch {
      console.error("Failed to fetch user");
    }
  };

  useEffect(() => {
    fetchBugs();
    fetchUser();
  }, [page, sortBy, order]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", severity: "low", status: "Open", assignedTo: "" });
    setEditingId(null);
  };

  const handleInput = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBugSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...formData,
      severity:
        formData.severity.charAt(0).toUpperCase() + formData.severity.slice(1),
    };
    try {
      if (editingId) {
        await axios.put(`/bug/updateBug/${editingId}`, payload);
      } else {
        await axios.post("/bug/createBug", payload);
      }
      resetForm();
      fetchBugs();
    } catch {
      alert("Bug submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bug) => {
    setFormData({
      title: bug.title,
      description: bug.description,
      severity: bug.severity.toLowerCase(),
      status: bug.status,
      assignedTo: bug.assignedTo?._id || "",
    });
    setEditingId(bug._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this bug?")) {
      try {
        await axios.delete(`/bug/${id}`);
        fetchBugs();
      } catch {
        alert("Failed to delete bug");
      }
    }
  };

  const triggerTagGen = async (bugId) => {
  try {
    const res = await axios.post(`/tag/generate/${bugId}`);
    console.log("✅ Tags Generated:", res.data);
    fetchBugs(); 
  } catch (err) {
    console.error("❌ Tag generation failed:", err.response?.data || err.message);
    alert("Tag generation failed. Check console for details.");
  }
};

  const toggleFilterTag = (tagId) => {
    const id = typeof tagId === "object" ? tagId._id : tagId;
    setFilterTags((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const groupedBy = (key) =>
    bugs.reduce((acc, bug) => {
      const group = bug[key] || "Unspecified";
      if (!acc[group]) acc[group] = [];
      acc[group].push(bug);
      return acc;
    }, {});

  const isTagMatch = (tag) => {
    const id = tag?.tag?._id || tag?._id || tag;
    return filterTags.includes(id);
  };

  const filteredBugs = bugs.filter(
    (bug) =>
      filterTags.length === 0 ||
      (bug.tags || []).some(isTagMatch)
  );

  const renderBugCard = (bug) => (
    <div
      key={bug._id}
      className="p-4 bg-slate-800 border border-slate-600 rounded-lg shadow mb-3"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">{bug.title}</h3>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-blue-700 text-white">
            {bug.status}
          </span>
          <span className="px-2 py-1 rounded bg-purple-700 text-white">
            {bug.severity}
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-300 mt-1">{bug.description}</p>
      {bug.assignedTo && (
        <p className="text-xs text-slate-400 mt-1">
          👤 {bug.assignedTo.name} ({bug.assignedTo.email})
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {(bug.tags || []).map((tag, i) => {
          const tagId = tag._id || i;
          const tagName =
            typeof tag === "string"
              ? tag
              : tag.name || tag.tag || String(tagId);
          const isAI = tag.source === "ai";
          return (
            <span
              key={tagId}
              onClick={() => toggleFilterTag(tagId)}
              className={`cursor-pointer px-2 py-1 rounded-full text-xs ${
                filterTags.includes(tagId) ? "bg-green-600" : "bg-slate-600"
              }`}
            >
              {tagName} {isAI && "🤖"}
            </span>
          );
        })}
        <button
          onClick={() => triggerTagGen(bug._id)}
          className="ml-auto text-sm bg-indigo-600 px-2 py-1 rounded"
        >
          Generate Tags
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-1">
        📅 {new Date(bug.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-2 flex space-x-2">
        <button
          onClick={() => handleEdit(bug)}
          className="bg-yellow-600 px-3 py-1 rounded text-xs"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(bug._id)}
          className="bg-red-600 px-3 py-1 rounded text-xs"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">🐞 Bug Tracker Dashboard</h1>
          <div className="flex items-center gap-4">
            {user && (
              <p className="text-sm text-slate-300">
                👋 Welcome,{" "}
                <span className="font-semibold">{user.username}</span>
              </p>
            )}
            <button
              onClick={logout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <form
          onSubmit={handleBugSubmit}
          className="bg-slate-800 p-4 mb-6 rounded border border-slate-600"
        >
          <h2 className="text-xl font-semibold mb-3">
            {editingId ? "✏️ Update Bug" : "📝 Report a New Bug"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              required
              name="title"
              className="p-2 bg-slate-700 rounded"
              placeholder="Bug title"
              value={formData.title}
              onChange={handleInput}
            />
            <input
              name="assignedTo"
              className="p-2 bg-slate-700 rounded"
              placeholder="Assigned To (User ID)"
              value={formData.assignedTo}
              onChange={handleInput}
            />
            <select
              name="severity"
              className="p-2 bg-slate-700 rounded"
              value={formData.severity}
              onChange={handleInput}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <textarea
              required
              name="description"
              className="md:col-span-3 p-2 bg-slate-700 rounded"
              placeholder="Bug description"
              value={formData.description}
              onChange={handleInput}
            />
            <select
              name="status"
              className="p-2 bg-slate-700 rounded"
              value={formData.status}
              onChange={handleInput}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              {loading
                ? "Submitting..."
                : editingId
                ? "Update Bug"
                : "Submit Bug"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="flex justify-between items-center mb-4">
          <div className="space-x-2">
            <label>Sort by:</label>
            <select
              className="p-2 bg-slate-700 rounded"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="severity">Severity</option>
              <option value="status">Status</option>
              <option value="createdAt">Created Date</option>
            </select>
            <select
              className="p-2 bg-slate-700 rounded"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 bg-slate-600 rounded"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-slate-600 rounded"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          {["all", "status", "severity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`px-4 py-2 rounded ${
                view === tab ? "bg-blue-700" : "bg-slate-700"
              }`}
            >
              {tab === "all"
                ? "All Bugs"
                : tab === "status"
                ? "Status Grouped"
                : "Severity Grouped"}
            </button>
          ))}
        </div>

        {view === "all" &&
          filteredBugs.map(renderBugCard)}

        {view === "status" &&
          Object.entries(groupedBy("status")).map(([s, group]) => (
            <div key={s} className="mb-6">
              <h2 className="text-xl font-bold mb-2">{s}</h2>
              {group
                .filter(
                  (b) =>
                    filterTags.length === 0 ||
                    (b.tags || []).some(isTagMatch)
                )
                .map(renderBugCard)}
            </div>
          ))}

        {view === "severity" &&
          Object.entries(groupedBy("severity")).map(([sev, group]) => (
            <div key={sev} className="mb-6">
              <h2 className="text-xl font-bold mb-2">{sev} Bugs</h2>
              {group
                .filter(
                  (b) =>
                    filterTags.length === 0 ||
                    (b.tags || []).some(isTagMatch)
                )
                .map(renderBugCard)}
            </div>
          ))}
      </div>
    </div>
  );
}
