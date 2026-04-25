const axios = require("axios");

/**
 * Runs Technical SEO checks, including HTTPS validation 
 * and calling Google PageSpeed Insights API for performance analysis.
 * 
 * @param {string} url - The final resolved URL of the website.
 * @returns {Promise<{ techData: object, issues: object[] }>}
 */
async function runTechnicalChecks(url) {
  const issues = [];
  const techData = { 
    https: false,
    performanceScore: null,
    mobileFriendly: null,
    robotsTxt: false
  };

  // 1. Check Robots.txt
  try {
    const baseUrl = new URL(url).origin;
    const robotsRes = await axios.get(`${baseUrl}/robots.txt`, { timeout: 5000 });
    if (robotsRes.status === 200) {
      techData.robotsTxt = true;
    }
  } catch (err) {
    issues.push({
      type: "tech",
      severity: "high",
      impact: 20,
      check: "robots_txt",
      message: "No robots.txt file detected. This file is critical for instructing search crawlers on how to index your site.",
    });
  }

  // 2. Check HTTPS
  if (url.startsWith("https://")) {
    techData.https = true;
  } else {
    issues.push({
      type: "tech",
      severity: "high",
      impact: 40,
      check: "https",
      message: "Site is not communicating over HTTPS. A valid SSL certificate is a strict ranking requirement.",
    });
  }

  // 2. Google PageSpeed Insights (Mobile Strategy)
  try {
    const encodedUrl = encodeURIComponent(url);
    // Note: Calling without a key is fine for low volume, but we add a timeout to prevent hanging the server
    const apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&strategy=mobile`;
    
    // 20 second timeout for Lighthouse, as it can be slow
    const response = await axios.get(apiEndpoint, { timeout: 20000 });
    
    const lighthouse = response.data.lighthouseResult;
    const scoreVal = lighthouse?.categories?.performance?.score;

    if (scoreVal !== undefined && scoreVal !== null) {
      techData.performanceScore = Math.round(scoreVal * 100);

      // We infer mobile performance friendliness from the mobile lighthouse score
      techData.mobileFriendly = techData.performanceScore >= 50;

      if (techData.performanceScore < 50) {
        issues.push({
          type: "tech",
          severity: "high",
          impact: 30,
          check: "page_speed",
          message: `Critical mobile performance detected (${techData.performanceScore}/100). Slow sites are heavily penalized by search engines.`,
        });
      } else if (techData.performanceScore < 85) {
        issues.push({
          type: "tech",
          severity: "medium",
          impact: 10,
          check: "page_speed",
          message: `Mobile performance could be improved (${techData.performanceScore}/100). Faster load times improve crawl budgets.`,
        });
      }
    }

  } catch (error) {
    console.warn(`[PageSpeed API] Failed or timed out for ${url}:`, error.message);
    // If it fails, we gracefully omit the check rather than crashing the analysis
    techData.performanceScore = "N/A";
    issues.push({
      type: "tech",
      severity: "low",
      impact: 0,
      check: "pagespeed_api_timeout",
      message: "Google PageSpeed Insights API could not be reached or timed out. Performance optimizations could not be measured.",
    });
  }

  return { techData, issues };
}

module.exports = { runTechnicalChecks };
