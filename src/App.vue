<template>
  <div id="app">
    <!-- Renderiza el componente actual -->
    <component
      :is="currentScreenComponent"
      :questions="questions"
      :prizes="prizes"
      :selectedQuestion="selectedQuestion"
      ref="componentRef"
      @question-selected="handleQuestionSelected"
    />

    <!-- Uso de los modales separados -->
    <PrizeModal
      :visible="isVisible"
      :prizes="prizes"
      @save="savePrize"
      @cancel="cancelEditing"
      @edit="updatePrize"
      @create="createPrize"
      @update:visible="val => (isVisible = val)"
    />

    <QuestionModal
      :visible="isQuestionVisible"
      :questions="questions"
      :prizes="prizes"
      @save="saveQuestion"
      @cancel="cancelQuestionEditing"
      @edit="updateQuestion"
      @create="createQuestion"
      @update:visible="val => (isQuestionVisible = val)"
    />

    <!-- Botones flotantes con iconos de Font Awesome -->
    <button v-if="currentScreen == 'prizes'" class="floating-button floating-prize" @click="openPrizeModal" title="Editar premios">
      <font-awesome-icon icon="trophy" />
    </button>
    <button v-if="currentScreen == 'prizes'" class="floating-button floating-question" @click="openQuestionModal" title="Editar preguntas">
      <font-awesome-icon icon="pencil-alt" />
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import PrizesScreen from './PrizesScreen.vue';
import QuestionScreen from './QuestionScreen.vue';
import PrizeModal from './PrizeModal.vue';
import QuestionModal from './QuestionModal.vue';

export default {
  name: 'App',
  components: {
    PrizesScreen,
    QuestionScreen,
    PrizeModal,
    QuestionModal
  },
  setup() {
    const componentRef = ref(null);
    const isVisible = ref(false);
    const isQuestionVisible = ref(false);
    const currentScreen = ref('prizes');

    // Listas de premios y preguntas
    const prizes = ref([
      { id: 1, amount: "$ 100.000" },
      { id: 2, amount: "$ 200.000" },
      { id: 3, amount: "$ 300.000" },
      { id: 4, amount: "$ 400.000" },
      { id: 5, amount: "$ 500.000" }
    ]);

    const questions = ref([
      {
        id: 1,
        prizeId: 1,
        text: "¿Cuál es la capital de Francia?",
        options: [
          { letter: "A", text: "Madrid" },
          { letter: "B", text: "Berlín" },
          { letter: "C", text: "París" },
          { letter: "D", text: "Lisboa" }
        ],
        correctAnswer: "C"
      },
      {
        id: 2,
        prizeId: 2,
        text: "¿Cuánto es 5 + 7?",
        options: [
          { letter: "A", text: "10" },
          { letter: "B", text: "12" },
          { letter: "C", text: "15" },
          { letter: "D", text: "20" }
        ],
        correctAnswer: "B"
      },
      {
        id: 3,
        prizeId: 3,
        text: "¿Quién pintó la Mona Lisa?",
        options: [
          { letter: "A", text: "Vincent van Gogh" },
          { letter: "B", text: "Leonardo da Vinci" },
          { letter: "C", text: "Pablo Picasso" },
          { letter: "D", text: "Claude Monet" }
        ],
        correctAnswer: "B"
      }
    ]);

    const selectedQuestion = ref(null);

    const currentScreenComponent = computed(() =>
      currentScreen.value === 'question' ? QuestionScreen : PrizesScreen
    );

    const handleQuestionSelected = (question) => {
      if (componentRef.value && componentRef.value.stopMainTheme) {
        componentRef.value.stopMainTheme();
      }
      selectedQuestion.value = question;
      currentScreen.value = 'question';
    };

    const savePrize = (prize) => {
      if (prize.id === 0) {
        const newId = prizes.value.length
          ? Math.max(...prizes.value.map(p => p.id)) + 1
          : 1;
        prize.id = newId;
        prizes.value.push({ ...prize });
        console.log('New prize created:', prize);
      } else {
        const index = prizes.value.findIndex(p => p.id === prize.id);
        if (index !== -1) {
          prizes.value[index] = { ...prize };
          console.log('Prize updated:', prize);
        }
      }
    };

    const saveQuestion = (question) => {
      if (question.id === 0) {
        const newId = questions.value.length
          ? Math.max(...questions.value.map(q => q.id)) + 1
          : 1;
        question.id = newId;
        questions.value.push({ ...question });
        console.log('New question created:', question);
      } else {
        const index = questions.value.findIndex(q => q.id === question.id);
        if (index !== -1) {
          questions.value[index] = { ...question };
          console.log('Question updated:', question);
        }
      }
    };

    const updatePrize = (prize) => console.log('Edit prize:', prize);
    const createPrize = () => console.log('Create prize');
    const cancelEditing = () => console.log('Cancel prize editing');
    const updateQuestion = (question) => console.log('Edit question:', question);
    const createQuestion = () => console.log('Create question');
    const cancelQuestionEditing = () => console.log('Cancel question editing');

    const openQuestionModal = () => {
      isQuestionVisible.value = true;
    };

    const openPrizeModal = () => {
      isVisible.value = true;
    };

    return {
      currentScreen,
      currentScreenComponent,
      questions,
      prizes,
      selectedQuestion,
      handleQuestionSelected,
      isVisible,
      savePrize,
      updatePrize,
      createPrize,
      cancelEditing,
      isQuestionVisible,
      saveQuestion,
      updateQuestion,
      createQuestion,
      cancelQuestionEditing,
      openQuestionModal,
      openPrizeModal,
      componentRef
    };
  }
};
</script>

<style scoped>
/* Estilos para botones flotantes */
.floating-button {
  position: fixed;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.floating-prize {
  background-color: #28a745;
  color: #fff;
  right: 100px;
  top: 20px;
}

.floating-question {
  background-color: #007bff;
  color: #fff;
  right: 20px;
  top: 20px;
}
</style>
