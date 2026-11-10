import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RefreshButton from "../components/refreshbutton.jsx";
import ApplyModal from "../components/models/applymodel.jsx";

export default function ProjectsPage({ projects = [], reload, user, loadMessages, messages = [] }) {
  const [showApply, setShowApply] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return projects
      .filter((project) => [project.title, project.organization, project.goal, project.benifits, project.benefits, project.description, ...(project.skills || [])].some((value) => value?.toLowerCase().includes(term)))
      .sort((a, b) => sortOrder === "oldest"
        ? new Date(a.created_at || 0) - new Date(b.created_at || 0)
        : sortOrder === "title" ? (a.title || "").localeCompare(b.title || "") : new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [projects, searchTerm, sortOrder]);

  const getApplicationStatus = (project) => messages
    .filter((message) => (message.project_id === project.id || message.content?.includes(project.title)) &&
      ((message.sender_id === user?.id && message.receiver_id === project.owner_id) || (message.receiver_id === user?.id && message.sender_id === project.owner_id)))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.status || null;

  const handleRefresh = async () => {
    setRefreshing(true);
    try { await reload(); } finally { setRefreshing(false); }
  };

  return (
    <section aria-labelledby="projects-heading">
      <div className="project-toolbar">
        <div className="project-toolbar-heading">
          <p className="page-kicker">Community directory</p>
          <h1 id="projects-heading" className="page-heading mt-2">Explore projects</h1>
          <p className="mt-2 text-sm text-gray-400">Find a team and a problem you care about.</p>
        </div>
        <label><span className="sr-only">Search projects</span><input type="search" aria-label="Search projects" placeholder="Search names, skills, or goals" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="field-control" /></label>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <label className="flex items-center gap-2 text-sm text-gray-400"><span>Sort</span><select aria-label="Sort projects" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="field-control !w-auto !py-2"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="title">A–Z</option></select></label>
          <RefreshButton onClick={handleRefresh} refreshing={refreshing} />
        </div>
      </div>
      <p className="mb-4 text-sm text-gray-400" aria-live="polite">{filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}</p>
      {filteredProjects.length === 0 ? <div className="surface-card px-6 py-16 text-center"><p className="text-lg font-semibold text-gray-100">{searchTerm ? "No matching projects" : "Nothing here yet"}</p><p className="mt-2 text-sm text-gray-400">{searchTerm ? "Try a different search." : "Projects shared by the community will appear here."}</p>{searchTerm && <button type="button" onClick={() => setSearchTerm("")} className="mt-4 text-sm font-semibold text-indigo-400 underline">Clear search</button>}</div> :
        <div className="project-grid">
          {filteredProjects.map((project) => {
            const status = getApplicationStatus(project);
            const isOwner = project.owner_id === user?.id;
            return <motion.article key={project.id} layout className="project-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><p className="project-card-org">{project.organization || "Community project"}</p><h2 className="project-card-title mt-1">{project.title}</h2></div>
                {project.created_at && <time className="shrink-0 text-xs text-gray-500" dateTime={project.created_at}>{new Date(project.created_at).toLocaleDateString()}</time>}
              </div>
              <p className="project-card-description mt-3">{project.description || "No description provided."}</p>
              {(project.goal || project.benefits || project.benifits || project.pay) && <p className="mt-3 text-xs text-gray-400">{project.goal || project.benefits || project.benifits || project.pay}</p>}
              <div className="project-card-details">{(project.skills || []).slice(0, 5).map((skill) => <span key={skill} className="project-skill">{skill}</span>)}</div>
              <div className="project-action-row">
                <span className="text-xs text-gray-500">{project.pay || "Open collaboration"}</span>
                {!user ? <span className="text-xs text-gray-400">Log in to apply</span>
                  : isOwner ? <span className="text-xs text-gray-400">Your project</span>
                    : status === "accepted" ? <span className="text-xs font-semibold text-green-400">Collaborating</span>
                      : status === "pending" ? <span className="text-xs font-semibold text-yellow-400">Pending</span>
                        : <button type="button" onClick={() => { setSelectedProject(project); setShowApply(true); }} className="primary-button !min-h-9 !px-3 !py-1.5 !text-xs">{status === "rejected" ? "Apply again" : "View & apply"}</button>}
              </div>
            </motion.article>;
          })}
        </div>}
      <AnimatePresence>{showApply && selectedProject && <ApplyModal project={selectedProject} onClose={() => setShowApply(false)} user={user} loadMessages={loadMessages} />}</AnimatePresence>
    </section>
  );
}
