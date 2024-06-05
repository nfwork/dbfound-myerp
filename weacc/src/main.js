import Vue from 'vue'
import App from './App.vue'

import router from './router';
import MySelect from '@/components/MySelect.vue';
import MyCalendar from '@/components/MyCalendar.vue';
import 'vant/lib/index.css';
import { Popup, RadioGroup, Radio, Switch} from 'vant';

Vue.config.productionTip = false;
Vue.component("MySelect", MySelect);
Vue.component("MyCalendar", MyCalendar);
Vue.use(Popup);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Switch);

Vue.filter('currency', function(value) {
  if (value == 0) return "0.00";
  if (!value) return '';
  const stringValue = String(value).trim();
  const regExp = /(\d{1,3})(?=(\d{3})+(?:$|\D))/g;
  let formattedValue = stringValue.replace(regExp, '$1,');
  let index =formattedValue.indexOf(".");
  if(index < 0){
    formattedValue = formattedValue +".00"
  }else if(index == formattedValue.length - 2){
    formattedValue = formattedValue +"0"
  }
  return formattedValue;
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
