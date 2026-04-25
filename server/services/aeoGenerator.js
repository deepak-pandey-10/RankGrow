const cheerio = require("cheerio");

/**
 * Generates actionable AEO enhancements based on page content.
 * 
 * Features:
 * 1. Suggests question-based headings for generic H2/H3s.
 * 2. Suggests snippet-optimized answers (40-60 words) from nearby paragraphs.
 * 3. Generates a ready-to-use JSON-LD FAQ schema payload based on extracted content.
 * 
 * @param {string} html - Raw HTML of the page 
 * @returns {object} Contains questions, snippets, and schema.
 */
function generateAeoEnhancements(html) {
  const $ = cheerio.load(html);
  
  const suggestedQuestions = [];
  const snippetSuggestions = [];
  const faqItems = [];

  const questionPrefixes = ["What is", "How do I use", "Why choose", "What are the benefits of"];
  let prefixIndex = 0;

  // Process top headings for enhancements
  $("h2, h3").each((i, el) => {
    // Cap at 4 suggested enhancements so we don't overwhelm the user
    if (snippetSuggestions.length >= 4) return;

    const originalText = $(el).text().trim();
    
    // Skip empty or excessively long/complex headings
    if (!originalText || originalText.length > 60 || originalText.split(' ').length > 8) return;

    let targetQuestion = originalText;
    const isQuestionPattern = /\?$/.test(originalText) || /^(what|how|why|when|where|who|can|is|does)/i.test(originalText);
    
    // 1. Suggest Question-based Heading
    if (!isQuestionPattern) {
      targetQuestion = `${questionPrefixes[prefixIndex % questionPrefixes.length]} ${originalText}?`;
      suggestedQuestions.push({
        original: originalText,
        suggested: targetQuestion
      });
      prefixIndex++;
    }

    // 2. Suggest Snippet Answer (extract next paragraphs)
    let nextEl = $(el).next();
    let paragraphText = "";
    
    while (nextEl.length && !nextEl.is('h1, h2, h3, h4')) {
      if (nextEl.is('p')) {
        paragraphText += nextEl.text().replace(/\s+/g, " ").trim() + " ";
      }
      nextEl = nextEl.next();
    }
    
    paragraphText = paragraphText.trim();
    
    if (paragraphText) {
      const words = paragraphText.split(/\s+/);
      let snippet = paragraphText;

      // Ensure 40-50 words snippet for "Answer Engine" sweet spot
      if (words.length > 50) {
        snippet = words.slice(0, 50).join(" ") + "...";
      } else if (words.length < 25) {
        // Not enough context, we'll append a hint
        snippet = snippet + " (Expand this text slightly to hit the optimal 40-60 word Answer Engine sweet spot.)";
      }

      snippetSuggestions.push({
        heading: targetQuestion,
        originalAnswerWordCount: words.length,
        suggestedAnswer: snippet
      });

      // 3. Populate FAQ Item
      faqItems.push({
        "@type": "Question",
        "name": targetQuestion,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": snippet.replace(/ \(Expand this text slightly.*\)/g, '') // remove hint for schema
        }
      });
    }
  });

  // Generate the final FAQ schema JSON-LD block
  let generatedFaqSchema = null;
  if (faqItems.length > 0) {
    generatedFaqSchema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems
    }, null, 2);
  }

  return {
    suggestedQuestions,
    snippetSuggestions,
    generatedFaqSchema
  };
}

module.exports = { generateAeoEnhancements };
