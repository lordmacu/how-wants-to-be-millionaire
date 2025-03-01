<template>
  <div class="container">
    <!-- Countdown Timer -->
    <div class="countdown">{{ countdown }}</div>

    <Logo />

    <!-- Question container -->
    <div class="question-container">
      <div v-if="selectedQuestion">
        <div class="question-text">{{ selectedQuestion.text }}</div>
      </div>
      <div v-else>
        <p class="no-question">Selecciona un premio para ver la pregunta.</p>
      </div>
    </div>

    <!-- 50/50 Button -->
    <button v-if="!usedFiftyFifty" class="fifty-fifty-btn" @click="applyFiftyFifty">
      🧐 50/50
    </button>

    <button v-if="callFriend" class="fifty-fifty-btn call-friend" @click="playPhone">
      📞 Llamada a un amigo
    </button>
    <button v-if="!!currentPrice" class="fifty-fifty-btn price">
      📞 Premio {{ currentPrice.amount }}
    </button>

    <!-- Options container -->
    <div v-if="selectedQuestion" class="options-container">
      <div 
        class="option" 
        v-for="(option, index) in filteredOptions" 
        :key="index" 
        :class="getOptionClass(option.letter)" 
        @click="selectAnswer(option.letter)">
        <div class="option-letter">{{ option.letter }}:</div>
        <div class="option-text">{{ option.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from './Logo.vue';

export default {
  name: "QuestionScreen",
  props: {
    selectedQuestion: {
      type: Object,
      required: true
    },
    questions: {
      type: Array,
      required: true
    },
    prizes: {
      type: Array,
      required: true
    },
  },
  components: {
    Logo,
  },
  data() {
    return {
      selectedAnswer: null,
      validated: false, // Flag that indicates if the answer has been validated
      countdown: 30,
      timeout: false,
      countdownInterval: null,
      usedFiftyFifty: false,
      callFriend: true,
      filteredOptions: [],
      initialSound: null, // Initial sound variable
      phoneSound: null, // Phone call sound variable
      wrongSound: null, // Wrong answer sound variable
      fineSound: null, // Correct answer sound variable
      finalAnswer: null, // Final answer sound variable
      currentPrize: null // Selected prize variable
    };
  },
  methods: {
    /**
     * Returns the CSS class for an option based on the current state.
     *
     * @param {string} letter - The letter of the option.
     * @returns {string} - The class name to be applied.
     */
    getOptionClass(letter) {
      // Mientras no se valide, la opción seleccionada se muestra en amarillo (clase "selected")
      if (!this.validated && this.selectedAnswer === letter) {
        return "selected";
      }
      // Una vez validado, se marca en verde la respuesta correcta y en rojo la incorrecta
      if (this.validated) {
        if (letter === this.selectedQuestion.correctAnswer) {
          return "correct";
        }
        if (letter === this.selectedAnswer && letter !== this.selectedQuestion.correctAnswer) {
          return "incorrect";
        }
      }
      return "";
    },

    /**
     * Selects an answer. Initially marks it as selected (yellow) and, after a delay,
     * validates the answer, playing the corresponding sound.
     *
     * @param {string} letter - The selected answer letter.
     */
    selectAnswer(letter) {
      if (!this.validated) {
        this.selectedAnswer = letter;
        clearInterval(this.countdownInterval); // Stop the countdown

        // Stop the initial sound if playing
        if (this.initialSound) {
          this.stopInitialSound();
          if (this.phoneSound) {
            this.phoneSound.pause();
            this.phoneSound.currentTime = 0;
          }
        }

        this.playFinalAnswer();

        // After 3 seconds, validate the answer and update the UI color accordingly
        setTimeout(() => {
          this.validated = true;
          if (letter !== this.selectedQuestion.correctAnswer) {
            this.playWrongSound();
          } else {
            this.playFineSound();
          }
          // After additional delay, proceed to the next question
          setTimeout(() => {
            this.nextQuestion();
          }, 2000);
        }, 3000);
      }
    },

    /**
     * Plays the final answer sound.
     */
    playFinalAnswer() {
      this.finalAnswer = new Audio('sounds/finalanswer.mp3');
      this.finalAnswer.play();
    },

    /**
     * Stops the final answer sound.
     */
    stopFinalAnswer() {
      if (this.finalAnswer) {
        this.finalAnswer.pause();
        this.finalAnswer.currentTime = 0;
      }
    },

    /**
     * Stops the correct answer sound.
     */
    stopFineSound() {
      if (this.fineSound) {
        this.fineSound.pause();
        this.fineSound.currentTime = 0;
      }
    },

    /**
     * Stops the wrong answer sound.
     */
    stopWrongSound() {
      if (this.wrongSound) {
        this.wrongSound.pause();
        this.wrongSound.currentTime = 0;
      }
    },

    /**
     * Plays the wrong answer sound.
     */
    playWrongSound() {
      this.wrongSound = new Audio('sounds/wrong.mp3');
      this.wrongSound.play();
    },

    /**
     * Plays the correct answer sound.
     */
    playFineSound() {
      this.fineSound = new Audio('sounds/fine.mp3');
      this.fineSound.play();
    },

    /**
     * Plays the initial sound when the question loads.
     */
    playInitialSound() {
      this.initialSound = new Audio('sounds/initial.mp3');
      this.initialSound.loop = true;
      this.initialSound.play();
    },

    /**
     * Plays the phone call sound and stops the initial sound.
     */
    playPhone() {
      if (this.initialSound) {
        this.initialSound.pause();
      }
      this.phoneSound = new Audio('sounds/phone.mp3');
      this.phoneSound.loop = true;
      this.phoneSound.play();
      this.callFriend = false;
    },

    /**
     * Starts the countdown timer and resets state for a new question.
     */
    startCountdown() {
      this.countdown = 30;
      this.timeout = false;
      this.validated = false;
      this.selectedAnswer = null;
      this.usedFiftyFifty = false;

      // Restore all options at the start of the question
      this.filteredOptions = [...this.selectedQuestion.options];

      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          // On timeout, mark as validated and play wrong sound
          this.timeout = true;
          this.validated = true;
          this.stopInitialSound();
          this.playWrongSound();
          this.nextQuestion();
          clearInterval(this.countdownInterval);
        }
      }, 1000);
    },

    /**
     * Stops the initial sound.
     */
    stopInitialSound() {
      if (this.initialSound) {
        this.initialSound.pause();
        this.initialSound.currentTime = 0;
      }
    },

    /**
     * Applies the 50/50 rule: removes two incorrect options.
     */
    applyFiftyFifty() {
      if (!this.usedFiftyFifty) {
        this.usedFiftyFifty = true;
        const correctAnswer = this.selectedQuestion.correctAnswer;
        const incorrectOptions = this.selectedQuestion.options.filter(option => option.letter !== correctAnswer);
        const selectedIncorrect = incorrectOptions.sort(() => Math.random() - 0.5).slice(0, 1);
        this.filteredOptions = this.selectedQuestion.options.filter(option =>
          option.letter === correctAnswer || selectedIncorrect.some(incorrect => incorrect.letter === option.letter)
        );
      }
    },

    /**
     * Proceeds to the next question.
     */
    nextQuestion() {
      let current = this.questions.findIndex(q => q.text === this.selectedQuestion.text);
      const nextIndex = current + 1;
      console.log(this.questions[nextIndex]);
      if (nextIndex < this.questions.length) {
        setTimeout(() => {
          this.stopFineSound();
          this.stopWrongSound();
          this.usedFiftyFifty = false;
          this.callFriend = true;
          this.stopFinalAnswer();
          // Emit the new question and reset state via startCountdown in el watcher
          this.$emit("question-selected", this.questions[nextIndex]);
        }, 5000);
      } else {
        console.log("No hay más preguntas disponibles.");
      }
    }
  },
  watch: {
    selectedQuestion: {
      immediate: true,
      handler() {
        this.startCountdown();
        this.playInitialSound();
      }
    }
  },
  mounted() {
    this.currentPrice = this.prizes.find(q => q.id === this.selectedQuestion.prizeId);
    console.log(this.currentPrice);
  },
  beforeUnmount() {
    this.stopInitialSound();
    clearInterval(this.countdownInterval);
  }
};
</script>
