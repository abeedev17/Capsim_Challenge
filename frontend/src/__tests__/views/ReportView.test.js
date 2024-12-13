import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { createRouter, createWebHistory } from "vue-router";
import ReportView from "@/views/ReportView.vue";

vi.mock("vue-chartjs", () => ({
  Bar: {
    name: "Bar",
    template: "<div>Mocked Chart</div>",
  },
}));

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: {} },
    { path: "/report", component: {} },
  ],
});

describe("ReportView", () => {
  const mountReportView = (initialState = {}) => {
    return mount(ReportView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              quiz: {
                distribution: new Array(10).fill(0),
                loading: false,
                error: null,
                ...initialState,
              },
            },
          }),
          router,
        ],
        stubs: {
          Bar: true,
        },
      },
    });
  };

  it("shows loading state", async () => {
    const wrapper = mountReportView({ loading: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Loading score distribution");
  });

  it("navigates to quiz on button click", async () => {
    const wrapper = mountReportView();
    await wrapper.vm.$nextTick();
    await wrapper.vm.navigateToQuiz();
    expect(router.currentRoute.value.path).toBe("/");
  });
});
