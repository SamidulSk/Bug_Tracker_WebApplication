// components/Landing.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <motion.h1
        className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🐞 Bug Tracker 
      </motion.h1>

      <motion.p
        className="text-xl md:text-2xl text-gray-400 mb-10 max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Track, manage, and squash bugs efficiently with AI tagging & modern dashboards.
      </motion.p>

      <motion.div
        className="flex space-x-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Link
          to="/signup"
          className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl text-lg font-medium transition-all duration-300 shadow-md hover:shadow-purple-500/40"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="border border-gray-300 px-8 py-3 rounded-xl text-lg font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-md"
        >
          Login
        </Link>
      </motion.div>
    </div>
  );
}
