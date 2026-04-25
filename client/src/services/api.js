import axios from "axios";

const API_BASE = "/api";

// Auto-inject JWT token if present
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("nexus_auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Sends a URL to the backend for SEO + AEO analysis.
 * @param {string} url - The website URL to analyze.
 * @returns {Promise<object>} - Analysis results.
 */
export async function analyzeUrl(url) {
  const response = await axios.post(`${API_BASE}/analyze`, { url });
  return response.data;
}
