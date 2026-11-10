import React, { useState } from "react";
import { toast } from "react-toastify";
import { fetchJSON } from "../utils/api";

const INITIAL_FORM = { title: "", description: "", skills: "", goal: "", benefits: "", pay: "" };

export default function PostProjectPage({ reload, user }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (key, value) => {
    setSubmitted(false);
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!user) return toast.warn("Log in before posting a project.");
    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      owner_id: user.id,
      pay: form.pay.trim(),
      goal: form.goal.trim(),
      benefits: form.benefits.trim(),
    };
    try {
      await fetchJSON("/projects", { method: "POST", body: JSON.stringify(payload) });
      await reload();
      setForm(INITIAL_FORM);
      setSubmitted(true);
      toast.success("Project posted successfully.");
    } catch (error) {
      console.error("Failed to post project:", error);
      toast.error(error.message || "Could not post this project.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="surface-card mx-auto max-w-2xl space-y-5 p-5 shadow-sm sm:p-8" aria-labelledby="post-project-heading">
      <div><p className="page-kicker">Share your idea</p><h1 id="post-project-heading" className="mt-2 text-2xl font-semibold text-gray-100">Post a project</h1><p className="mt-2 text-sm text-gray-400">Add enough detail for potential collaborators to see if it’s a fit.</p></div>
      {submitted && <p role="status" className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">Your project was posted. You can submit another one below.</p>}
      <label className="block text-sm font-medium text-gray-300">Project title<input type="text" aria-label="Project title" maxLength={250} placeholder="Project Title" value={form.title} onChange={(event) => handleChange("title", event.target.value)} className="field-control mt-2" required /></label>
      <label className="block text-sm font-medium text-gray-300">Description<textarea aria-label="Project description" maxLength={5000} placeholder="Project Description" value={form.description} onChange={(event) => handleChange("description", event.target.value)} className="field-control mt-2 min-h-32" required /></label>
      <label className="block text-sm font-medium text-gray-300">Goal<textarea aria-label="Project goal" maxLength={2000} placeholder="Main goal or purpose of your project" value={form.goal} onChange={(event) => handleChange("goal", event.target.value)} className="field-control mt-2" /></label>
      <label className="block text-sm font-medium text-gray-300">Benefits for collaborators<textarea aria-label="Benefits for collaborators" maxLength={2000} placeholder="What will collaborators learn or gain?" value={form.benefits} onChange={(event) => handleChange("benefits", event.target.value)} className="mt-2 w-full rounded-xl bg-gray-800 p-3 text-gray-100 placeholder-gray-500" /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-gray-300">Skills needed<input type="text" aria-label="Required skills, comma separated" placeholder="Skills (comma separated)" value={form.skills} onChange={(event) => handleChange("skills", event.target.value)} className="mt-2 w-full rounded-xl bg-gray-800 p-3 text-gray-100 placeholder-gray-500" /></label>
        <label className="block text-sm font-medium text-gray-300">Compensation<input type="text" aria-label="Compensation" placeholder="Compensation (e.g., ₹50,000 or $1000)" value={form.pay} onChange={(event) => handleChange("pay", event.target.value)} className="mt-2 w-full rounded-xl bg-gray-800 p-3 text-gray-100 placeholder-gray-500" /></label>
      </div>
      <div className="flex justify-end border-t border-gray-700 pt-4"><button type="submit" disabled={submitting} className="primary-button min-w-36">{submitting ? <span className="inline-flex items-center gap-2"><span className="loader-spinner h-4 w-4 border-2" />Posting…</span> : "Post Project"}</button></div>
    </form>
  );
}
