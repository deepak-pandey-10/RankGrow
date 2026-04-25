const cheerio = require("cheerio");

/**
 * Runs SEO checks on raw HTML and returns findings + issues.
 *
 * Checks performed:
 *  1. Missing or empty meta description
 *  2. Title length optimization (ideal: 50–60 chars)
 *  3. H1 presence — exactly one H1 expected
 *  4. Image alt attributes — flags images without alt text
 *
 * @param {string} html - Raw HTML of the page.
 * @returns {{ seoData: object, issues: object[] }}
 */
function runSeoChecks(html) {
  const $ = cheerio.load(html);
  const issues = [];

  // ── 1. Meta Description ───────────────────────────────────
  const metaDesc = $('meta[name="description"]').attr("content")?.trim() || null;
  let metaStatus = "pass";

  if (!metaDesc) {
    metaStatus = "fail";
    issues.push({
      type: "seo",
      severity: "high",
      impact: 30,
      check: "meta_description",
      message: "Meta description is missing. Add a compelling 150–160 character description.",
    });
  } else if (metaDesc.length < 120) {
    metaStatus = "warning";
    issues.push({
      type: "seo",
      severity: "medium",
      impact: 10,
      check: "meta_description",
      message: `Meta description is too short (${metaDesc.length} chars). Aim for 150–160 characters.`,
    });
  } else if (metaDesc.length > 160) {
    metaStatus = "warning";
    issues.push({
      type: "seo",
      severity: "medium",
      impact: 10,
      check: "meta_description",
      message: `Meta description is too long (${metaDesc.length} chars). Keep it under 160 characters.`,
    });
  }

  // ── 2. Title Length ───────────────────────────────────────
  const title = $("title").text().trim() || null;
  const titleLength = title ? title.length : 0;
  let titleStatus = "pass";

  if (!title) {
    titleStatus = "fail";
    issues.push({
      type: "seo",
      severity: "high",
      impact: 30,
      check: "title",
      message: "Page title is missing. Every page must have a unique <title> tag.",
    });
  } else if (titleLength < 50) {
    titleStatus = "warning";
    issues.push({
      type: "seo",
      severity: "medium",
      impact: 10,
      check: "title",
      message: `Title is too short (${titleLength} chars). Optimal length is 50–60 characters.`,
    });
  } else if (titleLength > 60) {
    titleStatus = "warning";
    issues.push({
      type: "seo",
      severity: "medium",
      impact: 10,
      check: "title",
      message: `Title is too long (${titleLength} chars). It may be truncated in search results. Aim for 50–60 characters.`,
    });
  }

  // ── 3. H1 Presence ───────────────────────────────────────
  const h1Elements = $("h1");
  const h1Count = h1Elements.length;
  const h1Texts = [];
  h1Elements.each((_, el) => h1Texts.push($(el).text().trim()));
  let h1Status = "pass";

  if (h1Count === 0) {
    h1Status = "fail";
    issues.push({
      type: "seo",
      severity: "high",
      impact: 20,
      check: "h1",
      message: "No <h1> tag found. Every page should have exactly one H1.",
    });
  } else if (h1Count > 1) {
    h1Status = "warning";
    issues.push({
      type: "seo",
      severity: "medium",
      impact: 10,
      check: "h1",
      message: `Found ${h1Count} <h1> tags. Best practice is exactly one H1 per page.`,
    });
  }

  // ── 4. Image Alt Attributes ───────────────────────────────
  const images = $("img");
  const totalImages = images.length;
  const missingAlt = [];
  let altStatus = "pass";

  images.each((_, img) => {
    const alt = $(img).attr("alt");
    const src = $(img).attr("src") || $(img).attr("data-src") || "unknown";
    if (!alt || alt.trim().length === 0) {
      missingAlt.push(src);
    }
  });

  // ── 5. Lazy Loading ────────────────────────────────────────
  const missingLazy = [];
  images.each((_, img) => {
    const loading = $(img).attr("loading");
    const src = $(img).attr("src") || "unknown";
    if (loading !== "lazy") {
      missingLazy.push(src);
    }
  });

  if (totalImages > 0 && missingLazy.length > 0) {
    issues.push({
      type: "seo",
      severity: "medium",
      impact: 10,
      check: "lazy_loading",
      message: `${missingLazy.length} of ${totalImages} image(s) do not use lazy loading. Use loading="lazy" to improve performance.`,
    });
  }

  if (missingAlt.length > 0) {
    const percentage = missingAlt.length / totalImages;
    altStatus = percentage > 0.5 ? "fail" : "warning";
    issues.push({
      type: "seo",
      severity: altStatus === "fail" ? "high" : "medium",
      impact: altStatus === "fail" ? 20 : 10,
      check: "image_alt",
      message: `${missingAlt.length} of ${totalImages} image(s) are missing alt attributes.`,
    });
  }

  return {
    seoData: {
      metaDescription: {
        value: metaDesc,
        length: metaDesc ? metaDesc.length : 0,
        status: metaStatus,
      },
      title: {
        value: title,
        length: titleLength,
        status: titleStatus,
      },
      h1: {
        count: h1Count,
        values: h1Texts,
        status: h1Status,
      },
      images: {
        total: totalImages,
        missingAlt: missingAlt.length,
        missingAltSources: missingAlt.slice(0, 10), // cap at 10
        status: altStatus,
      },
      lazyLoading: {
        total: totalImages,
        missing: missingLazy.length,
        status: missingLazy.length > 0 ? "warning" : "pass",
      },
    },
    issues,
  };
}

module.exports = { runSeoChecks };
