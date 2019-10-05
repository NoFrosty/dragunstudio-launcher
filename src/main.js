import Vue from 'vue'
import axios from 'axios'
import Buefy from 'buefy'

import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Buefy)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
  defaultIconPack: 'fas',
}).$mount('#app')
