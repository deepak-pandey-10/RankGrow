/**
 * Calculates weighted scores for SEO, AEO, and Technical factors based on identified issues.
 * 
 * Weights:
 * - SEO represents 40% of the overall score.
 * - Technical represents 30% of the overall score.
 * - AEO represents 30% of the overall score.
 */
function calculateScores(seoIssues, aeoIssues, techIssues) {
    const SEO_WEIGHT = 0.4;
    const TECH_WEIGHT = 0.3;
    const AEO_WEIGHT = 0.3;
    
    // Base scores are 100 max
    let seoScore = 100;
    let aeoScore = 100;
    let techScore = 100;
  
    // Subtract impact counts
    seoIssues.forEach((i) => { seoScore -= (i.impact || 0); });
    aeoIssues.forEach((i) => { aeoScore -= (i.impact || 0); });
    techIssues.forEach((i) => { techScore -= (i.impact || 0); });
  
    // Floor at 0
    seoScore = Math.max(0, seoScore);
    aeoScore = Math.max(0, aeoScore);
    techScore = Math.max(0, techScore);
  
    // Overall weighted score
    const overallScore = Math.round((seoScore * SEO_WEIGHT) + (techScore * TECH_WEIGHT) + (aeoScore * AEO_WEIGHT));
    
    return {
      score: overallScore,
      potentialScore: 100,
      seoScore,
      aeoScore,
      techScore
    };
  }
  
  module.exports = { calculateScores };
