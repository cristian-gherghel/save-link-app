import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import './styles/helper-classes.scss';
import router from './router';
import store from './store';
import '../src/styles/thems.scss';
import { clickOutside } from './utils.js';

const app = createApp(App);

app.directive('clickOutside', clickOutside);

app.use(store);
app.use(router);

app.mount('#app');
