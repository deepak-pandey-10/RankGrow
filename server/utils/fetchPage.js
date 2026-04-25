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
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "max-age=0",
      "Upgrade-Insecure-Requests": "1",
      "Referer": "https://www.google.com/",
      "DNT": "1"
    },
    timeout: 90000,
    maxRedirects: 10,
  });

  const finalUrl = response.request?.res?.responseUrl || url;
  return { html: response.data, finalUrl };
}

module.exports = fetchPage;
