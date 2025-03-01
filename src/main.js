import { createApp } from 'vue';
import App from './App.vue';
import './assets/scss/styles.scss'

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrophy, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTrophy, faPencilAlt);

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
