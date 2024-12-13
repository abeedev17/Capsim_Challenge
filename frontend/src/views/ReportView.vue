<!-- src/views/ReportView.vue -->
<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <!-- Report Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">
          Score Distribution Report
        </h1>
        <p class="mt-2 text-gray-600">
          Overview of all quiz attempts and their scores
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Loading score distribution...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500">{{ error }}</p>
        <button
          @click="fetchData"
          class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>

      <template v-else>
        <!-- Statistics Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-blue-600">Total Attempts</h3>
            <p class="mt-2 text-2xl font-semibold text-blue-900">
              {{ totalAttempts }}
            </p>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-green-600">Average Score</h3>
            <p class="mt-2 text-2xl font-semibold text-green-900">
              {{ averageScore }}%
            </p>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-purple-600">Highest Score</h3>
            <p class="mt-2 text-2xl font-semibold text-purple-900">
              {{ highestScore }}%
            </p>
          </div>
        </div>

        <!-- Chart -->
        <div class="h-96">
          <Bar
            v-if="chartData && !loading"
            :data="chartData"
            :options="chartOptions"
          />
        </div>

        <!-- No Data State -->
        <div v-if="totalAttempts === 0" class="text-center py-12">
          <p class="text-gray-500">
            No quiz attempts yet. Take the quiz to see the distribution!
          </p>
          <button
            @click="navigateToQuiz"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Take Quiz
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from "@/stores/quiz";
import { Bar } from "vue-chartjs";
import DataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  DataLabels
);

export default {
  name: "ReportView",

  components: {
    Bar,
  },

  setup() {
    const router = useRouter();
    const quizStore = useQuizStore();
    const loading = ref(false);
    const error = ref(null);
    const distribution = ref(new Array(10).fill(0));

    const totalAttempts = computed(() => {
      if (!distribution.value) return 0;
      return distribution.value.reduce((sum, count) => sum + count, 0);
    });

    const averageScore = computed(() => {
      if (!distribution.value || totalAttempts.value === 0) return 0;
      let totalScore = 0;
      distribution.value.forEach((count, index) => {
        totalScore += count * (index * 10 + 5);
      });
      return Math.round(totalScore / totalAttempts.value);
    });

    const highestScore = computed(() => {
      if (!distribution.value) return 0;
      for (let i = distribution.value.length - 1; i >= 0; i--) {
        if (distribution.value[i] > 0) {
          return (i + 1) * 10;
        }
      }
      return 0;
    });

    const maxValue = computed(() => {
      if (!distribution.value) return 0;
      return Math.max(...distribution.value);
    });

    const chartData = computed(() => ({
      labels: [
        "90-100%",
        "80-90%",
        "70-80%",
        "60-70%",
        "50-60%",
        "40-50%",
        "30-40%",
        "20-30%",
        "10-20%",
        "0-10%",
      ],
      datasets: [
        {
          label: "Number of Students",
          data: distribution.value ? [...distribution.value].reverse() : [],
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 1,
        },
      ],
    }));

    const chartOptions = computed(() => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          right: 50,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
          },
          title: {
            display: true,
            text: "Number of Students",
            font: {
              size: 14,
              weight: "500",
            },
            padding: { top: 10 },
          },
          ticks: {
            stepSize: 1,
          },
          max: maxValue.value + 1,
        },
        y: {
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: "Score Ranges",
            font: {
              size: 14,
              weight: "500",
            },
          },
          reverse: false,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        datalabels: {
          color: "#666",
          anchor: "end",
          align: "right",
          offset: 4,
          clamp: true,
          clip: false,
          font: {
            weight: "bold",
            size: 12,
          },
          padding: {
            left: 10,
          },
          formatter: (value) => value || "",
        },
      },
    }));

    const fetchData = async () => {
      loading.value = true;
      error.value = null;
      try {
        const data = await quizStore.fetchDistribution();
        distribution.value = data || new Array(10).fill(0);
      } catch (err) {
        error.value = "Failed to load score distribution. Please try again.";
        console.error("Error fetching distribution:", err);
        distribution.value = new Array(10).fill(0);
      } finally {
        loading.value = false;
      }
    };

    const navigateToQuiz = () => {
      quizStore.resetState();
      router.push("/");
    };

    onMounted(() => {
      fetchData();
    });

    return {
      loading,
      error,
      chartData,
      chartOptions,
      totalAttempts,
      averageScore,
      highestScore,
      fetchData,
      navigateToQuiz,
    };
  },
};
</script>
