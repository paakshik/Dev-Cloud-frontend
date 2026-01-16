import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const API_BASE = "http://127.0.0.1:8000/api/v1";

/**
 * ApplyModal — Handles applying to a project via a short message.
 *
 * Props:
 * @param {Object} project - Project details.
 * @param {Function} onClose - Closes the modal.
 * @param {Object} user - Logged-in user object.
 * @param {Function} loadMessages - Reloads messages after submission.
 */
export default function ApplyModal({ project, onClose, user, loadMessages }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** 📨 Submits the application to the backend */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return toast.warn("⚠️ Please log in before applying.");
    if (!project) return toast.error("❌ Project not found.");
    if (!project.owner_id)
      return toast.error("⚠️ Project owner not found. Please try again later.");
    if (!message.trim())
      return toast.info("✍️ Please write a short message before applying.");

    const payload = {
      id: `msg_${Date.now()}`,
      sender_id: user.id,
      receiver_id: project.owner_id,
      content: `Application for "${project.title}": ${message.trim()}`,
      timestamp: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);

      const res = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to send application.");
      }

      // ✅ Refresh chat data
      if (typeof loadMessages === "function") await loadMessages();

      toast.success("✅ Application sent successfully!");
      onClose();
    } catch (err) {
      toast.error(`❌ ${err.message || "Something went wrong."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-xl w-[90%] max-w-lg border border-gray-700 shadow-2xl space-y-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        {/* 🧾 Header */}
        <h3 className="text-xl font-semibold text-indigo-400 text-center">
          Apply to “{project?.title || "Project"}”
        </h3>

        {/* ✍️ Message box */}
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a short introduction or message for the project owner..."
          className="w-full p-3 bg-gray-800 rounded-lg text-gray-200 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isSubmitting}
        />

        {/* 🎯 Buttons */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
