const { GoogleGenAI } = require("@google/genai");

async function askGemini(question) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in .env");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: `
      You are Grant Agent, an AI assistant for startup founders.
      Help users understand grants, hackathons, competitions,
      accelerators, startup eligibility and applications.
      Do not invent funding amounts, deadlines or official rules.

      User question: ${question}
    `
  });

  return response.text;
}

module.exports = { askGemini };