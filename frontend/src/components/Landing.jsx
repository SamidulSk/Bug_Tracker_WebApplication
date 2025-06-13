// components/Landing.jsx
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-bold mb-4">📝 Welcome to TaskMate</h1>
      <p className="text-lg text-slate-300 mb-8">Your smart assistant for daily tasks, priorities & AI summaries.</p>
      <div className="space-x-4">
        <Link to="/signup" className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 transition">Get Started</Link>
        <Link to="/login" className="border border-white px-6 py-3 rounded hover:bg-white hover:text-black transition">Login</Link>
      </div>
    </div>
  );
}
