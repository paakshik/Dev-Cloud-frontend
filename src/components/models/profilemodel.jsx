import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://127.0.0.1:8000/api/v1";

/**
 * ProfileModal — Displays a user's profile with feedback system.
 * @param {Object} profile - The viewed user's profile.
 * @param {Object} user - The logged-in user.
 * @param {Function} onClose - Function to close the modal.
 */
export default function ProfileModal({ profile, user, onClose }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [newFeedbackText, setNewFeedbackText] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");


  /** 🔄 Load feedback when profile opens */
  useEffect(() => {
    if (!profile?.id) return;
    const loadFeedback = async () => {
      try {
        const res = await fetch(`${API_BASE}/feedbacks/${profile.id}`);
        if (!res.ok) throw new Error("Failed to load feedback");
        const data = await res.json();
        setFeedbackList(data);
      } catch {
        setFeedbackList([]);
      }
    };
    loadFeedback();
  }, [profile]);

  /** ➕ Submit new feedback */
  const submitFeedback = async () => {
    if (!newFeedbackText.trim()) return toast.warn("✍️ Please enter feedback!");

    try {
      const res = await fetch(`${API_BASE}/feedbacks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: profile.id, // The profile being viewed
          author_id: user.id, // The logged-in user
          comment: newFeedbackText.trim(),
           endorsed_skill: selectedSkill || null
        }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");

      const refreshed = await fetch(`${API_BASE}/feedbacks/${profile.id}`).then(
        (r) => r.json()
      );
      setFeedbackList(refreshed);
      setNewFeedbackText("");
      toast.success("✅ Feedback submitted!");
    } catch {
      toast.error("❌ Failed to submit feedback. Try again later.");
    }
  };

  /** ✏️ Start editing feedback */
  const startEdit = (id, text) => {
    setIsEditing(id);
    setEditText(text);
  };

  /** 💾 Save edited feedback */
  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/feedbacks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          user_id: profile.id,
          author_id: user.id,
          comment: editText.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to update feedback");

      const updated = await res.json();
      setFeedbackList((prev) =>
        prev.map((fb) => (fb.id === id ? updated : fb))
      );
      setIsEditing(null);
      toast.success("✅ Feedback updated!");
    } catch {
      toast.error("❌ Could not update feedback.");
    }
  };

  /** 🗑 Delete feedback */
  const deleteFeedback = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/feedbacks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete feedback");

      setFeedbackList((prev) => prev.filter((fb) => fb.id !== id));
      toast.success("🗑 Feedback deleted.");
    } catch {
      toast.error("❌ Could not delete feedback.");
    }
  };

  /** 🧭 UI */
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 p-8 rounded-2xl w-[90%] max-w-lg border border-gray-700 shadow-2xl relative overflow-y-auto max-h-[90vh]">
        {/* ✖ Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✖
        </button>

        {/* 👤 Profile Info */}
        <div className="text-center">
          <img
            src={profile.avatar_url}
            alt="avatar"
            className="w-24 h-24 mx-auto rounded-full border-2 border-indigo-500"
          />
          <h2 className="text-2xl font-semibold mt-3 text-indigo-400">
            {profile.name}
          </h2>
          <p className="text-gray-400">{profile.title || "No title set"}</p>

          {/* 🛠 Skills */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-300">Skills</h3>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {profile.skills?.length ? (
                profile.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-gray-800 text-indigo-200 rounded-full"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No skills listed</p>
              )}
            </div>
          </div>

          {/* 🔗 Linked Accounts */}
          {profile.linked_accounts && (
            <div className="mt-5 text-gray-300 text-sm space-y-1">
              {profile.linked_accounts.linkedin && (
                <div>
                  🔗 LinkedIn:{" "}
                  <a
                    href={profile.linked_accounts.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    {profile.linked_accounts.linkedin}
                  </a>
                </div>
              )}
              {profile.linked_accounts.github && (
                <div>
                  💻 GitHub:{" "}
                  <a
                    href={profile.linked_accounts.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    {profile.linked_accounts.github}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🗣️ Feedback Section */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-left">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">
            Feedback
          </h3>

          {feedbackList.length === 0 ? (
            <p className="text-gray-400">No feedback yet.</p>
          ) : (
            feedbackList.map((fb) => (
              <div key={fb.id} className="bg-gray-800 p-3 rounded-lg mb-2">
                {isEditing === fb.id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-gray-200"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => saveEdit(fb.id)}
                        className="px-4 py-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-lg hover:scale-105 transition-transform"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(null)}
                        className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-200">{fb.comment}</p>
{fb.endorsed_skill && (
  <p className="text-sm text-indigo-400 mt-1">
    ⭐ Endorsed Skill: {fb.endorsed_skill}
  </p>
)}

                    <p className="text-xs text-gray-500 text-right">
                      — by {fb.author_id}
                    </p>
                    {fb.author_id === user.id && (
                      <div className="flex gap-3 mt-1 text-xs">
                        <button
                          onClick={() => startEdit(fb.id, fb.comment)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteFeedback(fb.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}

          {/* ➕ Add new feedback */}
          {user && user.id !== profile.id && (
            <div className="mt-4">
              <select
  value={selectedSkill}
  onChange={(e) => setSelectedSkill(e.target.value)}
  className="w-full mb-2 bg-gray-900 border border-gray-700 rounded-lg p-2 text-gray-200"
>
  <option value="">Select a skill to endorse (optional)</option>
  {profile.skills?.map((skill, i) => (
    <option key={i} value={skill}>
      {skill}
    </option>
  ))}
</select>

<textarea
  value={newFeedbackText}
  onChange={(e) => setNewFeedbackText(e.target.value)}
  placeholder="Write your feedback..."
  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-gray-200"
/>

              <button
                onClick={submitFeedback}
                className="mt-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-md shadow-indigo-900/40 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-pink-700/40"
              >
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
