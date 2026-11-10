import React from "react";

export default function HomePage({ stats, onLoginClick, onExploreProjects, onPostProject }) {
  const features = [
    { number: "01", title: "Find people to build with", desc: "Meet developers, designers, and founders who want to work on real ideas." },
    { number: "02", title: "Discover open projects", desc: "Browse opportunities by skills, goals, and the kind of work you want to do." },
    { number: "03", title: "Make progress together", desc: "Apply to join, start a conversation, and turn an idea into a shared result." },
  ];
  const projectCount = stats?.projects ?? 0;
  const memberCount = stats?.users ?? 0;
  const messageCount = stats?.messages ?? 0;

  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-heading">
        <div className="home-hero-copy">
          <p className="home-eyebrow">Collaborate. Build. Innovate.</p>
          <h1 id="home-heading" className="home-title">Good work starts<br />with the <span>right people.</span></h1>
          <p className="home-description">Find a project that fits your skills, or bring your own idea and build a team around it.</p>
          <div className="home-actions">
            <button type="button" onClick={onLoginClick} className="primary-button px-5 py-3">Get Started</button>
            <button type="button" onClick={onExploreProjects} className="secondary-button px-5 py-3">Explore Projects</button>
            <button type="button" onClick={onPostProject} className="text-sm font-semibold text-gray-400 underline underline-offset-4">Post a project</button>
          </div>
          <div className="home-proof"><span>Open to every discipline</span><span>Ideas grow through collaboration</span></div>
        </div>

        <aside className="home-preview" aria-label="Featured projects preview">
          <div className="preview-topline"><span className="preview-label">From the community</span><span>Open projects</span></div>
          <article className="preview-project">
            <p className="page-kicker">Product · Looking for collaborators</p>
            <h2 className="preview-project-title mt-2">Build something people use</h2>
            <p className="preview-project-meta">A focused team, one shared goal.</p>
            <div className="preview-tags"><span className="preview-tag">Design</span><span className="preview-tag">Engineering</span><span className="preview-tag">Product</span></div>
          </article>
          <article className="preview-project">
            <p className="page-kicker">Community · Open invitation</p>
            <h2 className="preview-project-title mt-2">Bring your perspective</h2>
            <p className="preview-project-meta">Small contributions add up.</p>
            <div className="preview-tags"><span className="preview-tag">Remote</span><span className="preview-tag">Collaborative</span></div>
          </article>
          <div className="mt-4 flex items-center justify-between border-t border-gray-700 pt-4 text-xs text-gray-400"><span>Connections start with a conversation</span><span>Conversations start here</span></div>
        </aside>
      </section>

      <section className="home-stats" aria-label="Community activity">
        <div className="home-stat"><p className="home-stat-value">{projectCount}</p><p className="home-stat-label">Projects shared</p></div>
        <div className="home-stat"><p className="home-stat-value">{memberCount}</p><p className="home-stat-label">People building</p></div>
        <div className="home-stat"><p className="home-stat-value">{messageCount}</p><p className="home-stat-label">Conversations started</p></div>
      </section>

      <section className="home-features" aria-labelledby="features-heading">
        <p className="page-kicker">A simple way to get started</p>
        <h2 id="features-heading" className="home-features-heading">From first idea to shared work.</h2>
        <div className="home-feature-grid">
          {features.map((feature) => <article key={feature.number} className="home-feature"><span className="home-feature-index">{feature.number}</span><h3>{feature.title}</h3><p>{feature.desc}</p></article>)}
        </div>
      </section>
      <section className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-gray-700 py-8 sm:flex-row sm:items-center">
        <div><h2 className="text-xl font-semibold text-gray-100">Have an idea worth sharing?</h2><p className="mt-1 text-sm text-gray-400">Put it out there. Your collaborators are looking.</p></div>
        <button type="button" onClick={onPostProject} className="primary-button">Start a project</button>
      </section>
    </div>
  );
}
