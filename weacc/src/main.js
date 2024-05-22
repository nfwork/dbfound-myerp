import Vue from 'vue'
import App from './App.vue'

import router from './router';
import MySelect from '@/components/MySelect.vue';
import 'vant/lib/index.css';

Vue.config.productionTip = false;
Vue.component("MySelect", MySelect);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
