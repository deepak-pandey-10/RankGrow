/**
 * A suggestion engine that Maps an SEO or AEO issue to a comprehensive suggestion,
 * and sorts all suggestions prioritized by severity to focus on ranking probability.
 *
 * @param {object[]} issues - The combined array of SEO and AEO issues.
 * @returns {object[]} Sorted array of detailed actionable suggestions.
 */
function generateSuggestions(issues) {
  // Mapping of specific checks to robust, actionable solutions.
  const suggestionsMap = {
    meta_description: {
      problem: "Search engines display meta descriptions in search results. A bad, absent, or truncated description reduces organic click-through rates.",
      fix: "Write a unique, compelling meta description between 150-160 characters. Clearly summarize the page's value proposition to users and include your primary keyword.",
      example: '<meta name="description" content="Learn how to optimize your website for Answer Engines with our comprehensive AEO toolkit. Boost visibility in voice search and AI tools.">',
    },
    title: {
      problem: "The title tag is a crucial ranking factor and the main headline in search results. Too short wastes real estate, too long gets truncated.",
      fix: "Craft a highly descriptive and engaging title between 50-60 characters. Place your most important keywords near the beginning and optionally add your brand name at the end.",
      example: "<title>Top 10 Actionable AI SEO Strategies for 2026 | MyBrand</title>",
    },
    h1: {
      problem: "Search engines and screen readers rely on the H1 tag to understand the central topic. Missing or having multiple H1 tags can dilute topical relevance.",
      fix: "Ensure exactly one H1 tag exists per page. It should serve as the primary visual headline for the content and naturally contain your exact target keyword.",
      example: "<h1>Advanced SEO and AEO Analyzer Toolkit</h1>",
    },
    image_alt: {
      problem: "Images without alt text cannot be 'seen' by search engine bots or screen readers, severely hurting web accessibility and image search rankings.",
      fix: "Add descriptive 'alt' attributes to all non-decorative informative images. Keep it concise, literal, and describe exactly what the image shows without stuffing keywords.",
      example: '<img src="seo-chart.png" alt="Bar chart showing organic traffic growth over 6 months">',
    },
    question_headings: {
      problem: "Answer Engines (like ChatGPT and Google AI Overviews) specifically look for direct questions in headings (H2/H3) to extract precise answers for users.",
      fix: "Reformat thematic subheadings into natural language questions that your users actively search for (e.g., 'What is...', 'How to...').",
      example: "Instead of '<h2>SEO Pricing</h2>', utilize '<h2>How much do SEO services cost?</h2>'",
    },
    faq_schema: {
      problem: "Without JSON-LD FAQ schema, search engines have to guess if your content contains a Q&A format, reducing the probability of earning rich snippets.",
      fix: "Inject valid FAQPage JSON-LD structured data into the <head> of your document. It must exactly match the questions and answers visually present on your page.",
      example: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is AEO?",
    "acceptedAnswer": { "@type": "Answer", "text": "Answer Engine Optimization..." }
  }]
}
</script>`,
    },
    answer_clarity: {
      problem: "Answer Engines struggle to parse context when direct answers are buried inside dense, wordy, or multifaceted paragraphs.",
      fix: "Directly below a question heading, supply a clear, authoritative, and direct answer paragraph between 20-80 words, before expanding into detailed prose later.",
      example: "[Heading]: What is AEO?\n[Paragraph]: Answer Engine Optimization (AEO) is the ongoing process of structuring web content so that AI-powered conversational search tools can easily extract and present it as a direct answer.",
    },
    // New Technical Checks
    https: {
      problem: "Search engines heavily penalize pages served over legacy HTTP networks. It introduces a massive security flaw, driving away users and destroying Answer Engine trustworthiness.",
      fix: "Purchase and install an SSL certificate on your web server domain. Configure strict 301 redirects to ensure 100% of traffic is forced to the HTTPS protocol.",
      example: "Verify your browser address bar reflects: 'https://example.com'",
    },
    page_speed: {
      problem: "Slow loading speeds severely degrade mobile user experience, radically pushing up bounce rates and resulting in fierce SEO ranking penalties from Google Core Web Vitals.",
      fix: "Optimize the weight of your images (use WEBP), meticulously minify your CSS/JS payloads, leverage deep browser caching protocols, and utilize a Global CDN.",
      example: "Aim for a Google PageSpeed mobile score of >90 with an LCP (Largest Contentful Paint) under 2.5 seconds.",
    },
    pagespeed_api_timeout: {
      problem: "We couldn't reach the Google API infrastructure to verify your site performance metric score efficiently.",
      fix: "No action required from your side. Feel free to re-trigger the analyzer scan shortly.",
      example: "N/A"
    }
  };

  const severityPriority = {
    high: 1,
    medium: 2,
    low: 3,
  };

  const suggestions = issues.map((issue) => {
    const template = suggestionsMap[issue.check] || {
      problem: issue.message,
      fix: "Review this element against standard technical guidelines and optimize to industry best practices.",
      example: "N/A",
    };

    return {
      severity: issue.severity,
      check: issue.check,
      problem: template.problem,
      fix: template.fix,
      example: template.example,
    };
  });

  // Sort by priority to ensure high ranking hits are presented first
  suggestions.sort(
    (a, b) => severityPriority[a.severity] - severityPriority[b.severity]
  );

  // Deduplicate: If an issue (e.g. meta title length & meta title missing)
  // mapped to the same underlying check, we only want one comprehensive suggestion.
  const uniqueSuggestions = [];
  const seenChecks = new Set();

  for (const sug of suggestions) {
    if (!seenChecks.has(sug.check)) {
      uniqueSuggestions.push(sug);
      seenChecks.add(sug.check);
    }
  }

  return uniqueSuggestions;
}

module.exports = { generateSuggestions };
