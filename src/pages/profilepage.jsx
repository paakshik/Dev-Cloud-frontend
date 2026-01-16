import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "http://127.0.0.1:8000/api/v1";

export default function ProfilePage({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    ...user,
    avatarPreview: user?.avatar_url || "",
    avatarFile: null,
  });
  const [feedbackList, setFeedbackList] = useState([]);
  const [collaborationList, setCollaborationList] = useState([]);

  // ✅ Fetch feedbacks for the user
  useEffect(() => {
    if (!user?.id) return;

    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`${API_BASE}/feedbacks/${user.id}`);
        if (!res.ok) throw new Error("Failed to load feedbacks");
        const data = await res.json();
        setFeedbackList(data);
      } catch (err) {
        console.error("Feedback fetch failed:", err);
        setFeedbackList([]);
      }
    };

    fetchFeedbacks();
  }, [user]);

  // ✅ Fetch collaborations for the user
  useEffect(() => {
    if (!user?.id) return;

    const fetchCollaborations = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/${user.id}/collaborations`);
        if (!res.ok) throw new Error("Failed to load collaborations");
        const data = await res.json();
        setCollaborationList(data);
      } catch (err) {
        console.error("Collaboration fetch failed:", err);
        setCollaborationList([]);
      }
    };

    fetchCollaborations();
  }, [user]);
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const email = params.get("email");
  const avatar = params.get("avatar");

  if (name || email) {
    setProfile((prev) => ({
      ...prev,
      name: name || prev.name,
      email: email || prev.email,
      avatarPreview: avatar || prev.avatarPreview,
    }));
  }
}, []);

  // ✅ Save updated profile
  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profile.name || "");
      formData.append("title", profile.title || "");
      formData.append("skills", JSON.stringify(profile.skills || []));
      formData.append("linked_accounts", JSON.stringify(profile.linked_accounts || {}));

      if (profile.avatarFile) {
        formData.append("avatar", profile.avatarFile);
      }

      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error:", errorText);
        toast.error("❌ Couldn't update profile");
        return;
      }

      const updatedUser = await res.json();
      toast.success("✅ Profile updated successfully!");
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("❌ Connection failed");
    }
  };

  // ✅ Handle input field updates
  const handleInputChange = (key, value) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  // ✅ Avatar upload handler
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      avatarPreview: previewURL,
      avatarFile: file,
    }));
  };

  if (!user)
    return (
      <div className="text-gray-400 text-center py-10">
        Please log in to view your profile.
      </div>
    );

  return (
    <section className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-2xl border border-gray-700 shadow-lg">
      {/* ✅ Profile Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <img
            src={profile.avatarPreview || "/default-avatar.png"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-2 border-indigo-400 object-cover"
          />
          {isEditing && (
            <label
              htmlFor="avatarUpload"
              className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-full cursor-pointer shadow-md transition-all duration-200"
              title="Upload new avatar"
            >
              📷
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
          )}
        </div>

        <div>
          {isEditing ? (
            <>
              <input
                className="text-xl bg-gray-800 rounded p-2 text-gray-200 w-full"
                value={profile.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <input
                className="mt-2 bg-gray-800 rounded p-2 text-gray-200 w-full"
                placeholder="Title"
                value={profile.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold">{user.name}</h3>
              <p className="text-gray-400">{user.title || "No title added"}</p>
            </>
          )}
        </div>
      </div>

      {/* ✅ Skills Section */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-indigo-300">Skills</h4>
        {isEditing ? (
          <input
            className="w-full p-2 bg-gray-800 rounded text-gray-200"
            placeholder="e.g., React, Node.js, Python"
            value={(profile.skills || []).join(", ")}
            onChange={(e) =>
              handleInputChange(
                "skills",
                e.target.value.split(",").map((s) => s.trim())
              )
            }
          />
        ) : (
          <div className="flex flex-wrap gap-2">
            {(user.skills || []).length > 0 ? (
              user.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm rounded-full bg-gray-800 text-indigo-200"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-400">No skills listed.</p>
            )}
          </div>
        )}
      </div>

      {/* ✅ Linked Accounts */}
      <div className="mb-8">
        <h4 className="font-semibold mb-2 text-indigo-300">Linked Accounts</h4>
        {isEditing ? (
          ["linkedin", "github"].map((platform) => (
            <input
              key={platform}
              className="w-full p-2 bg-gray-800 rounded mb-2 text-gray-200"
              placeholder={platform.charAt(0).toUpperCase() + platform.slice(1)}
              value={profile.linked_accounts?.[platform] || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  linked_accounts: {
                    ...profile.linked_accounts,
                    [platform]: e.target.value,
                  },
                })
              }
            />
          ))
        ) : (
          <ul className="text-gray-300 space-y-1">
            {user.linked_accounts?.linkedin && (
              <li>🔗 LinkedIn: {user.linked_accounts.linkedin}</li>
            )}
            {user.linked_accounts?.github && (
              <li>💻 GitHub: {user.linked_accounts.github}</li>
            )}
            {!user.linked_accounts?.linkedin &&
              !user.linked_accounts?.github && (
                <p className="text-gray-500">No linked accounts added.</p>
              )}
          </ul>
        )}
      </div>

      {/* ✅ Action Buttons */}
      <div className="flex justify-end gap-3 mb-8">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-5 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-all"
            >
              Save
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-all"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* ✅ Feedback Section */}
      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-indigo-400 mb-3">
          Feedback Received
        </h3>
        {feedbackList.map((fb) => (
  <div
    key={fb.id}
    className="bg-gray-800 p-3 rounded-lg mb-3 border border-gray-700"
  >
    <p className="text-gray-200">{fb.comment}</p>

    {fb.endorsed_skill && (
      <p className="text-sm text-amber-400 mt-1">
        ⭐ Skill Endorsed: <span className="font-semibold">{fb.endorsed_skill}</span>
      </p>
    )}

    <p className="text-xs text-gray-500 text-right mt-2">
      — by {fb.author_name || fb.author_id}
    </p>
  </div>
))}

      </div>

      {/* ✅ Collaboration History */}
      <div className="border-t border-gray-700 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-indigo-400 mb-3">
          Collaboration History
        </h3>
        {collaborationList.length === 0 ? (
          <p className="text-gray-400">No collaborations yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {collaborationList.map((proj) => (
              <div
                key={proj.id}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:scale-[1.02] transition-all"
              >
                <h4 className="text-indigo-300 font-semibold">{proj.title}</h4>
                <p className="text-gray-300 mt-1">{proj.description}</p>
                <p className="text-gray-400 text-sm mt-2">
                  🎯 {proj.goal || "No goal specified"}
                </p>
                <p className="text-gray-500 text-sm italic mt-1">
                  💡 {proj.benifits || "No benefits specified"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
