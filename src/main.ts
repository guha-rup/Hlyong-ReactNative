import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { IonicVue } from '@ionic/vue';
// import { defineCustomElements } from '@ionic/pwa-elements/loader';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import i18n from "./lang/lang"

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/style.css';

const app = createApp(App)
  .use(IonicVue)
  .use(router);

/* External Pluggins */
import store from '@/store/index';
import axios from 'axios';
import VueAxios from 'vue-axios';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

app.use(store);
app.use(VueAxios, axios);
app.use(ElementPlus);
app.use(i18n);

/* components */
import Master from "@/views/layouts/Master.vue";
import Layout from "@/views/layouts/Auth.vue";
app.component("layout", Layout).component("master", Master);
  
router.isReady().then(() => {
  app.mount('#app');
  // defineCustomElements(window);  // Initialize PWA elements after mounting the app
});
