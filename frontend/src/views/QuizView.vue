<!-- src/views/QuizView.vue -->
<template>
  <div class="max-w-3xl mx-auto">
    <!-- Loading State -->
    <div v-if="quizStore.loading" class="text-center py-12">
      <p class="text-gray-600">Loading quiz questions...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
      <button
        @click="initQuiz"
        class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>

    <div v-else>
      <!-- Quiz Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Capsim Quiz</h1>
      </div>

      <!-- Quiz Content -->
      <div v-if="!quizCompleted">
        <!-- Questions -->
        <div class="space-y-6">
          <QuizCard
            v-for="(question, index) in quizStore.questions"
            :key="index"
            :question="question"
            :questionIndex="index"
            v-model="quizStore.currentAnswers[index]"
          />
        </div>

        <!-- Submit Button -->
        <div class="mt-8">
          <button
            @click="submitQuiz"
            :disabled="!quizStore.isQuizComplete || isSubmitting"
            class="w-full py-3 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :class="[
              quizStore.isQuizComplete && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed',
            ]"
          >
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>Submit Quiz</span>
          </button>
          <p
            v-if="!quizStore.isQuizComplete"
            class="mt-2 text-sm text-red-600 text-center"
          >
            Please answer all questions before submitting
          </p>
        </div>
      </div>

      <!-- Score Display -->
      <div v-else>
        <ScoreDisplay
          :score="score"
          @retake="retakeQuiz"
          @view-report="navigateToReport"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from "@/stores/quiz";
import QuizCard from "@/components/QuizCard.vue";
import ScoreDisplay from "@/components/ScoreDisplay.vue";

export default {
  name: "QuizView",

  components: {
    QuizCard,
    ScoreDisplay,
  },

  setup() {
    const router = useRouter();
    const quizStore = useQuizStore();
    const quizCompleted = ref(false);
    const score = ref(0);
    const error = ref(null);
    const isSubmitting = ref(false);

    const initQuiz = async () => {
      error.value = null;
      quizStore.resetState();
      try {
        await quizStore.fetchQuestions();
      } catch (err) {
        error.value = "Failed to load quiz questions. Please try again.";
      }
    };

    const submitQuiz = async () => {
      if (!quizStore.isQuizComplete || isSubmitting.value) return;

      isSubmitting.value = true;
      error.value = null;

      try {
        const result = await quizStore.submitQuiz();
        score.value = result;
        quizCompleted.value = true;
      } catch (err) {
        error.value = "Failed to submit quiz. Please try again.";
        console.error("Error submitting quiz:", err);
      } finally {
        isSubmitting.value = false;
      }
    };

    const retakeQuiz = () => {
      quizStore.resetState();
      quizStore.initializeAnswers();
      quizCompleted.value = false;
      score.value = 0;
      error.value = null;
      initQuiz();
    };

    const navigateToReport = () => {
      quizStore.resetState();
      router.push("/report");
    };

    onMounted(() => {
      initQuiz();
    });

    onBeforeUnmount(() => {
      quizStore.resetState();
    });

    return {
      quizStore,
      quizCompleted,
      score,
      error,
      isSubmitting,
      submitQuiz,
      retakeQuiz,
      navigateToReport,
      initQuiz,
    };
  },
};
</script>
