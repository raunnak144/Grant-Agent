const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ");

const toArray = (value) => {
  if (Array.isArray(value)) return value.map(normalize).filter(Boolean);
  if (typeof value === "string") {
    return value.split(/[,;|]/).map(normalize).filter(Boolean);
  }
  return [];
};

const includesMatch = (values, target) =>
  values.some(value =>
    value === target ||
    value.includes(target) ||
    target.includes(value)
  );

function scoreOpportunity(startup = {}, opportunity = {}) {
  const sector = normalize(startup.sector || startup.industry);
  const stage = normalize(startup.stage || startup.startupStage);
  const location = normalize(startup.location || startup.country);

  const sectors = toArray(opportunity.sectors || opportunity.tags || opportunity.category);
  const stages = toArray(opportunity.stages || opportunity.startupStages || opportunity.stage);
  const locations = toArray(opportunity.locations || opportunity.location || opportunity.geography);

  let score = 0;
  const reasons = [];

  if (sector && sectors.length && includesMatch(sectors, sector)) {
    score += 45;
    reasons.push("Sector match");
  } else if (sector && !sectors.length) {
    score += 15;
    reasons.push("Sector not specified");
  }

  if (stage && stages.length && includesMatch(stages, stage)) {
    score += 30;
    reasons.push("Stage match");
  } else if (stage && !stages.length) {
    score += 10;
    reasons.push("Stage not specified");
  }

  if (location && locations.length) {
    const global = locations.some(item =>
      ["global", "worldwide", "international", "anywhere"].includes(item)
    );

    if (global || includesMatch(locations, location)) {
      score += 25;
      reasons.push(global ? "Available globally" : "Location match");
    }
  } else if (location && !locations.length) {
    score += 10;
    reasons.push("Location not specified");
  }

  return {
    score: Math.min(100, score),
    reasons
  };
}

function matchOpportunities(startup = {}, opportunities = [], options = {}) {
  if (!Array.isArray(opportunities)) {
    throw new TypeError("Opportunities must be an array");
  }

  const minimumScore = options.minimumScore ?? 1;

  return opportunities
    .map(opportunity => {
      const result = scoreOpportunity(startup, opportunity);

      return {
        ...opportunity,
        matchScore: result.score,
        matchReasons: result.reasons
      };
    })
    .filter(item => item.matchScore >= minimumScore)
    .sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = {
  matchOpportunities,
  scoreOpportunity
};