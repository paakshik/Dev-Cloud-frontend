import React from "react";

/**
 * Navbar — Main navigation bar for DevCloud.
 * @param {string} tab - Currently active tab.
 * @param {Function} setTab - Function to switch active tab.
 * @param {Object} user - Currently logged-in user (if any).
 * @param {Function} onShowSignup - Opens signup modal.
 * @param {Function} onShowLogin - Opens login modal.
 * @param {boolean} mobileMenu - Whether mobile menu is open.
 * @param {Function} setMobileMenu - Toggles mobile menu.
 */
export default function Navbar({
  tab,
  setTab,
  user,
  onShowSignup,
  onShowLogin,
  mobileMenu,
  setMobileMenu,
}) {
  const links = [
    { key: "home", label: "Explore" },
    { key: "projects", label: "Projects" },
    { key: "post", label: "Post Project" },
    { key: "messages", label: "Messages" },
    { key: "profile", label: "Profile" },
  ];

  // 🧭 Handle navigation and auto-close mobile menu
  const handleNavClick = (key) => {
    setTab(key);
    setMobileMenu(false);
  };

  return (
    <header className="w-full bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
      {/* 🔹 Navbar Container */}
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* 🔹 Logo */}
        <h1
          onClick={() => handleNavClick("home")}
          className="text-2xl font-bold tracking-wide text-indigo-400 cursor-pointer select-none"
        >
          DevCloud
        </h1>

        {/* 🔹 Desktop Links */}
        <nav className="hidden md:flex items-center gap-6 text-gray-300">
          {links.map((l) =>
            l.key === "profile" && !user ? null : (
              <button
                key={l.key}
                onClick={() => handleNavClick(l.key)}
                className={`hover:text-indigo-400 ${
                  tab === l.key ? "text-indigo-400 font-semibold" : ""
                } transition-all`}
              >
                {l.label}
              </button>
            )
          )}
        </nav>

        {/* 🔹 Right Side (Login / Profile) */}
        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <div className="flex gap-3">
              <button
                onClick={onShowLogin}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all"
              >
                Login
              </button>
              <button
                onClick={onShowSignup}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-all"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div
              onClick={() => handleNavClick("profile")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src={user.avatar_url}
                alt="avatar"
                className="w-9 h-9 rounded-full border border-indigo-400"
              />
              <span className="text-sm text-gray-300">{user.name}</span>
            </div>
          )}
        </div>

        {/* 🔹 Mobile Menu Button */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden p-2 rounded hover:bg-gray-800 transition-all"
        >
          <div className="w-6 h-0.5 bg-gray-300 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-300 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-300"></div>
        </button>
      </div>

      {/* 🔹 Mobile Dropdown */}
      {mobileMenu && (
        <div className="md:hidden flex flex-col gap-3 bg-gray-800 px-6 py-4 border-t border-gray-700">
          {links.map((l) =>
            l.key === "profile" && !user ? null : (
              <button
                key={l.key}
                onClick={() => handleNavClick(l.key)}
                className={`text-left ${
                  tab === l.key
                    ? "text-indigo-400 font-semibold"
                    : "text-gray-300"
                } transition-all`}
              >
                {l.label}
              </button>
            )
          )}

          {/* 🔹 Auth Buttons (Mobile) */}
          {!user ? (
            <div className="flex flex-col gap-3 mt-3">
              <button
                onClick={() => {
                  onShowLogin();
                  setMobileMenu(false);
                }}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onShowSignup();
                  setMobileMenu(false);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-all"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div
              onClick={() => handleNavClick("profile")}
              className="flex items-center gap-3 cursor-pointer mt-3"
            >
              <img
                src={user.avatar_url}
                alt="avatar"
                className="w-9 h-9 rounded-full border border-indigo-400"
              />
              <span className="text-sm text-gray-300">{user.name}</span>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
