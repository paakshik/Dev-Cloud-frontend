// src/utils/api.js
const API_BASE = "http://127.0.0.1:8000/api/v1";

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

