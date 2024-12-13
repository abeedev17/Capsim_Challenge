import { vi } from "vitest";

vi.mock("chart.js", () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  BarElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
}));

vi.mock("chartjs-plugin-datalabels", () => ({
  default: vi.fn(),
}));
