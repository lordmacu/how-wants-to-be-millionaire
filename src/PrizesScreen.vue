<template>
  <div class="container">
    <Logo @click="initializeAudio" />

    <!-- Lista de premios filtrados -->
    <div class="premios-container">
      <div
        class="premio"
        v-for="(prize, index) in prizesWithQuestions"
        :key="prize.id"
        :class="{ seguro: prize.isSafe }"
        @click="handlePrizeClick(prize)"
      >
        <div class="premio-nivel">{{ index + 1 }}</div>
        <div class="premio-cantidad">{{ prize.amount }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from './Logo.vue';

export default {
  name: 'PrizesScreen',
  props: {
    prizes: {
      type: Array,
      required: true
    },
    questions: {
      type: Array,
      required: true
    }
  },
  components: {
    Logo,
  },
  data() {
    return {
      mainTheme: null,
      isAudioInitialized: false // Para evitar múltiples activaciones
    };
  },
  computed: {
    /**
     * Devuelve solo los premios que tienen al menos una pregunta asignada.
     * @returns {Array} Array de premios filtrados.
     */
    prizesWithQuestions() {
      return this.prizes.filter(prize =>
        this.questions.some(question => question.prizeId === prize.id)
      );
    }
  },
  methods: {
    /**
     * Método para inicializar el audio cuando el usuario interactúa por primera vez.
     */
    initializeAudio() {
      if (!this.isAudioInitialized) {
        this.isAudioInitialized = true; // Marcar que el audio ya se inició
        this.playMainTheme();
      }
    },

    /**
     * Reproduce la música de fondo.
     */
    playMainTheme() {
      this.mainTheme = new Audio('sounds/main.mp3');
      this.mainTheme.loop = true; // Para que la música siga sonando
      this.mainTheme.volume = 0.5; // Reduce el volumen al 50%

      this.mainTheme.play().catch(error => {
        console.warn("El audio no pudo reproducirse automáticamente:", error);
      });
    },

    /**
     * Detiene la música de fondo.
     */
    stopMainTheme() {
      if (this.mainTheme) {
        this.mainTheme.pause();
        this.mainTheme.currentTime = 0;
      }
    },

    /**
     * Maneja la selección de un premio y asocia la pregunta correspondiente.
     * @param {Object} prize - Objeto del premio seleccionado.
     */
    handlePrizeClick(prize) {
      const linkedQuestion = this.questions.find(
        question => question.prizeId === prize.id
      );
      this.$emit('question-selected', linkedQuestion);
    }
  }
};
</script>
