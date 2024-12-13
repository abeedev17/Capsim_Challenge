<template>
  <div class="bg-white rounded-lg shadow-sm p-6 mb-4">
    <h3 class="text-lg font-medium text-gray-900 mb-4">{{ question.text }}</h3>

    <div v-if="question.type === 'Single'" class="space-y-3">
      <label
        v-for="(answer, index) in question.answers"
        :key="index"
        class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
      >
        <input
          type="radio"
          :name="'question-' + questionIndex"
          :value="answer.text"
          v-model="localAnswer"
          class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
        <span class="ml-3 text-gray-700">{{ answer.text }}</span>
      </label>
    </div>

    <!-- Multiple Choice Questions -->
    <div v-else class="space-y-3">
      <label
        v-for="(answer, index) in question.answers"
        :key="index"
        class="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
      >
        <input
          type="checkbox"
          v-model="localAnswer[index]"
          class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span class="ml-3 text-gray-700">{{ answer.text }}</span>
      </label>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "QuizCard",

  props: {
    question: {
      type: Object,
      required: true,
    },
    questionIndex: {
      type: Number,
      required: true,
    },
    modelValue: {
      type: [String, Array],
      required: true,
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const localAnswer = ref(props.modelValue);

    watch(localAnswer, (newValue) => {
      emit("update:modelValue", newValue);
    });

    watch(
      () => props.modelValue,
      (newValue) => {
        localAnswer.value = newValue;
      }
    );

    return {
      localAnswer,
    };
  },
};
</script>
