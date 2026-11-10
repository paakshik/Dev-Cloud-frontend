// src/utils/api.js
const API_ORIGIN = (process.env.REACT_APP_API_URL || "https://dev-cloud-4t37.onrender.com").replace(/\/$/, "");
const API_BASE = (process.env.REACT_APP_API_BASE_URL || `${API_ORIGIN}/api/v1`).replace(/\/$/, "");

export const apiUrl = (path = "") => `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;

export async function fetchJSON(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Error ${res.status}: ${errorData}`);
    }

    return await res.json();
  } catch (err) {
    console.error("API fetch error:", err);
    throw err;
  }
}

export default API_BASE;

