import { defineStore } from "pinia";
import { quizService } from "@/services/api";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    questions: [],
    scores: [],
    distribution: new Array(10).fill(0),
    currentAnswers: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchQuestions() {
      try {
        this.loading = true;
        this.error = null;
        this.questions = await quizService.getQuestions();
        if (!this.currentAnswers) {
          this.initializeAnswers();
        }
      } catch (error) {
        this.error = "Failed to fetch questions";
        console.error("Error fetching questions:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    initializeAnswers() {
      if (!this.questions || !this.questions.length) {
        this.currentAnswers = [];
        return;
      }
      this.currentAnswers = this.questions.map((q) =>
        q.type === "Multiple" ? [false, false, false, false] : ""
      );
    },

    calculateScore() {
      if (!this.currentAnswers || !this.questions || !this.questions.length) {
        return 0;
      }

      let totalPoints = 0;
      let maxPoints = 0;

      this.questions.forEach((question, qIndex) => {
        if (question.type === "Single") {
          const selectedAnswer = question.answers.find(
            (a) => a.text === this.currentAnswers[qIndex]
          );
          if (selectedAnswer) {
            totalPoints += selectedAnswer.points;
          }
          maxPoints += Math.max(...question.answers.map((a) => a.points));
        } else {
          this.currentAnswers[qIndex].forEach((selected, aIndex) => {
            if (selected) {
              totalPoints += question.answers[aIndex].points;
            }
          });
          maxPoints += question.answers.reduce(
            (sum, a) => sum + (a.points > 0 ? a.points : 0),
            0
          );
        }
      });

      if (maxPoints === 0) return 0;
      return Math.round((totalPoints / maxPoints) * 100);
    },

    async submitQuiz() {
      try {
        this.error = null;
        this.loading = true;

        const score = this.calculateScore();

        await quizService.submitScore(score);

        if (!Array.isArray(this.scores)) {
          this.scores = [];
        }
        if (!Array.isArray(this.distribution)) {
          this.distribution = new Array(10).fill(0);
        }

        this.scores.push(score);
        const index = Math.min(Math.floor(score / 10), 9);
        this.distribution[index]++;

        return score;
      } catch (error) {
        this.error = "Failed to submit quiz";
        console.error("Error submitting quiz:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchDistribution() {
      try {
        this.loading = true;
        this.error = null;

        const distribution = await quizService.getDistribution();
        this.distribution = Array.isArray(distribution)
          ? distribution
          : new Array(10).fill(0);
        return this.distribution;
      } catch (error) {
        this.error = "Failed to fetch score distribution";
        console.error("Error fetching distribution:", error);
        this.distribution = new Array(10).fill(0);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    resetQuiz() {
      this.initializeAnswers();
      this.error = null;
    },

    resetState() {
      this.questions = [];
      this.currentAnswers = null;
      this.error = null;
      this.loading = false;
    },
  },

  getters: {
    isQuizComplete: (state) => {
      if (!state.currentAnswers || !state.currentAnswers.length) return false;

      return state.currentAnswers.every((answer) => {
        if (Array.isArray(answer)) {
          return answer.some((a) => a);
        }
        return answer !== "";
      });
    },

    totalAttempts: (state) => {
      return state.scores.length;
    },

    averageScore: (state) => {
      if (!state.scores.length) return 0;
      const sum = state.scores.reduce((acc, score) => acc + score, 0);
      return Math.round(sum / state.scores.length);
    },
  },
});
