const cheerio = require("cheerio");

/**
 * Runs AEO (Answer Engine Optimization) checks on raw HTML.
 *
 * Checks performed:
 *  1. Question-based headings (H2/H3 that look like questions)
 *  2. FAQ schema detection (JSON-LD with FAQPage type)
 *  3. Clear answer content (concise paragraphs following question headings)
 *
 * @param {string} html - Raw HTML of the page.
 * @returns {{ aeoData: object, issues: object[] }}
 */
function runAeoChecks(html) {
  const $ = cheerio.load(html);
  const issues = [];

  // Patterns that indicate a question
  const questionPatterns = [
    /\?$/,                         // ends with ?
    /^what\s/i, /^how\s/i,        // starts with question words
    /^why\s/i, /^when\s/i,
    /^where\s/i, /^who\s/i,
    /^which\s/i, /^can\s/i,
    /^does\s/i, /^do\s/i,
    /^is\s/i, /^are\s/i,
    /^should\s/i, /^will\s/i,
  ];

  function isQuestion(text) {
    return questionPatterns.some((pattern) => pattern.test(text.trim()));
  }

  // ── 1. Question-Based Headings ────────────────────────────
  const questionHeadings = [];

  $("h2, h3, h4").each((_, el) => {
    const text = $(el).text().trim();
    if (isQuestion(text)) {
      questionHeadings.push({
        tag: el.tagName,
        text,
      });
    }
  });

  let qhStatus = "pass";
  if (questionHeadings.length === 0) {
    qhStatus = "fail";
    issues.push({
      type: "aeo",
      severity: "high",
      impact: 35,
      check: "question_headings",
      message: "No question-based headings found. Use headings like 'What is X?' or 'How to do Y?' to target answer engines.",
    });
  } else if (questionHeadings.length < 3) {
    qhStatus = "warning";
    issues.push({
      type: "aeo",
      severity: "medium",
      impact: 15,
      check: "question_headings",
      message: `Found ${questionHeadings.length} question heading(s). Adding more can improve AEO visibility.`,
    });
  }

  // ── 2. FAQ Schema Detection ───────────────────────────────
  const faqSchemas = [];
  let faqStatus = "fail";

  $('script[type="application/ld+json"]').each((_, script) => {
    try {
      const data = JSON.parse($(script).html());

      // Direct FAQPage
      if (data["@type"] === "FAQPage") {
        faqSchemas.push(data);
      }

      // Inside @graph array
      if (Array.isArray(data["@graph"])) {
        data["@graph"].forEach((item) => {
          if (item["@type"] === "FAQPage") {
            faqSchemas.push(item);
          }
        });
      }
    } catch (e) {
      // invalid JSON-LD — skip
    }
  });

  if (faqSchemas.length > 0) {
    faqStatus = "pass";

    // Count the Q&A entries inside the schema
    let totalQA = 0;
    faqSchemas.forEach((faq) => {
      if (Array.isArray(faq.mainEntity)) {
        totalQA += faq.mainEntity.length;
      }
    });

    faqSchemas.totalQA = totalQA;
  } else {
    issues.push({
      type: "aeo",
      severity: "high",
      impact: 35,
      check: "faq_schema",
      message: "No FAQPage schema detected. Adding JSON-LD FAQ markup helps answer engines surface your content.",
    });
  }

  // ── 3. Clear Answer Content ───────────────────────────────
  //   For each question heading, check if the next sibling paragraph
  //   provides a concise, direct answer (20–80 words).
  const answerPairs = [];
  let answeredCount = 0;

  $("h2, h3, h4").each((_, el) => {
    const headingText = $(el).text().trim();
    if (!isQuestion(headingText)) return;

    // Walk following siblings to find the first <p>
    let nextEl = $(el).next();
    let answerText = null;

    // Look through up to 3 siblings
    for (let i = 0; i < 3 && nextEl.length; i++) {
      if (nextEl.is("p")) {
        answerText = nextEl.text().trim();
        break;
      }
      nextEl = nextEl.next();
    }

    const wordCount = answerText ? answerText.split(/\s+/).length : 0;
    const isClearAnswer = wordCount >= 20 && wordCount <= 80;

    answerPairs.push({
      question: headingText,
      answerPreview: answerText ? answerText.substring(0, 120) + (answerText.length > 120 ? "…" : "") : null,
      answerWordCount: wordCount,
      isClearAnswer,
    });

    if (isClearAnswer) answeredCount++;
  });

  let answerStatus = "pass";
  const totalQuestions = answerPairs.length;

  if (totalQuestions === 0) {
    answerStatus = "fail";
    issues.push({
      type: "aeo",
      severity: "high",
      impact: 30,
      check: "answer_clarity",
      message: "No question-answer pattern detected. Structure content with question headings followed by concise answer paragraphs.",
    });
  } else if (answeredCount < totalQuestions / 2) {
    answerStatus = "warning";
    issues.push({
      type: "aeo",
      severity: "medium",
      impact: 15,
      check: "answer_clarity",
      message: `Only ${answeredCount} of ${totalQuestions} question headings are followed by a clear, concise answer (20–80 words).`,
    });
  }

  return {
    aeoData: {
      questionHeadings: {
        count: questionHeadings.length,
        items: questionHeadings,
        status: qhStatus,
      },
      faqSchema: {
        detected: faqSchemas.length > 0,
        count: faqSchemas.length,
        status: faqStatus,
      },
      answerClarity: {
        totalQuestions,
        clearAnswers: answeredCount,
        pairs: answerPairs,
        status: answerStatus,
      },
    },
    issues,
  };
}

module.exports = { runAeoChecks };
