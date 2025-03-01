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
    { id: 1, amount: "$100" },
    { id: 2, amount: "$200" },
    { id: 3, amount: "$300" },
    { id: 4, amount: "$500" },
    { id: 5, amount: "$1000" },
    { id: 6, amount: "$1000" },
    { id: 7, amount: "$2000" },
    { id: 8, amount: "$4000" },
    { id: 9, amount: "$8000" },
    { id: 10, amount: "$16000" }
    ]);

    const questions = ref([
    {
      id: 1,
      prizeId: 1,
      text: "Según Hebreos 11:1, la fe es:",
      options: [
        { letter: "A", text: "La seguridad de que todo saldrá bien" },
        { letter: "B", text: "Creer en lo que podemos ver y tocar" },
        { letter: "C", text: "La certeza de lo que se espera, la convicción de lo que no se ve" },
        { letter: "D", text: "La confianza en que Dios nos dará lo que pedimos" }
      ],
      correctAnswer: "C"
    },
    {
      id: 2,
      prizeId: 2,
      text: "¿Por qué Abraham es llamado el padre de la fe?",
      options: [
        { letter: "A", text: "Porque tuvo muchos hijos que creyeron en Dios" },
        { letter: "B", text: "Porque creyó en la promesa de Dios incluso cuando parecía imposible" },
        { letter: "C", text: "Porque enseñó a su pueblo sobre la fe" },
        { letter: "D", text: "Porque nunca dudó en ningún momento" }
      ],
      correctAnswer: "B"
    },
    {
      id: 3,
      prizeId: 3,
      text: "Cuando Pedro caminó sobre el agua hacia Jesús, ¿qué pasó?",
      options: [
        { letter: "A", text: "Caminó sin problemas hasta llegar a Jesús" },
        { letter: "B", text: "Comenzó a hundirse cuando tuvo miedo del viento y las olas" },
        { letter: "C", text: "No logró dar ni un solo paso" },
        { letter: "D", text: "Se negó a intentarlo porque era demasiado arriesgado" }
      ],
      correctAnswer: "B"
    },
    {
      id: 4,
      prizeId: 4,
      text: "Cuando Jesús habló con Marta sobre la muerte de su hermano Lázaro, ¿qué le dijo sobre la fe?",
      options: [
        { letter: "A", text: "Si me crees, entenderás por qué murió" },
        { letter: "B", text: "Lázaro volverá si oras con suficiente fe" },
        { letter: "C", text: "El que cree en mí, aunque esté muerto, vivirá" },
        { letter: "D", text: "Dios ha decidido que este sea su destino" }
      ],
      correctAnswer: "C"
    },
    {
      id: 5,
      prizeId: 5,
      text: "Cuando Dios pidió a Abraham que sacrificara a su hijo Isaac, ¿cómo reaccionó?",
      options: [
        { letter: "A", text: "Dijo que buscaría otra alternativa para obedecer" },
        { letter: "B", text: "Se preparó para hacerlo, confiando en que Dios proveiería" },
        { letter: "C", text: "Se negó y pidió otra prueba en su lugar" },
        { letter: "D", text: "Buscó consejo antes de tomar una decisión" }
      ],
      correctAnswer: "B"
    },
    {
      id: 6,
      prizeId: 6,
      text: "¿Por qué Abraham fue considerado justo delante de Dios?",
      options: [
        { letter: "A", text: "Porque cumplió la Ley de Dios a la perfección" },
        { letter: "B", text: "Porque confió en la promesa de Dios antes de verla cumplida" },
        { letter: "C", text: "Porque ofreció sacrificios constantemente" },
        { letter: "D", text: "Porque siempre supo lo que Dios iba a hacer" }
      ],
      correctAnswer: "B"
    },
    {
      id: 7,
      prizeId: 7,
      text: "Cuando los discípulos entraron en pánico por la tormenta en el mar, Jesús les dijo:",
      options: [
        { letter: "A", text: "Oren con más fuerza y el viento se calmará" },
        { letter: "B", text: "¿Por qué tienen miedo, hombres de poca fe?" },
        { letter: "C", text: "No se preocupen, esto es solo una prueba" },
        { letter: "D", text: "Esperen a que pase, todo estará bien" }
      ],
      correctAnswer: "B"
    },
    {
      id: 8,
      prizeId: 8,
      text: "¿Qué le ocurrió a la viuda de Sarepta cuando obedeció la palabra de Elías?",
      options: [
        { letter: "A", text: "Su provisión de harina y aceite nunca se agotó" },
        { letter: "B", text: "Su hijo se convirtió en un líder importante" },
        { letter: "C", text: "Sus riquezas aumentaron" },
        { letter: "D", text: "Fue llevada a un lugar seguro" }
      ],
      correctAnswer: "A"
    },
    {
      id: 9,
      prizeId: 9,
      text: "El centurión romano demostró su fe en Jesús cuando dijo:",
      options: [
        { letter: "A", text: "Si vienes a mi casa, sé que mi siervo sanará" },
        { letter: "B", text: "Solo necesito ver un milagro para creer" },
        { letter: "C", text: "No soy digno de que entres en mi casa, pero di la palabra y mi siervo sanará" },
        { letter: "D", text: "Si es tu voluntad, ven a mi hogar y sánalo" }
      ],
      correctAnswer: "C"
    },
    {
      id: 10,
      prizeId: 10,
      text: "Según Santiago 2:17, ¿cómo debe ser la fe de un creyente?",
      options: [
        { letter: "A", text: "Debe demostrarse con acciones, pues la fe sin obras muerta" },
        { letter: "B", text: "Es suficiente con creer en el corazón" },
        { letter: "C", text: "Debe ser muy fuerte" },
        { letter: "D", text: "La fe mueve montañas" }
      ],
      correctAnswer: "A"
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
