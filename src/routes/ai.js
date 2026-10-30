const express = require("express");
const { askGemini } = require("../services/gemini");

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question."
      });
    }

    const answer = await askGemini(question);

    res.json({
      success: true,
      answer
    });
  } catch (error) {
    console.error("AI error:", error.message);

    res.status(500).json({
      success: false,
      message: "AI request failed. Check your API key."
    });
  }
});

module.exports = router;