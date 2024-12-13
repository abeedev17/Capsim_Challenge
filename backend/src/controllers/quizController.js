const { Question, Answer, Score } = require("../models/Quiz");

const quizController = {
  async getQuestions(req, res) {
    try {
      const questions = await Question.findAll({
        include: [
          {
            model: Answer,
            attributes: ["id", "text", "points"],
          },
        ],
        attributes: ["id", "text", "type"],
      });

      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Error fetching questions" });
    }
  },

  async submitScore(req, res) {
    try {
      const { score } = req.body;

      if (typeof score !== "number" || score < 0 || score > 100) {
        return res.status(400).json({ message: "Invalid score" });
      }

      const newScore = await Score.create({ score });
      res.status(201).json(newScore);
    } catch (error) {
      console.error("Error submitting score:", error);
      res.status(500).json({ message: "Error submitting score" });
    }
  },

  async getScoreDistribution(req, res) {
    try {
      const scores = await Score.findAll({
        attributes: ["score"],
      });

      const distribution = new Array(10).fill(0);

      scores.forEach(({ score }) => {
        const index = Math.min(Math.floor(score / 10), 9);
        distribution[index]++;
      });

      res.json(distribution);
    } catch (error) {
      console.error("Error fetching score distribution:", error);
      res.status(500).json({ message: "Error fetching score distribution" });
    }
  },

  async getScores(req, res) {
    try {
      const scores = await Score.findAll({
        order: [["date", "DESC"]],
      });
      res.json(scores);
    } catch (error) {
      console.error("Error fetching scores:", error);
      res.status(500).json({ message: "Error fetching scores" });
    }
  },
};

module.exports = quizController;
