import Vue from 'vue'
import axios from 'axios'
import Buefy from 'buefy'
import App from './App.vue'
import router from './router'
import store from './store/store'
import { asValue, asClass } from 'awilix'
import services from '@/services/services'
const bspatch = require('bspatch');
const AsyncComputed = require('vue-async-computed').default
var CryptoJS = require("crypto-js");


Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$services = services

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