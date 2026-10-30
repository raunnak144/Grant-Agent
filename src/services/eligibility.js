function checkEligibility(opportunity, profile) {
  const reasons = [];

  if (
    profile.stage &&
    opportunity.stage &&
    !opportunity.stage.includes(profile.stage)
  ) {
    reasons.push("Startup stage does not match.");
  }

  if (
    profile.sector &&
    opportunity.sectors &&
    !opportunity.sectors.some(
      sector =>
        sector.toLowerCase() === profile.sector.toLowerCase()
    )
  ) {
    reasons.push("Startup sector does not match.");
  }

  if (opportunity.deadline) {
    const deadline = new Date(opportunity.deadline);

    if (Number.isNaN(deadline.getTime())) {
      reasons.push("Deadline needs verification.");
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadline < today) {
        reasons.push("The listed deadline has passed.");
      }
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons: reasons.length
      ? reasons
      : ["Matches the selected profile criteria."]
  };
}

module.exports = { checkEligibility };