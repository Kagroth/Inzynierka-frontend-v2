import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate'
import VueHighlightJS from 'vue-highlightjs'
 
// Tell Vue.js to use vue-highlightjs
Vue.use(VueHighlightJS)
Vue.use(Vuelidate)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  vuetify,

  created () {
    window.addEventListener('beforeunload', this.pageUnloadHandler)
    this.$store.commit('auth/init')
  },

  methods: {
    pageUnloadHandler () {
      this.$store.commit('auth/init')
    }
  },
  
  render: h => h(App)
}).$mount('#app')
