import React from "react";
import { LogOut, Menu, Moon, Sun, X } from "lucide-react";

export default function Navbar({
  tab, setTab, user, onShowSignup, onShowLogin, mobileMenu, setMobileMenu,
  theme = "dark", onToggleTheme = () => {}, onLogout = () => {}, unreadCount = 0,
}) {
  const links = [
    { key: "home", label: "Explore" },
    { key: "projects", label: "Projects" },
    { key: "post", label: "Post Project" },
    { key: "messages", label: "Messages" },
    { key: "profile", label: "Profile" },
  ];

  const handleNavClick = (key) => {
    setTab(key);
    setMobileMenu(false);
  };

  const themeButton = (
    <button
      type="button"
      onClick={onToggleTheme}
      className="icon-button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
      <span className="md:hidden">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );

  const renderLinks = (mobile = false) => links.map((link) => {
    if (link.key === "profile" && !user) return null;
    if (link.key === "messages" && !user) return null;
    return (
      <button
        key={link.key}
        type="button"
        onClick={() => handleNavClick(link.key)}
        aria-current={tab === link.key ? "page" : undefined}
        className={`nav-link ${tab === link.key ? "nav-link-active" : ""} ${mobile ? "w-full text-left" : ""}`}
      >
        {link.label}
        {link.key === "messages" && unreadCount > 0 && <span className="nav-badge" aria-label={`${unreadCount} pending requests`}>{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>
    );
  });

  return (
    <header className="app-header sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
        <button type="button" onClick={() => handleNavClick("home")} className="brand-mark" aria-label="DevCloud home">DevCloud<span className="brand-dot">.</span></button>

        <nav className="hidden items-center gap-1 rounded-xl border border-gray-700/60 bg-gray-900/40 p-1 md:flex" aria-label="Main navigation">
          {renderLinks()}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {themeButton}
          {!user ? <>
            <button type="button" onClick={onShowLogin} className="secondary-button">Login</button>
            <button type="button" onClick={onShowSignup} className="primary-button">Sign Up</button>
          </> : <>
            <button type="button" className="user-chip" onClick={() => handleNavClick("profile")}>
              <img src={user.avatar_url || "/default-avatar.png"} alt="avatar" className="user-avatar" />
              <span className="max-w-28 truncate">{user.name}</span>
            </button>
            <button type="button" className="icon-button" onClick={onLogout} aria-label="Log out" title="Log out"><LogOut size={18} /></button>
          </>}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {themeButton}
          <button type="button" onClick={() => setMobileMenu(!mobileMenu)} className="icon-button" aria-expanded={mobileMenu} aria-controls="mobile-navigation" aria-label={mobileMenu ? "Close menu" : "Open menu"}>
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenu && <div id="mobile-navigation" className="mobile-navigation border-t px-5 py-4 md:hidden">
        <nav className="flex flex-col gap-1" aria-label="Mobile navigation">{renderLinks(true)}</nav>
        <div className="mt-4 flex flex-col gap-3 border-t pt-4">
          {!user ? <>
            <button type="button" onClick={() => { onShowLogin(); setMobileMenu(false); }} className="secondary-button w-full">Login</button>
            <button type="button" onClick={() => { onShowSignup(); setMobileMenu(false); }} className="primary-button w-full">Sign Up</button>
          </> : <>
            <button type="button" className="user-chip w-full" onClick={() => handleNavClick("profile")}><img src={user.avatar_url || "/default-avatar.png"} alt="" className="user-avatar" /><span>{user.name}</span></button>
            <button type="button" className="secondary-button w-full" onClick={() => { onLogout(); setMobileMenu(false); }}><LogOut size={17} /> Log out</button>
          </>}
        </div>
      </div>}
    </header>
  );
}
