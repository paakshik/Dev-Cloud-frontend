import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { apiUrl } from "../../utils/api.js";

export default function LoginModal({ onClose, onLogin }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!credentials.username.trim() || !credentials.password.trim()) {
      toast.warn("Enter both username and password.");
      return;
    }
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);
      const response = await fetch(apiUrl("/api/v1/login"), { method: "POST", body: formData });
      if (!response.ok) {
        toast.error("Username or password is incorrect.");
        return;
      }
      const user = await response.json();
      toast.success(`Welcome back, ${user.name}.`);
      onLogin(user);
      onClose();
    } catch {
      toast.error("Could not connect to the service.");
    } finally { setIsLoading(false); }
  };

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget && !isLoading) onClose(); }}>
      <motion.form onSubmit={handleLogin} className="modal-card max-w-md" role="dialog" aria-modal="true" aria-labelledby="login-heading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
        <div className="mb-6"><p className="page-kicker">Welcome back</p><h2 id="login-heading" className="modal-title mt-2">Log in to DevCloud</h2><p className="modal-copy mt-2">Pick up where you left off.</p></div>
        <label className="modal-label">Username<input autoComplete="username" required value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} className="field-control mt-2" placeholder="Your username" /></label>
        <label className="modal-label mt-4">Password<input autoComplete="current-password" required type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} className="field-control mt-2" placeholder="Your password" /></label>
        <div className="mt-5 grid gap-2"><button type="submit" disabled={isLoading} className="primary-button w-full">{isLoading ? "Logging in…" : "Log in"}</button><button type="button" onClick={onClose} disabled={isLoading} className="secondary-button w-full">Cancel</button></div>
      </motion.form>
    </motion.div>
  );
}
