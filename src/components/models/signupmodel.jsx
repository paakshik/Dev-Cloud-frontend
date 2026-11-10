import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { apiUrl } from "../../utils/api.js";

const INITIAL_FORM = { name: "", type: "individual", title: "", password: "", skills: "", linkedin: "", codeforces: "", github: "" };

export default function SignupModal({ onClose, onSignup }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const update = (key, value) => setFormData((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim()) return toast.warn("Enter your name to continue.");
    const payload = {
      id: `user_${Date.now()}`, name: formData.name.trim(), type: formData.type,
      title: formData.title.trim(), skills: formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      password: formData.password,
      linked_accounts: { linkedin: formData.linkedin.trim(), codeforces: formData.codeforces.trim(), github: formData.github.trim() },
      avatar_url: `https://placehold.co/100x100/247a50/FFFFFF?text=${encodeURIComponent(formData.name.slice(0, 2).toUpperCase())}`,
    };
    try {
      setLoading(true);
      const response = await fetch(apiUrl("/api/v1/users"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || "Account creation failed.");
      }
      const user = await response.json();
      toast.success(`Welcome to DevCloud, ${user.name}.`);
      onSignup(user);
    } catch (error) { toast.error(error.message || "Could not create your account."); }
    finally { setLoading(false); }
  };

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onClose(); }}>
      <motion.form onSubmit={handleSubmit} className="modal-card max-w-xl" role="dialog" aria-modal="true" aria-labelledby="signup-heading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
        <div className="mb-5"><p className="page-kicker">Create your profile</p><h2 id="signup-heading" className="modal-title mt-2">Join the community</h2><p className="modal-copy mt-2">Tell people what you do and what you’d like to work on.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="modal-label">Full name<input required autoComplete="name" value={formData.name} onChange={(event) => update("name", event.target.value)} className="field-control mt-2" placeholder="Your name" /></label>
          <label className="modal-label">Password<input required minLength={8} autoComplete="new-password" type="password" value={formData.password} onChange={(event) => update("password", event.target.value)} className="field-control mt-2" placeholder="At least 8 characters" /></label>
          <label className="modal-label">Account type<select value={formData.type} onChange={(event) => update("type", event.target.value)} className="field-control mt-2"><option value="individual">Individual</option><option value="organization">Organization</option></select></label>
          <label className="modal-label">Role or title<input value={formData.title} onChange={(event) => update("title", event.target.value)} className="field-control mt-2" placeholder="Designer, developer…" /></label>
          <label className="modal-label sm:col-span-2">Skills<input value={formData.skills} onChange={(event) => update("skills", event.target.value)} className="field-control mt-2" placeholder="React, research, product design" /></label>
          <label className="modal-label">GitHub<input value={formData.github} onChange={(event) => update("github", event.target.value)} className="field-control mt-2" placeholder="Profile URL" /></label>
          <label className="modal-label">LinkedIn<input value={formData.linkedin} onChange={(event) => update("linkedin", event.target.value)} className="field-control mt-2" placeholder="Profile URL" /></label>
        </div>
        <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row"><button type="button" onClick={onClose} disabled={loading} className="secondary-button">Cancel</button><button type="submit" disabled={loading} className="primary-button">{loading ? "Creating account…" : "Create account"}</button></div>
      </motion.form>
    </motion.div>
  );
}
