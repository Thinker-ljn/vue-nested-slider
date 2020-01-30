import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { setupRoute } from '@/slider.js'

Vue.config.productionTip = false

Vue.use(setupRoute(router, 2))

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
