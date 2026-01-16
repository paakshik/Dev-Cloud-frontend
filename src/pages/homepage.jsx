import React from "react";

export default function HomePage({ stats, onLoginClick, onExploreProjects, onPostProject }) {
  const FEATURES = [
    {
      icon: "🤝",
      title: "Seamless Collaboration",
      desc: "Connect with the right people instantly — developers, designers, and innovators who share your vision.",
    },
    {
      icon: "⚙️",
      title: "Smart Project Matching",
      desc: "Our AI-assisted recommendation system pairs you with projects that fit your skills and goals.",
    },
    {
      icon: "🚀",
      title: "Build Together, Grow Faster",
      desc: "From concept to launch — collaborate, communicate, and succeed as one team.",
    },
  ];

  const COMMUNITY_STATS = [
    { stat: stats?.projects ?? 0, label: "Projects Posted" },
    { stat: Math.max(1, Math.floor((stats?.messages ?? 0) / 2)), label: "Active Collaborations" },
    { stat: stats?.users ?? 0, label: "Developers Joined" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b14] via-[#0e0e1a] to-[#0b0b14] text-gray-100">
      {/* 🌟 Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-32 pb-24 px-6">
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 animate-gradient">
          Collaborate. Build. Innovate.
        </h1>
        <p className="text-gray-400 text-lg mt-6 max-w-2xl">
          Power your ideas with collaboration. Join developers, designers, and organizations to create the next generation of tech together.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={onLoginClick}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-md shadow-indigo-900/40 hover:scale-105 transition-all duration-300"
          >
            🚀 Get Started
          </button>

          <button
            onClick={onExploreProjects}
            className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:border-indigo-400 hover:text-indigo-300 transition-all duration-300"
          >
            Explore Projects
          </button>
        </div>
      </section>

      {/* 🌟 Features */}
      <section className="py-20 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-12">Why Dev Cloud?</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-8">
          {FEATURES.map((item, i) => (
            <div
              key={i}
              className="bg-gray-900 rounded-2xl p-8 text-center shadow-lg hover:scale-105 hover:shadow-indigo-900/30 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60"></div>

      {/* 🌟 Community Section */}
      <section className="py-20 px-8 text-center">
        <h2 className="text-3xl font-bold text-indigo-400 mb-6">Join a Thriving Developer Community</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
           <span className="text-indigo-400 font-semibold">{COMMUNITY_STATS[2].stat}</span> collaborators are building projects, exchanging feedback, and pushing innovation forward every day.
        </p>

        <div className="flex justify-center gap-8 flex-wrap">
          {COMMUNITY_STATS.map((s, i) => (
            <div
              key={i}
              className="bg-gray-900 p-6 rounded-xl w-48 shadow-lg border border-gray-800 hover:border-indigo-500 transition-all"
            >
              <p className="text-3xl font-extrabold text-indigo-400">{s.stat}</p>
              <p className="text-gray-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🌟 Call to Action */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-center rounded-t-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-4">Your next big idea deserves a team.</h2>
        <p className="text-gray-100 mb-6">
          Start a project or join one today — let’s build the future together.
        </p>
        <button
          onClick={onPostProject}
          className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:scale-105 transition-transform"
        >
          Start Collaborating
        </button>
      </section>

      {/* 🌟 Footer */}
      <footer className="text-gray-500 text-sm py-6 bg-[#0a0a12] border-t border-gray-800 text-center">
        © {new Date().getFullYear()} Dev Cloud— Built for Developers, by Developers.
      </footer>
    </div>
  );
}
