import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useQuizStore } from "@/stores/quiz";

describe("Quiz Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes with default state", () => {
    const store = useQuizStore();
    expect(store.questions).toEqual([]);
    expect(store.scores).toEqual([]);
    expect(store.distribution).toEqual(new Array(10).fill(0));
    expect(store.currentAnswers).toBeNull();
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it("calculates score correctly for single choice questions", () => {
    const store = useQuizStore();
    store.questions = [
      {
        type: "Single",
        answers: [
          { text: "Correct", points: 5 },
          { text: "Wrong", points: 0 },
        ],
      },
    ];
    store.currentAnswers = ["Correct"];
    expect(store.calculateScore()).toBe(100);
  });

  it("calculates score correctly for multiple choice questions", () => {
    const store = useQuizStore();
    store.questions = [
      {
        type: "Multiple",
        answers: [
          { text: "Correct1", points: 1 },
          { text: "Wrong", points: 0 },
          { text: "Correct2", points: 1 },
        ],
      },
    ];
    store.currentAnswers = [[true, false, true]];
    expect(store.calculateScore()).toBe(100);
  });

  it("handles quiz submission correctly", async () => {
    const store = useQuizStore();
    store.questions = [
      {
        type: "Single",
        answers: [{ text: "Answer", points: 5 }],
      },
    ];
    store.currentAnswers = ["Answer"];

    const score = await store.submitQuiz();
    expect(score).toBe(100);
    expect(store.scores).toContain(100);
  });

  it("resets state correctly", () => {
    const store = useQuizStore();
    store.questions = [{ type: "Single" }];
    store.currentAnswers = ["Answer"];
    store.error = "Some error";

    store.resetState();
    expect(store.questions).toEqual([]);
    expect(store.currentAnswers).toBeNull();
    expect(store.error).toBeNull();
  });
});
