const axios = require("axios");

/**
 * Fetches the HTML content of a given URL using axios.
 * Normalizes the URL and uses browser-like headers to avoid bot blocks.
 *
 * @param {string} url - The website URL to fetch.
 * @returns {Promise<{ html: string, finalUrl: string }>}
 */
async function fetchPage(url) {
  // Normalize — ensure the URL has a protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    timeout: 15000,
    maxRedirects: 5,
  });

  const finalUrl = response.request?.res?.responseUrl || url;
  return { html: response.data, finalUrl };
}

module.exports = fetchPage;
