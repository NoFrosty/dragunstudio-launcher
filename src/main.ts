import Vue from 'vue'
import axios from 'axios'
import Buefy from 'buefy'
import AsyncComputed from 'vue-async-computed'

import App from './App.vue'
import router from './router'
import store from './store/store'

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
