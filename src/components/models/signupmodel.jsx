import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://127.0.0.1:8000/api/v1";

/**
 * SignupModal — Allows a new user to create an account.
 * @param {Function} onClose - Close modal handler.
 * @param {Function} onSignup - Callback when signup succeeds.
 */
export default function SignupModal({ onClose, onSignup }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "individual",
    title: "",
    password:"",
    skills: "",
    linkedin: "",
    codeforces: "",
    github: "",
  });

  const [loading, setLoading] = useState(false);

  /** 🧾 Handle form submission */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.warn("⚠️ Please enter your full name.");
      return;
    }

    const userId = `user_${Date.now()}`;
    const payload = {
      id: userId,
      name: formData.name.trim(),
      type: formData.type,
      title: formData.title.trim(),
      skills: formData.skills
        ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
        password: formData.password,
      linked_accounts: {
        linkedin: formData.linkedin.trim(),
        codeforces: formData.codeforces.trim(),
        github: formData.github.trim(),
      },
      avatar_url: `https://placehold.co/100x100/6366F1/FFFFFF?text=${formData.name
        .slice(0, 2)
        .toUpperCase()}`,
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Signup failed");
      }

      const data = await res.json();
      toast.success(`✅ Welcome, ${data.name}! You’re now logged in.`);
      onSignup(data); // Automatically set user and close modal
    } catch (err) {
      toast.error(`❌ ${err.message || "Could not complete signup."}`);
    } finally {
      setLoading(false);
    }
  };

  /** 🎨 Model UI */
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-2xl w-[90%] max-w-2xl border border-gray-700 shadow-2xl space-y-4 overflow-y-auto max-h-[90vh]"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-2xl font-semibold text-indigo-400 text-center">
          Create Account
        </h3>

        {/* 🧍‍♂️ Basic Info */}
        <input
          required
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          required
          type="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={(e) => setFormData((s) => ({ ...s, password: e.target.value }))}
          className="w-full p-3 bg-gray-800 rounded-lg text-gray-200"
        />
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, type: e.target.value }))
          }
          className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="individual">Individual</option>
          <option value="organization">Organization</option>
        </select>
        <input
          placeholder="Title or Role"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {/* 🛠 Skills & Links */}
        <input
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, skills: e.target.value }))
          }
          className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          placeholder="LinkedIn Profile URL"
          value={formData.linkedin}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, linkedin: e.target.value }))
          }
          className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          placeholder="Codeforces Profile URL"
          value={formData.codeforces}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, codeforces: e.target.value }))
          }
          className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          placeholder="GitHub Profile URL"
          value={formData.github}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, github: e.target.value }))
          }
          className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* 🎯 Buttons */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-900 hover:border-indigo-400 hover:text-indigo-300 transition-all duration-200 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
          
        </div>
      </motion.form>
    </motion.div>
  );
}
