import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RefreshButton from "../components/refreshbutton.jsx";
import ApplyModal from "../components/models/applymodel.jsx";

/**
 * ProjectsPage — Displays all projects, allows filtering, and lets users apply.
 * @param {Array} projects - List of all project objects.
 * @param {Function} reload - Function to reload project data.
 * @param {Object} user - Currently logged-in user.
 * @param {Function} loadMessages - Function to reload user messages.
 * @param {Array} messages - All messages related to applications/collaboration.
 */
export default function ProjectsPage({ projects, reload, user, loadMessages, messages }) {
  const [showApply, setShowApply] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  /** 🔍 Filter projects efficiently using useMemo to avoid re-computation on every render */
  const filteredProjects = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return projects.filter(
      (p) =>
        p.title?.toLowerCase().includes(term) ||
        p.organization?.toLowerCase().includes(term) ||
        p.goal?.toLowerCase().includes(term) ||
        p.benifits?.toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  /** 📨 Determine current user's relationship with a project */
  const getApplicationStatus = (p) => {
    const priorMsg = messages
      ?.filter(
        (m) =>
          (m.project_id === p.id || m.content?.includes(p.title)) &&
          ((m.sender_id === user?.id && m.receiver_id === p.owner_id) ||
            (m.receiver_id === user?.id && m.sender_id === p.owner_id))
      )
      ?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    return priorMsg?.status || null;
  };

  /** 🔁 Reload projects safely with refresh indicator */
  const handleRefresh = async () => {
    setRefreshing(true);
    await reload();
    setTimeout(() => setRefreshing(false), 600);
  };

  return (
    <section className="min-h-screen">
      {/* 🔍 Header: Search + Refresh */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">Projects</h2>
          <RefreshButton onClick={handleRefresh} refreshing={refreshing} />
        </div>

        <input
          type="text"
          placeholder="🔍 Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 w-full md:w-1/3"
        />
      </div>

      {/* 🧱 Projects List */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredProjects.length === 0 ? (
          <p className="text-gray-400 italic">No projects found.</p>
        ) : (
          filteredProjects.map((p) => {
            const status = getApplicationStatus(p);
            const isOwner = p.owner_id === user?.id;

            return (
              <motion.div
                key={p.id}
                whileHover={{ y: -6 }}
                className="p-6 rounded-xl bg-gray-800/70 border border-gray-700 shadow-lg"
              >
                {/* 🏷️ Project Details */}
                <h3 className="text-xl font-semibold text-indigo-300">{p.title}</h3>
                <p className="text-gray-300 mt-2">{p.description || "No description provided."}</p>
                <p className="text-gray-300 mt-2">🎯 {p.goal || "No goal specified"}</p>
                <p className="text-gray-300 mt-2">💡 {p.benifits || "No benefits specified"}</p>
                <p className="text-gray-400 mt-2">💰 {p.pay || "Price not specified"}</p>

                {/* 🧩 Skills */}
                {p.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm rounded-full bg-gray-700 text-indigo-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* 🧠 Apply / Status Section */}
                <div className="mt-5 flex justify-end">
                  {!user ? (
                    <p className="text-gray-400 italic text-sm">Login to apply</p>
                  ) : isOwner ? (
                    <p className="text-gray-400 italic text-sm">You created this project</p>
                  ) : status === "accepted" ? (
                    <p className="text-green-400 italic text-sm">
                      ✅ You are already collaborating on this project
                    </p>
                  ) : status === "pending" ? (
                    <p className="text-yellow-400 italic text-sm">⏳ Application pending</p>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedProject(p);
                        setShowApply(true);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                        text-white font-semibold rounded-xl shadow-md shadow-indigo-900/40
                        transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-pink-700/40"
                    >
                      {status === "rejected" ? "Reapply" : "Apply"}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 📨 Apply Modal (Animated) */}
      <AnimatePresence>
        {showApply && selectedProject && (
          <ApplyModal
            project={selectedProject}
            onClose={() => setShowApply(false)}
            user={user}
            loadMessages={loadMessages}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
