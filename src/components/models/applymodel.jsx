import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { apiUrl } from "../../utils/api.js";

export default function ApplyModal({ project, onClose, user, loadMessages }) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return toast.warn("Log in before applying.");
    if (!project?.owner_id) return toast.error("Project owner is unavailable.");
    if (!message.trim()) return toast.info("Add a short introduction first.");
    try {
      setIsSubmitting(true);
      const response = await fetch(apiUrl("/api/v1/messages"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `msg_${Date.now()}`,
          sender_id: user.id,
          receiver_id: project.owner_id,
          content: `Application for "${project.title}": ${message.trim()}`,
          timestamp: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || "Application could not be sent.");
      }
      if (typeof loadMessages === "function") await loadMessages();
      toast.success("Application sent.");
      onClose();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose(); }}>
      <motion.form onSubmit={handleSubmit} className="modal-card max-w-lg" role="dialog" aria-modal="true" aria-labelledby="apply-heading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
        <p className="page-kicker">Project application</p>
        <h2 id="apply-heading" className="modal-title mt-2">Introduce yourself</h2>
        <p className="modal-copy mt-2">Applying to <strong className="text-gray-200">{project?.title || "this project"}</strong>. Tell the project owner what you’d bring to the team.</p>
        <label className="modal-label mt-5">Your message<textarea required maxLength={1500} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Share your experience, interest, or how you can contribute…" className="field-control mt-2 min-h-36 resize-y" disabled={isSubmitting} /></label>
        <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row"><button type="button" onClick={onClose} disabled={isSubmitting} className="secondary-button">Cancel</button><button type="submit" disabled={isSubmitting} className="primary-button">{isSubmitting ? "Sending…" : "Send application"}</button></div>
      </motion.form>
    </motion.div>
  );
}
