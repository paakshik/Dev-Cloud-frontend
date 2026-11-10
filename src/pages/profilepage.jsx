import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/loader.jsx";
import { apiUrl } from "../utils/api.js";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ ...user, avatarPreview: user?.avatar_url || "", avatarFile: null });
  const [feedbackList, setFeedbackList] = useState([]);
  const [collaborationList, setCollaborationList] = useState([]);
  const [profileLoading, setProfileLoading] = useState(Boolean(user?.id));
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (!user?.id) {
      setProfileLoading(false);
      return undefined;
    }
    let active = true;
    setProfileLoading(true);
    setProfileError("");
    Promise.all([
      fetch(apiUrl(`/api/v1/feedbacks/${encodeURIComponent(user.id)}`)).then((response) => {
        if (!response.ok) throw new Error("Failed to load feedback");
        return response.json();
      }),
      fetch(apiUrl(`/api/v1/users/${encodeURIComponent(user.id)}/collaborations`)).then((response) => {
        if (!response.ok) throw new Error("Failed to load collaborations");
        return response.json();
      }),
    ]).then(([feedback, collaborations]) => {
      if (!active) return;
      setFeedbackList(feedback);
      setCollaborationList(collaborations);
    }).catch((error) => {
      console.error("Profile data fetch failed:", error);
      if (active) setProfileError("Some profile information could not be loaded.");
    }).finally(() => {
      if (active) setProfileLoading(false);
    });
    return () => { active = false; };
  }, [user?.id]);

  useEffect(() => {
    setProfile((current) => ({ ...current, ...user, avatarPreview: user?.avatar_url || current.avatarPreview, avatarFile: null }));
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const email = params.get("email");
    const avatar = params.get("avatar");
    if (name || email || avatar) {
      setProfile((current) => ({ ...current, name: name || current.name, email: email || current.email, avatarPreview: avatar || current.avatarPreview }));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profile.name || "");
      formData.append("title", profile.title || "");
      formData.append("skills", JSON.stringify(profile.skills || []));
      formData.append("linked_accounts", JSON.stringify(profile.linked_accounts || {}));
      if (profile.avatarFile) formData.append("avatar", profile.avatarFile);

      const response = await fetch(apiUrl(`/api/v1/users/${encodeURIComponent(user.id)}`), { method: "PUT", body: formData });
      if (!response.ok) throw new Error(await response.text());
      const updatedUser = await response.json();
      setUser(updatedUser);
      setProfile((current) => ({ ...current, ...updatedUser, avatarPreview: updatedUser.avatar_url || current.avatarPreview, avatarFile: null }));
      setIsEditing(false);
      toast.success("Profile updated.");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Could not save your profile. Check your connection and try again.");
    }
  };

  const handleInputChange = (key, value) => setProfile((current) => ({ ...current, [key]: value }));
  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Choose an image smaller than 5 MB.");
      event.target.value = "";
      return;
    }
    setProfile((current) => ({ ...current, avatarPreview: URL.createObjectURL(file), avatarFile: file }));
  };

  if (profileLoading) return <Loader fullScreen label="Loading your profile" />;
  if (!user) return <div className="py-10 text-center text-gray-400">Please log in to view your profile.</div>;

  return (
    <section className="surface-card mx-auto max-w-3xl p-5 sm:p-8" aria-labelledby="profile-heading">
      {profileError && <p role="alert" className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">{profileError}</p>}
      <div className="mb-8 flex flex-wrap items-center gap-5">
        <div className="relative">
          <img src={profile.avatarPreview || "/default-avatar.png"} alt={`${profile.name || "User"} avatar`} className="h-24 w-24 rounded-full border border-gray-700 object-cover" />
          {isEditing && <label htmlFor="avatarUpload" className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-indigo-600 p-2 text-white" title="Upload avatar">📷<input id="avatarUpload" type="file" accept="image/*" className="sr-only" onChange={handleAvatarUpload} /></label>}
        </div>
        <div className="min-w-0 flex-1">
          {isEditing ? <>
            <label className="sr-only" htmlFor="profile-name">Full name</label>
            <input id="profile-name" className="field-control text-xl" value={profile.name || ""} onChange={(event) => handleInputChange("name", event.target.value)} />
            <label className="sr-only" htmlFor="profile-title">Title</label>
            <input id="profile-title" className="field-control mt-2" placeholder="Title" value={profile.title || ""} onChange={(event) => handleInputChange("title", event.target.value)} />
          </> : <>
            <h1 id="profile-heading" className="text-2xl font-semibold">{user.name}</h1>
            <p className="text-gray-400">{user.title || "No title added"}</p>
          </>}
        </div>
        {!isEditing && <button type="button" onClick={() => setIsEditing(true)} className="secondary-button">Edit profile</button>}
      </div>

      <div className="mb-6">
        <h2 className="mb-3 font-semibold text-indigo-300">Skills</h2>
        {isEditing ? <input aria-label="Skills, comma separated" className="field-control" placeholder="React, design, Python" value={(profile.skills || []).join(", ")} onChange={(event) => handleInputChange("skills", event.target.value.split(",").map((skill) => skill.trim()).filter(Boolean))} /> : <div className="flex flex-wrap gap-2">{(user.skills || []).length ? user.skills.map((skill) => <span key={skill} className="rounded-full bg-gray-800 px-3 py-1 text-sm text-indigo-200">{skill}</span>) : <p className="text-gray-400">No skills listed.</p>}</div>}
      </div>

      {isEditing && <div className="mb-6">
        <h2 className="mb-3 font-semibold text-indigo-300">Links</h2>
        {[["linkedin", "LinkedIn"], ["github", "GitHub"], ["codeforces", "Codeforces"]].map(([key, label]) => <label key={key} className="mb-3 block text-sm text-gray-400">{label}<input className="field-control mt-1" value={profile.linked_accounts?.[key] || ""} onChange={(event) => handleInputChange("linked_accounts", { ...profile.linked_accounts, [key]: event.target.value })} /></label>)}
      </div>}

      <div className="mb-6">
        <h2 className="mb-3 font-semibold text-indigo-300">Collaborations</h2>
        {collaborationList.length ? <div className="grid gap-3 sm:grid-cols-2">{collaborationList.map((project) => <article key={project.id} className="surface-subtle p-4"><h3 className="font-semibold">{project.title}</h3><p className="mt-1 text-sm text-gray-400">{project.description}</p></article>)}</div> : <p className="text-sm text-gray-400">No collaborations yet.</p>}
      </div>

      <div className="mb-6">
        <h2 className="mb-3 font-semibold text-indigo-300">Feedback</h2>
        {feedbackList.length ? <div className="space-y-3">{feedbackList.map((feedback) => <article key={feedback.id} className="surface-subtle p-4"><p>{feedback.comment}</p>{feedback.endorsed_skill && <span className="mt-2 inline-block rounded-full bg-gray-700 px-2 py-1 text-xs text-indigo-200">{feedback.endorsed_skill}</span>}</article>)}</div> : <p className="text-sm text-gray-400">No feedback yet.</p>}
      </div>

      {isEditing && <div className="flex justify-end gap-3 border-t border-gray-700 pt-5">
        <button type="button" onClick={() => { setProfile({ ...user, avatarPreview: user.avatar_url || "", avatarFile: null }); setIsEditing(false); }} className="secondary-button">Cancel</button>
        <button type="button" onClick={handleSaveProfile} className="primary-button">Save profile</button>
      </div>}
    </section>
  );
}
