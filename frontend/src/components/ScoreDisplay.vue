<template>
  <div class="bg-white rounded-lg shadow-sm p-8 text-center">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>

    <div class="w-32 h-32 mx-auto mb-6 relative">
      <div
        class="w-full h-full rounded-full bg-blue-100 flex items-center justify-center"
      >
        <div class="text-3xl font-bold text-blue-600">{{ score }}%</div>
      </div>
    </div>

    <p class="text-lg text-gray-700 mb-6">
      {{ scoreMessage }}
    </p>

    <div class="space-x-4">
      <button
        @click="$emit('retake')"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Take Quiz Again
      </button>

      <button
        @click="$emit('view-report')"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        View Report
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "ScoreDisplay",

  props: {
    score: {
      type: Number,
      required: true,
    },
  },

  emits: ["retake", "view-report"],

  setup(props) {
    const scoreMessage = computed(() => {
      if (props.score >= 90)
        return "Excellent! You have a great understanding!";
      if (props.score >= 70) return "Good job! You're doing well!";
      if (props.score >= 50) return "You're on the right track. Keep learning!";
      return "Keep practicing. You'll get better!";
    });

    return {
      scoreMessage,
    };
  },
};
</script>
