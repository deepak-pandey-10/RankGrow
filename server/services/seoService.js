const cheerio = require("cheerio");

/**
 * Parses raw HTML and extracts core SEO data using cheerio.
 *
 * Extracts:
 *  - Page title and its character length
 *  - Meta description
 *  - Number of H1 tags
 *  - All headings grouped by level (H1, H2, H3)
 *
 * @param {string} html - The raw HTML string of the page.
 * @returns {object} Extracted SEO data.
 */
function extractSeoData(html) {
  const $ = cheerio.load(html);

  // ── Title ─────────────────────────────────────────────────
  const title = $("title").text().trim() || null;
  const titleLength = title ? title.length : 0;

  // ── Meta Description ──────────────────────────────────────
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() || null;

  // ── Headings ──────────────────────────────────────────────
  const h1Tags = [];
  $("h1").each((_, el) => {
    h1Tags.push($(el).text().trim());
  });

  const h2Tags = [];
  $("h2").each((_, el) => {
    h2Tags.push($(el).text().trim());
  });

  const h3Tags = [];
  $("h3").each((_, el) => {
    h3Tags.push($(el).text().trim());
  });

  return {
    title,
    titleLength,
    metaDescription,
    h1Count: h1Tags.length,
    headings: {
      h1: h1Tags,
      h2: h2Tags,
      h3: h3Tags,
    },
  };
}

module.exports = { extractSeoData };
