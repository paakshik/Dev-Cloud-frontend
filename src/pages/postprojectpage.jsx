// all imports files and dependences
import React, { useState } from "react";
import { toast } from "react-toastify";
import { fetchJSON } from "../utils/api"; 

export default function PostProjectPage({ reload, user }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    goal: "",
    benefits: "",
    pay: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Handles field updates
  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return toast.warn("You must be logged in to post a project!");

    setSubmitting(true);

    const payload = {
      id: `proj_${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      owner_id: user.id,
      pay: form.pay.trim(),
      goal: form.goal.trim(),
      benefits: form.benefits.trim(),
    };

    try {
      const data = await fetchJSON("/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success("✅ Project posted successfully!");
      setForm({
        title: "",
        description: "",
        skills: "",
        goal: "",
        benefits: "",
        pay: "",
      });
      reload();
    } catch (err) {
      console.error("❌ Failed to post project:", err);
      toast.error(err.message || "Error posting project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="p-6 space-y-4 bg-gray-900 rounded-lg border border-gray-700"
    >
      <h2 className="text-xl font-semibold text-indigo-400">Post a Project</h2>

      <input
        type="text"
        placeholder="Project Title"
        value={form.title}
        onChange={(e) => handleChange("title", e.target.value)}
        className="w-full p-3 rounded bg-gray-800 text-gray-200"
        required
      />

      <textarea
        placeholder="Project Description"
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
        className="w-full p-3 rounded bg-gray-800 text-gray-200 min-h-[100px]"
        required
      />

      <textarea
        placeholder="Main goal or purpose of your project"
        value={form.goal}
        onChange={(e) => handleChange("goal", e.target.value)}
        className="w-full p-3 rounded bg-gray-800 text-gray-200"
      />

      <textarea
        placeholder="Describe benefits for collaborators"
        value={form.benefits}
        onChange={(e) => handleChange("benefits", e.target.value)}
        className="w-full p-3 rounded bg-gray-800 text-gray-200"
      />

      <input
        type="text"
        placeholder="Skills (comma separated)"
        value={form.skills}
        onChange={(e) => handleChange("skills", e.target.value)}
        className="w-full p-3 rounded bg-gray-800 text-gray-200"
      />

      <input
        type="text"
        placeholder="Compensation (e.g., ₹50,000 or $1000)"
        value={form.pay}
        onChange={(e) => handleChange("pay", e.target.value)}
        className="w-full p-3 rounded bg-gray-800 text-gray-200"
      />

      <button
        type="submit"
        disabled={submitting}
        className={`px-5 py-2 rounded-lg font-medium transition-all ${
          submitting
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500"
        }`}
      >
        {submitting ? "Posting..." : "Post Project"}
      </button>
    </form>
  );
}
