const express = require("express");
const fs = require("fs");
const path = require("path");

const { matchOpportunities } = require("../services/matching");

const router = express.Router();

const databasePath = path.join(
  __dirname,
  "../../data/opportunities.json"
);

// Load opportunities from database
function getOpportunities() {
  const data = fs.readFileSync(databasePath, "utf8");
  return JSON.parse(data);
}

// Get all opportunities
router.get("/", (req, res) => {
  try {
    const opportunities = getOpportunities();

    res.json({
      success: true,
      total: opportunities.length,
      opportunities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load opportunities"
    });
  }
});

// Match opportunities with startup profile
router.post("/match", (req, res) => {
  try {
    const startup = req.body;

    if (!startup || !startup.sector) {
      return res.status(400).json({
        success: false,
        message: "Startup sector is required"
      });
    }

    const opportunities = getOpportunities();

    const matches = matchOpportunities(
      startup,
      opportunities,
      { minimumScore: 25 }
    );

    res.json({
      success: true,
      total: matches.length,
      matches,
      opportunities: matches
    });

  } catch (error) {
    console.error("Matching error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to match opportunities"
    });
  }
});

module.exports = router;