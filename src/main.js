import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import stock from './store/'

Vue.config.productionTip = false
Vue.use(Vuex)

new Vue({
  el: '#A',
  store: new Vuex.Store(stock),
  components: { App },
  template: '<App/>'
})
