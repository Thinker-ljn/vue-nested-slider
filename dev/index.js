import Vue from 'vue'
import App from './App.vue'
import router from './router'
import SliderView from '@/index.vue'

Vue.config.productionTip = false

Vue.component('slider-view', SliderView)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
