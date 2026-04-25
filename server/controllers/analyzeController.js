const fetchPage = require("../utils/fetchPage");
const { extractSeoData } = require("../services/seoService");
const { runSeoChecks } = require("../services/seoAnalyzer");
const { runAeoChecks } = require("../services/aeoAnalyzer");
const { runTechnicalChecks } = require("../services/technicalAnalyzer");
const { generateAeoEnhancements } = require("../services/aeoGenerator");
const { calculateScores } = require("../services/scoringService");
const { generateSuggestions } = require("../services/suggestionService");

/**
 * POST /api/analyze
 */
async function analyze(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i;
  if (!urlPattern.test(url)) {
    return res.status(400).json({ error: "Please enter a valid URL." });
  }

  try {
    console.log(`📊 Analyzing: ${url}`);

    // Fetch the page HTML
    const { html, finalUrl } = await fetchPage(url);
    const baseData = extractSeoData(html);

    // Run synchronous parsers
    const { seoData, issues: seoIssues } = runSeoChecks(html);
    const { aeoData, issues: aeoIssues } = runAeoChecks(html);
    const aeoEnhancements = generateAeoEnhancements(html);

    // Run async API driven checks (PageSpeed + HTTPS)
    const { techData, issues: techIssues } = await runTechnicalChecks(finalUrl);

    // Calculate dynamic scores encompassing all 3 pillars
    const { score, potentialScore, seoScore, aeoScore, techScore } = calculateScores(seoIssues, aeoIssues, techIssues);

    // Merge issues
    const issues = [...seoIssues, ...aeoIssues, ...techIssues];
    const suggestions = generateSuggestions(issues);

    return res.json({
      success: true,
      url: finalUrl,
      score,
      potentialScore,
      seo: {
        score: seoScore,
        ...baseData,
        checks: seoData,
      },
      aeo: {
        score: aeoScore,
        ...aeoData,
        enhancements: aeoEnhancements,
      },
      tech: {
        score: techScore,
        ...techData
      },
      issues,
      suggestions,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`❌ Analysis failed for ${url}:`, error.message);
    return res.status(500).json({
      error: "Failed to analyze the URL.",
      details: error.message,
    });
  }
}

module.exports = { analyze };
