import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { apiUrl } from "../../utils/api.js";

export default function ProfileModal({ profile, user, onClose }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [newFeedbackText, setNewFeedbackText] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  useEffect(() => {
    if (!profile?.id) return undefined;
    let active = true;
    fetch(apiUrl(`/api/v1/feedbacks/${encodeURIComponent(profile.id)}`)).then((response) => {
      if (!response.ok) throw new Error("Could not load feedback");
      return response.json();
    }).then((data) => { if (active) setFeedbackList(data); }).catch(() => { if (active) setFeedbackList([]); });
    return () => { active = false; };
  }, [profile?.id]);

  const refreshFeedback = async () => {
    const response = await fetch(apiUrl(`/api/v1/feedbacks/${encodeURIComponent(profile.id)}`));
    if (!response.ok) throw new Error("Could not refresh feedback");
    setFeedbackList(await response.json());
  };

  const submitFeedback = async (event) => {
    event.preventDefault();
    if (!newFeedbackText.trim()) return toast.warn("Write a note before submitting.");
    try {
      const response = await fetch(apiUrl("/api/v1/feedbacks"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: profile.id, author_id: user.id, comment: newFeedbackText.trim(), endorsed_skill: selectedSkill || null }) });
      if (!response.ok) throw new Error("Could not submit feedback");
      await refreshFeedback();
      setNewFeedbackText("");
      setSelectedSkill("");
      toast.success("Feedback added.");
    } catch { toast.error("Could not submit feedback. Try again."); }
  };

  const saveEdit = async (feedback) => {
    try {
      const response = await fetch(apiUrl(`/api/v1/feedbacks/${feedback.id}`), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...feedback, comment: editText.trim() }) });
      if (!response.ok) throw new Error("Could not update feedback");
      setFeedbackList((previous) => previous.map((item) => item.id === feedback.id ? { ...item, comment: editText.trim() } : item));
      setIsEditing(null);
      toast.success("Feedback updated.");
    } catch { toast.error("Could not update feedback."); }
  };

  const deleteFeedback = async (id) => {
    try {
      const response = await fetch(apiUrl(`/api/v1/feedbacks/${id}`), { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete feedback");
      setFeedbackList((previous) => previous.filter((item) => item.id !== id));
      toast.success("Feedback removed.");
    } catch { toast.error("Could not remove feedback."); }
  };

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="modal-card relative max-w-lg" role="dialog" aria-modal="true" aria-labelledby="profile-modal-heading">
      <button type="button" onClick={onClose} className="icon-button absolute right-4 top-4" aria-label="Close profile"><X size={18} /></button>
      <div className="flex items-center gap-4 pr-10"><img src={profile.avatar_url || "/default-avatar.png"} alt="" className="h-16 w-16 rounded-full border border-gray-700 object-cover" /><div className="min-w-0"><h2 id="profile-modal-heading" className="modal-title">{profile.name}</h2><p className="mt-1 text-sm text-gray-400">{profile.title || "Community member"}</p></div></div>
      <div className="mt-5"><h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Skills</h3><div className="mt-2 flex flex-wrap gap-2">{profile.skills?.length ? profile.skills.map((skill) => <span key={skill} className="project-skill">{skill}</span>) : <span className="text-sm text-gray-500">No skills listed.</span>}</div></div>
      {profile.linked_accounts && <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">{[["LinkedIn", profile.linked_accounts.linkedin], ["GitHub", profile.linked_accounts.github], ["Codeforces", profile.linked_accounts.codeforces]].filter(([, url]) => url).map(([label, url]) => <a key={label} href={url.startsWith("http") ? url : `https://${url}`} target="_blank" rel="noreferrer" className="font-medium text-indigo-400 hover:underline">{label}</a>)}</div>}
      <div className="mt-6 border-t border-gray-700 pt-5"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold text-gray-100">Feedback</h3><span className="text-xs text-gray-500">{feedbackList.length}</span></div>
        {feedbackList.length === 0 ? <p className="py-3 text-sm text-gray-500">No feedback yet.</p> : <div className="max-h-52 space-y-2 overflow-y-auto">{feedbackList.map((feedback) => <article key={feedback.id} className="surface-subtle p-3">{isEditing === feedback.id ? <><textarea aria-label="Edit feedback" value={editText} onChange={(event) => setEditText(event.target.value)} className="field-control min-h-20" /><div className="mt-2 flex gap-2"><button type="button" onClick={() => saveEdit(feedback)} className="primary-button !min-h-8 !px-3 !text-xs">Save</button><button type="button" onClick={() => setIsEditing(null)} className="secondary-button !min-h-8 !px-3 !text-xs">Cancel</button></div></> : <><p className="text-sm text-gray-200">{feedback.comment}</p>{feedback.endorsed_skill && <span className="mt-2 inline-block text-xs text-indigo-400">Endorsed · {feedback.endorsed_skill}</span>}<div className="mt-2 flex items-center justify-between"><span className="text-xs text-gray-500">{feedback.author_id}</span>{feedback.author_id === user?.id && <span className="flex gap-3"><button type="button" onClick={() => { setIsEditing(feedback.id); setEditText(feedback.comment); }} className="text-xs text-gray-400 hover:text-gray-100">Edit</button><button type="button" onClick={() => deleteFeedback(feedback.id)} className="text-xs text-red-400">Delete</button></span>}</div></>}</article>)}</div>}
        {user && user.id !== profile.id && <form onSubmit={submitFeedback} className="mt-4 space-y-2"><label className="sr-only" htmlFor="endorse-skill">Optional skill endorsement</label><select id="endorse-skill" value={selectedSkill} onChange={(event) => setSelectedSkill(event.target.value)} className="field-control"><option value="">Endorse a skill (optional)</option>{profile.skills?.map((skill) => <option key={skill} value={skill}>{skill}</option>)}</select><label className="sr-only" htmlFor="feedback-text">Write feedback</label><textarea id="feedback-text" value={newFeedbackText} onChange={(event) => setNewFeedbackText(event.target.value)} placeholder="Share a thoughtful note…" className="field-control min-h-20" /><button type="submit" className="primary-button">Add feedback</button></form>}
      </div>
    </section>
  </div>;
}
