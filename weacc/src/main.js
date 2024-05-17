import Vue from 'vue'
import App from './App.vue'

import router from './router';
import MySelect from '@/components/MySelect.vue';
import './registerServiceWorker'

Vue.config.productionTip = false;
Vue.component("MySelect", MySelect);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
