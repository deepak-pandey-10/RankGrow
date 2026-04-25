const express = require("express");
const cors = require("cors");
const analyzeRoutes = require("./routes/analyze");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", analyzeRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "RankGrow API is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
