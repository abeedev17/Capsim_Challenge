const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

router.get("/questions", quizController.getQuestions);

router.post("/scores", quizController.submitScore);

router.get("/scores/distribution", quizController.getScoreDistribution);

router.get("/scores", quizController.getScores);

module.exports = router;
