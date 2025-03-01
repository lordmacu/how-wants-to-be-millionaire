<template>
    <Modal v-model:visible="localVisible" title="Editar preguntas">
      <div v-if="!isEditing" class="question-list">
        <div
          v-for="question in questions"
          :key="question.id"
          class="question-item"
        >
          <p class="question-text">{{ question.text }}</p>
          <p class="question-prize">
            Premio: {{ findPrizeAmount(question.prizeId) }}
          </p>
          <button class="button button-secondary" @click="editQuestion(question)">
            Editar
          </button>
        </div>
      </div>
      <button class="button button-primary" @click="createQuestion">
        Crear Pregunta
      </button>
      <div v-if="isEditing" class="form-container">
        <label for="questionText">Pregunta</label>
        <input
          id="questionText"
          type="text"
          v-model="localQuestion.text"
          class="input-field"
        />
  
        <label for="questionPrize">Premio</label>
        <select
          id="questionPrize"
          v-model="localQuestion.prizeId"
          class="input-field"
        >
          <option
            v-for="prize in availablePrizes"
            :key="prize.id"
            :value="prize.id"
          >
            {{ prize.amount }}
          </option>
        </select>
  
        <div class="options-container">
          <div
            v-for="(option, index) in localQuestion.options"
            :key="option.letter"
            class="option-item"
          >
            <label :for="`option-${option.letter}`">
              Opcion {{ option.letter }}
            </label>
            <input
              :id="`option-${option.letter}`"
              type="text"
              v-model="option.text"
              class="input-field"
            />
          </div>
        </div>
  
        <label for="correctAnswer">Respuesta correcta</label>
        <select
          id="correctAnswer"
          v-model="localQuestion.correctAnswer"
          class="input-field"
        >
          <option
            v-for="option in localQuestion.options"
            :key="option.letter"
            :value="option.letter"
          >
            {{ option.letter }}
          </option>
        </select>
  
        <div class="button-group">
          <button class="button button-primary" @click="save">
            Guardar
          </button>
          <button class="button button-secondary" @click="cancel">
            Atras
          </button>
        </div>
      </div>
    </Modal>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  import { Modal } from 'usemodal-vue3';
  
  export default {
    name: 'QuestionModal',
    components: { Modal },
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      questions: {
        type: Array,
        required: true
      },
      prizes: {
        type: Array,
        required: true
      }
    },
    emits: ['save', 'cancel', 'edit', 'create', 'update:visible'],
    setup(props, { emit }) {
      const localVisible = computed({
        get: () => props.visible,
        set: (value) => {
          emit('update:visible', value);
        }
      });
  
      const isEditing = ref(false);
      const localQuestion = ref({
        id: 0,
        prizeId: 1,
        text: '',
        options: [
          { letter: 'A', text: '' },
          { letter: 'B', text: '' },
          { letter: 'C', text: '' },
          { letter: 'D', text: '' }
        ],
        correctAnswer: 'A'
      });
  
      const availablePrizes = computed(() => {
        const usedPrizeIds = new Set(
          props.questions
            .filter((q) => !(isEditing.value && q.id === localQuestion.value.id))
            .map((q) => q.prizeId)
        );
        return props.prizes.filter(
          (prize) =>
            !usedPrizeIds.has(prize.id) ||
            (isEditing.value && prize.id === localQuestion.value.prizeId)
        );
      });
  
      const findPrizeAmount = (prizeId) => {
        const prize = props.prizes.find((p) => p.id === prizeId);
        return prize ? prize.amount : '';
      };
  
      const editQuestion = (question) => {
        localQuestion.value = { ...question };
        isEditing.value = true;
        emit('edit', question);
      };
  
      const createQuestion = () => {
        const defaultPrizeId =
          availablePrizes.value.length > 0
            ? availablePrizes.value[0].id
            : props.prizes.length
            ? props.prizes[0].id
            : null;
        localQuestion.value = {
          id: 0,
          prizeId: defaultPrizeId,
          text: '',
          options: [
            { letter: 'A', text: '' },
            { letter: 'B', text: '' },
            { letter: 'C', text: '' },
            { letter: 'D', text: '' }
          ],
          correctAnswer: 'A'
        };
        isEditing.value = true;
        emit('create');
      };
  
      const resetLocalQuestion = () => {
        const defaultPrizeId =
          availablePrizes.value.length > 0
            ? availablePrizes.value[0].id
            : props.prizes.length
            ? props.prizes[0].id
            : null;
        localQuestion.value = {
          id: 0,
          prizeId: defaultPrizeId,
          text: '',
          options: [
            { letter: 'A', text: '' },
            { letter: 'B', text: '' },
            { letter: 'C', text: '' },
            { letter: 'D', text: '' }
          ],
          correctAnswer: 'A'
        };
      };
  
      const save = () => {
        emit('save', localQuestion.value);
        isEditing.value = false;
        resetLocalQuestion();
      };
  
      const cancel = () => {
        isEditing.value = false;
        resetLocalQuestion();
        emit('cancel');
      };
  
      watch(
        () => props.visible,
        (newVal) => {
          if (!newVal) {
            isEditing.value = false;
            resetLocalQuestion();
          }
        }
      );
  
      return {
        localVisible,
        isEditing,
        localQuestion,
        availablePrizes,
        findPrizeAmount,
        editQuestion,
        createQuestion,
        save,
        cancel
      };
    }
  };
  </script>
  
  <style scoped>
  .question-list {
    margin-bottom: 15px;
  }
  
  .question-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .question-text {
    flex: 1;
    font-size: 16px;
    color: #555;
    text-align: left;
  }
  
  .question-prize {
    margin-right: 10px;
    font-size: 14px;
    color: #555;
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 15px;
  }
  
  .input-field {
    padding: 8px;
    border: 1px solid #aaa;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
  }
  
  .options-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .option-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .button-primary {
    background-color: #007bff;
    color: #fff;
  }
  
  .button-secondary {
    background-color: #6c757d;
    color: #fff;
  }
  </style>
  