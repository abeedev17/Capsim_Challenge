import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { createRouter, createWebHistory } from "vue-router";
import QuizView from "@/views/QuizView.vue";
import { useQuizStore } from "@/stores/quiz";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: {} },
    { path: "/report", component: {} },
  ],
});

describe("QuizView", () => {
  const mountQuizView = (initialState = {}) => {
    return mount(QuizView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              quiz: {
                questions: [
                  {
                    text: "Test Question",
                    type: "Single",
                    answers: [
                      { text: "Answer 1", points: 5 },
                      { text: "Answer 2", points: 0 },
                    ],
                  },
                ],
                currentAnswers: [""],
                loading: false,
                error: null,
                ...initialState,
              },
            },
          }),
          router,
        ],
      },
    });
  };

  it("renders correctly", async () => {
    const wrapper = mountQuizView();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("h1").text()).toContain("Capsim Quiz");
  });

  it("shows loading state", async () => {
    const wrapper = mountQuizView({ loading: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Loading quiz questions");
  });

  it("disables submit button when quiz is incomplete", async () => {
    const wrapper = mountQuizView();
    await wrapper.vm.$nextTick();
    const submitButton = wrapper.find("button");
    expect(submitButton.attributes("disabled")).toBeDefined();
  });

  it("enables submit button when quiz is complete", async () => {
    const wrapper = mountQuizView({
      currentAnswers: ["Answer 1"],
    });
    await wrapper.vm.$nextTick();
    const submitButton = wrapper.find("button");
    expect(submitButton.attributes("disabled")).toBeUndefined();
  });
});
