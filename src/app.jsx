import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar.jsx";
import Loader from "./components/loader.jsx";
import HomePage from "./pages/homepage.jsx";
import ProjectsPage from "./pages/projectpage.jsx";
import PostProjectPage from "./pages/postprojectpage.jsx";
import MessagesPage from "./pages/messagespage.jsx";
import ProfileModal from "./components/models/profilemodel.jsx";
import SignupModal from "./components/models/signupmodel.jsx";
import LoginModal from "./components/models/loginmodel.jsx";
import ProfilePage from "./pages/profilepage.jsx";
import { fetchJSON } from "./utils/api.js";

const THEME_KEY = "devcloud-theme";

function getInitialUser() {
  try {
    const saved = window.sessionStorage.getItem("devcloud-user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function getInitialTheme() {
  try {
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Storage can be unavailable in private browsing; use the accessible default.
  }
  return "dark";
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState(getInitialUser);
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [theme, setTheme] = useState(getInitialTheme);
  const [stats, setStats] = useState({ projects: 0, users: 0, messages: 0 });
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  useEffect(() => {
    try {
      if (user) window.sessionStorage.setItem("devcloud-user", JSON.stringify(user));
      else window.sessionStorage.removeItem("devcloud-user");
    } catch {
      // The app remains usable when session storage is unavailable.
    }
  }, [user]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // The current theme still works when persistence is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    let active = true;
    fetchJSON("/stats")
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((error) => console.error("Error loading stats:", error));
    return () => { active = false; };
  }, []);

  const loadProjects = useCallback(async () => {
    setProjectsLoading(true);
    setProjectsError("");
    try {
      const data = await fetchJSON("/projects");
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjectsError("We couldn't load projects. Check your connection and try again.");
      toast.error("Projects could not be loaded.");
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    if (!user) {
      setMessages([]);
      return;
    }
    try {
      const data = await fetchJSON(`/messages?user_id=${encodeURIComponent(user.id)}`);
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    }
  }, [user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    loadMessages();
    if (!user) return undefined;
    const interval = window.setInterval(loadMessages, 15000);
    return () => window.clearInterval(interval);
  }, [loadMessages, user]);

  const onSignupSuccess = (createdUser) => {
    setUser(createdUser);
    setShowSignup(false);
    setTab("profile");
  };

  const onLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
    setShowLogin(false);
    setTab("profile");
  };

  const renderPage = () => {
    switch (tab) {
      case "home":
        return <HomePage stats={stats} onLoginClick={() => setShowLogin(true)} onExploreProjects={() => setTab("projects")} onPostProject={() => setTab("post")} />;
      case "projects":
        if (projectsLoading && projects.length === 0) return <Loader fullScreen label="Loading projects" />;
        if (projectsError && projects.length === 0) {
          return <section className="mx-auto max-w-xl py-20 text-center" role="alert"><h2 className="mb-3 text-2xl font-semibold">Projects are unavailable</h2><p className="mb-6 text-secondary">{projectsError}</p><button className="primary-button" onClick={loadProjects}>Try again</button></section>;
        }
        return <ProjectsPage projects={projects} reload={loadProjects} user={user} loadMessages={loadMessages} messages={messages} />;
      case "post":
        return user ? <PostProjectPage reload={loadProjects} user={user} /> : <section className="py-20 text-center"><h2 className="mb-3 text-2xl font-semibold">Sign in to post a project</h2><button className="primary-button" onClick={() => setShowLogin(true)}>Log in</button></section>;
      case "messages":
        return user ? <MessagesPage messages={messages} reload={loadMessages} user={user} onViewProfile={setSelectedProfile} /> : <section className="py-20 text-center"><h2 className="mb-3 text-2xl font-semibold">Sign in to view messages</h2><button className="primary-button" onClick={() => setShowLogin(true)}>Log in</button></section>;
      case "profile":
        return <ProfilePage user={user} setUser={setUser} />;
      default:
        return <HomePage stats={stats} onLoginClick={() => setShowLogin(true)} onExploreProjects={() => setTab("projects")} onPostProject={() => setTab("post")} />;
    }
  };

  return (
    <div className="app-shell min-h-screen font-sans">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar
        tab={tab}
        setTab={setTab}
        user={user}
        onShowSignup={() => setShowSignup(true)}
        onShowLogin={() => setShowLogin(true)}
        mobileMenu={mobileMenu}
        setMobileMenu={setMobileMenu}
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === "dark" ? "light" : "dark")}
        onLogout={() => { setUser(null); setMessages([]); setTab("home"); toast.info("You have been logged out."); }}
        unreadCount={messages.filter((message) => message.receiver_id === user?.id && message.status === "pending").length}
      />

      <main id="main-content" className="main-content mx-auto max-w-7xl px-6 py-10" tabIndex="-1">
        {renderPage()}
      </main>

      <footer className="app-footer border-t px-6 py-6 text-center text-sm">
        © {new Date().getFullYear()} DevCloud <span className="mx-2">·</span> Made for people who build together.
      </footer>

      <AnimatePresence>
        {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSignup={onSignupSuccess} />}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={onLoginSuccess} />}
        {selectedProfile && <ProfileModal profile={selectedProfile} user={user} onClose={() => setSelectedProfile(null)} />}
      </AnimatePresence>

      <ToastContainer position="top-right" autoClose={3000} newestOnTop closeOnClick pauseOnHover draggable theme={theme === "dark" ? "dark" : "light"} />
    </div>
  );
}
