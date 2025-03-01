<template>
    <Modal v-model:visible="localVisible" title="Editar premios">
      <div v-if="!isEditing" class="prize-list">
        <div v-for="prize in prizes" :key="prize.id" class="prize-item">
          <span class="prize-amount">{{ prize.amount }}</span>
          <button class="button button-secondary" @click="editPrize(prize)">
            Editar
          </button>
        </div>
      </div>
      <button class="button button-primary" @click="createPrize">
        Crear Premio
      </button>
      <div v-if="isEditing" class="form-container">
        <label for="prizeAmount">Premio</label>
        <input
          id="prizeAmount"
          type="text"
          v-model="localPrize.amount"
          class="input-field"
        />
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
  import { ref, watch, computed } from 'vue';
  import { Modal } from 'usemodal-vue3';
  
  /**
   * PrizeModal component
   * @component
   * @prop {Boolean} visible - Controla la visibilidad del modal.
   * @prop {Array} prizes - Lista de premios.
   * @emits save - Emite el premio al guardar.
   * @emits cancel - Emite al cancelar la edición.
   * @emits edit - Emite cuando se selecciona editar un premio.
   * @emits create - Emite cuando se inicia la creación de un premio.
   * @emits update:visible - Emite la actualización de la visibilidad.
   */
  export default {
    name: 'PrizeModal',
    components: { Modal },
    props: {
      visible: {
        type: Boolean,
        required: true
      },
      prizes: {
        type: Array,
        required: true
      }
    },
    emits: ['save', 'cancel', 'edit', 'create', 'update:visible'],
    setup(props, { emit }) {
      // Propiedad computada para gestionar la visibilidad de forma bidireccional.
      const localVisible = computed({
        get: () => props.visible,
        set: (value) => {
          emit('update:visible', value);
        }
      });
  
      const isEditing = ref(false);
      const localPrize = ref({ id: 0, level: 0, amount: null });
  
      /**
       * Inicia la edición de un premio.
       * @param {Object} prize - Premio a editar.
       */
      const editPrize = (prize) => {
        localPrize.value = { ...prize };
        isEditing.value = true;
        emit('edit', prize);
      };
  
      /**
       * Inicia la creación de un nuevo premio.
       */
      const createPrize = () => {
        localPrize.value = { id: 0, level: 0, amount: null };
        isEditing.value = true;
        emit('create');
      };
  
      /**
       * Guarda el premio y emite el evento 'save'.
       */
      const save = () => {
        emit('save', localPrize.value);
        isEditing.value = false;
        localPrize.value = { id: 0, level: 0, amount: null };
      };
  
      /**
       * Cancela la edición/creación y emite el evento 'cancel'.
       */
      const cancel = () => {
        isEditing.value = false;
        localPrize.value = { id: 0, level: 0, amount: null };
        emit('cancel');
      };
  
      // Reinicia el estado interno si el modal se cierra desde fuera.
      watch(
        () => props.visible,
        (newVal) => {
          if (!newVal) {
            isEditing.value = false;
            localPrize.value = { id: 0, level: 0, amount: null };
          }
        }
      );
  
      return { localVisible, isEditing, localPrize, editPrize, createPrize, save, cancel };
    }
  };
  </script>
  
  <style scoped>
  .prize-list {
    margin-bottom: 15px;
  }
  
  .prize-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .prize-amount {
    flex: 1;
    font-size: 16px;
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
  