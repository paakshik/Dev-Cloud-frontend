import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://127.0.0.1:8000/api/v1";

/**
 * LoginModal — Allows a user to log in using their User ID.
 *
 * Props:
 * @param {Function} onClose - Function to close the modal.
 * @param {Function} onLogin - Callback when login is successful.
 */
export default function LoginModal({ onClose, onLogin }) {
  const [userId, setUserId] = useState({
    username: "",
  password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();

  if (!userId.username.trim() || !userId.password.trim()) {
    toast.warn("⚠️ Enter both username and password!");
    return;
  }

  try {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("username", userId.username);
    formData.append("password", userId.password);

    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      toast.error("❌ Invalid username or password");
      return;
    }

    const data = await res.json();
    toast.success(`✅ Welcome back, ${data.name}!`);
    onLogin(data);
    onClose();
  } catch (err) {
    toast.error("❌ Couldn't connect to backend");
  } finally {
    setIsLoading(false);
  }
};


  // 🧭 UI
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
    >
      <motion.form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-2xl w-[90%] max-w-md border border-gray-700 shadow-2xl space-y-5"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        {/* 🧾 Header */}
        <h3 className="text-2xl font-semibold text-indigo-400 text-center">
          Login
        </h3>

        {/* 🧍 User ID Input */}
        <input
  type="text"
  placeholder="Enter Username"
  value={userId.username}
  onChange={(e) => setUserId({ ...userId, username: e.target.value })}
  className="w-full p-3 bg-gray-800 rounded-lg text-gray-200"
/>

<input
  type="password"
  placeholder="Enter Password"
  value={userId.password}
  onChange={(e) => setUserId({ ...userId, password: e.target.value })}
  className="w-full p-3 bg-gray-800 rounded-lg text-gray-200"
/>
<div className="flex flex-col gap-3 mt-4">
  <button
    type="button"
    onClick={() => window.location.href = "http://localhost:8000/auth/github"}
    className="px-4 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-700 transition"
  >
    🐙 Continue with GitHub
  </button>

  <button
    type="button"
    onClick={() => window.location.href = "http://localhost:8000/auth/google"}
    className="px-4 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-700 transition"
  >
    🔵 Continue with Google
  </button>
</div>


        {/* 🎯 Buttons */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
