import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://127.0.0.1:8000/api/v1";

/**
 * ChatModal — Handles live chat between two collaborators.
 *
 * Props:
 * @param {Object} chat - The active chat data.
 * @param {Function} onClose - Function to close the modal.
 * @param {Object} user - Logged-in user details.
 * @param {Array} messages - All messages in the app.
 * @param {Function} reload - Function to refresh message data.
 * @param {Function} onViewProfile - Function to view other user’s profile.
 * @param {Function} getUserName - Utility to get a username from ID.
 */
export default function ChatModal({
  chat,
  onClose,
  user,
  messages,
  reload,
  onViewProfile,
  getUserName,
}) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  /** 📨 Sends a new message */
  const handleSend = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!message.trim() || isSending) return;

    const receiverId =
      chat.sender_id === user.id ? chat.receiver_id : chat.sender_id;

    const payload = {
      id: `msg_${Date.now()}`,
      sender_id: String(user.id),
      receiver_id: String(receiverId),
      content: message.trim(),
      timestamp: new Date().toISOString(),
      status: "chat",
    };

    try {
      setIsSending(true);
      const res = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Message not sent");
      }

      setMessage("");
      await reload();
    } catch (err) {
      toast.error(`❌ ${err.message || "Failed to send message"}`);
    } finally {
      setIsSending(false);
    }
  };

  /** 👤 Opens the chat partner’s profile */
  const handleViewProfile = async () => {
    const targetId =
      chat.sender_id === user.id ? chat.receiver_id : chat.sender_id;

    try {
      const res = await fetch(`${API_BASE}/users/${targetId}`);
      if (!res.ok) throw new Error("User not found");

      const profile = await res.json();
      onViewProfile(profile);
    } catch {
      toast.error("⚠️ Could not load user profile.");
    }
  };

  /** 💬 Filters chat messages for this conversation */
  const chatMessages = messages.filter(
    (m) =>
      (m.sender_id === chat.sender_id && m.receiver_id === chat.receiver_id) ||
      (m.sender_id === chat.receiver_id && m.receiver_id === chat.sender_id)
  );

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      {/* 🔹 Header */}
      <div className="flex justify-between items-center bg-[#202C33] text-white px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg"
          >
            ←
          </button>
          <span className="font-semibold">
            Chat with{" "}
            {getUserName(
              chat.sender_id === user.id ? chat.receiver_id : chat.sender_id
            )}
          </span>
        </div>
        <button
          onClick={handleViewProfile}
          className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md transition-all"
        >
          View Profile
        </button>
      </div>

      {/* 🔹 Message List */}
      <div
        id="chat-messages"
        className="flex-1 overflow-y-auto p-4 bg-[#ECE5DD] flex flex-col"
      >
        {chatMessages.length === 0 ? (
          <p className="text-gray-500 text-center mt-10 italic">
            No messages yet — start the conversation 💬
          </p>
        ) : (
          chatMessages.map((m, i) => {
            const isMine = m.sender_id === user.id;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`mb-2 flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[70%] shadow ${
                    isMine
                      ? "bg-[#DCF8C6] text-gray-800 rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  <div className="text-sm break-words">
                    {m.content || m.text}
                  </div>
                  <div className="text-[10px] text-gray-500 text-right mt-1">
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 🔹 Input Area */}
      <form
        onSubmit={handleSend}
        className="flex items-center bg-[#F0F2F5] px-3 py-2 border-t border-gray-300"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-white border-none rounded-full px-4 py-2 text-sm outline-none text-black"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending}
          className="ml-2 bg-[#25D366] hover:bg-[#20b858] text-white w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-transform transform hover:scale-105 disabled:opacity-50"
        >
          ➤
        </button>
      </form>
    </motion.div>
  );
}
