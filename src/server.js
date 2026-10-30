const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const opportunitiesRoutes = require("./routes/opportunities");

// Middleware
app.use(express.json());

// API routes
app.use("/api/opportunities", opportunitiesRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "../public")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Grant Agent backend is running!"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Grant Agent running at http://localhost:${PORT}`);
});