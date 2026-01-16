// All the important import statments for files and libraries
import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence} from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar.jsx";
import HomePage from "./pages/homepage.jsx";
import ProjectsPage from "./pages/projectpage.jsx";
import PostProjectPage from "./pages/postprojectpage.jsx";
import MessagesPage from "./pages/messagespage.jsx";
import ProfileModal from "./components/models/profilemodel.jsx"; 
import SignupModal from "./components/models/signupmodel.jsx"; 
import LoginModal from "./components/models/loginmodel.jsx"; 
import ProfilePage from "./pages/profilepage.jsx";
import {fetchJSON} from "./utils/api.js"; 


export default function App() {
// All the variables defined
const [tab, setTab] = useState("home");
const [user, setUser] = useState(null);
const [showSignup, setShowSignup] = useState(false);
const [showLogin, setShowLogin] = useState(false);
const [mobileMenu, setMobileMenu] = useState(false);
const [selectedProfile, setSelectedProfile] = useState(null);
const [stats, setStats] = useState({ projects: 0, users: 0 })
const [projects, setProjects] = useState([]);
const [messages, setMessages] = useState([]);

// for loading the stats for the app
useEffect(() => {
  const loadStats = async () => {
    try {
      const data = await fetchJSON("/stats");
      setStats(data);
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };
  loadStats();
}, []); 

//for loading the projects
const loadProjects = useCallback(async () => {
  try {
    const data = await fetchJSON("/projects");
    setProjects(data);
  } catch (err) {
    console.error("Error loading projects:", err);
    toast.warn("No projects available right now.");
  }
}, []);

// for loading the messages for the app
const loadMessages = useCallback(async () => {
  if (!user) {
    setMessages([]);
    return;
  }
  try {
    const data = await fetchJSON(`/messages?user_id=${encodeURIComponent(user.id)}`);
    console.log("Loaded messages for", user.id, data);
    setMessages(data);
  } catch (error) {
    console.error("Error loading messages:", error);
    setMessages([]);
  }
}, [user]);

// for loading the sign up  drop down for the user.
const onSignupSuccess = (createdUser) => {
    setUser(createdUser);
    setShowSignup(false);
    setTab("profile");
  };
// for loading the login drop down menu
const onLoginSuccess = (loggedUser) => {
  setUser(loggedUser);
  setShowLogin(false);
  setTab("profile");
};

useEffect(() => {
  loadProjects(); // Load projects once on mount

  // Immediately load messages once
  loadMessages();

  // Then set up periodic refresh
  const interval = setInterval(() => {
    loadMessages();
  }, 500);

  // Cleanup interval on unmount
  return () => clearInterval(interval);

}, [loadProjects, loadMessages]);

return (    
<div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 font-sans">
  {/* 🌟 Navbar */}
  <Navbar
    tab={tab}
    setTab={setTab}
    user={user}
    onShowSignup={() => setShowSignup(true)}
    onShowLogin={() => setShowLogin(true)}
    mobileMenu={mobileMenu}
    setMobileMenu={setMobileMenu}
  />

  {/* 🌟 Main Content */}
  <main className="max-w-7xl mx-auto px-6 py-10">
    {(() => {
      switch (tab) {
        case "home":
          return (
            <HomePage
              stats={stats}
              onLoginClick={() => setShowLogin(true)}
              onExploreProjects={() => setTab("projects")}
              onPostProject={() => setTab("post")}
            />
          );

        case "projects":
          return (
            <ProjectsPage
              projects={projects}
              reload={loadProjects}
              user={user}
              loadMessages={loadMessages}
              messages={messages}
            />
          );

        case "post":
          return <PostProjectPage reload={loadProjects} user={user} />;

        case "messages":
          return (
            <MessagesPage
              messages={messages}
              reload={loadMessages}
              user={user}
              onViewProfile={(profile) => setSelectedProfile(profile)}
            />
          );

        case "profile":
          return <ProfilePage user={user} setUser={setUser} />;

        default:
          return (
            <HomePage
              stats={stats}
              onLoginClick={() => setShowLogin(true)}
              onExploreProjects={() => setTab("projects")}
              onPostProject={() => setTab("post")}
            />
          );
      }
    })()}
  </main>

  {/* 🌟 Modals */}
  <AnimatePresence>
    {showSignup && (
      <SignupModal
        onClose={() => setShowSignup(false)}
        onSignup={onSignupSuccess}
      />
    )}

    {showLogin && (
      <LoginModal
        onClose={() => setShowLogin(false)}
        onLogin={onLoginSuccess}
      />
    )}

    {selectedProfile && (
      <ProfileModal
        profile={selectedProfile}
        user={user}
        onClose={() => setSelectedProfile(null)}
      />
    )}
  </AnimatePresence>

  {/* 🌟 Toast Notifications */}
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    pauseOnHover
    draggable
    theme="colored"
  />
</div>
)}