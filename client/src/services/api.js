import axios from "axios";

// Detect if we're in production or development to switch base URL
// If running locally, Vite proxy handles `/api`, but if the user runs the server 
// directly or there's a proxy issue, this ensures it routes correctly.
const API_BASE = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE,
});

// Auto-inject JWT token if present
apiClient.interceptors.request.use((config) => {
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
  const response = await apiClient.post(`/analyze`, { url });
  return response.data;
}

export default apiClient;

