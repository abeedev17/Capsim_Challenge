import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Quiz",
    component: () => import("../views/QuizView.vue"),
  },
  {
    path: "/report",
    name: "Report",
    component: () => import("../views/ReportView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
