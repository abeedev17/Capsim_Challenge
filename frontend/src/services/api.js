import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const quizService = {
  async getQuestions() {
    try {
      const response = await api.get("/questions");
      return this.formatQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  async submitScore(score) {
    try {
      const response = await api.post("/scores", { score });
      return response.data;
    } catch (error) {
      console.error("Error submitting score:", error);
      throw error;
    }
  },

  async getDistribution() {
    try {
      const response = await api.get("/scores/distribution");
      return response.data;
    } catch (error) {
      console.error("Error fetching distribution:", error);
      throw error;
    }
  },

  formatQuestions(questions) {
    return questions.map((q) => ({
      text: q.text,
      type: q.type,
      answers: q.Answers.map((a) => ({
        text: a.text,
        points: a.points,
      })),
    }));
  },
};

export default api;
