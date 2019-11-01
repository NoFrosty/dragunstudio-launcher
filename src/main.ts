import Vue from 'vue'
import axios from 'axios'
import Buefy from 'buefy'
import AsyncComputed from 'vue-async-computed'
import App from './App.vue'
import router from './router'
import store from './store/store'
import container from '@/container'
import { asValue } from 'awilix'
import { registerServices } from '@/services/services'

container.register({
     store: asValue(store)
});
registerServices(container);

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.use(Buefy)
Vue.use(AsyncComputed)
/* eslint-disable no-new */
new Vue({
  router,
  store,
  beforeCreate(){
    this.$store.commit('initialiseStore')
  },
  render: h => h(App),
  //defaultIconPack: 'fas',
}).$mount('#window')
