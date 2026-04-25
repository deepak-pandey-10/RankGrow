const express = require("express");
const router = express.Router();
const { analyze } = require("../controllers/analyzeController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * POST /api/analyze
 * Route definition only — logic lives in the controller.
 */
router.post("/analyze", analyze);

module.exports = router;
