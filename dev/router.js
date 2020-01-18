import Vue from 'vue'
import VueRouter from 'vue-router'
import { genSliderConfig } from '@/config.js'

import Home from './views/home/main.vue'
import About from './views/about.vue'
import Mine from './views/mine.vue'

import First from './views/home/first.vue'
import Second from './views/home/second.vue'
import Third from './views/home/third.vue'

Vue.use(VueRouter)

const homeParts = [
  { path: 'first', name: 'first', component: First },
  { path: 'second', name: 'second', component: Second },
  { path: 'third', name: 'third', component: Third },
]
const routes = [
  {
    path: '/home',
    name: 'home',
    alias: '/',
    redirect: '/home/first',
    component: Home,
    children: homeParts
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/mine',
    name: 'mine',
    component: Mine,
  }
]

const router = new VueRouter({
  routes
})

genSliderConfig(routes, 2)

export {
  homeParts,
  routes
}

export default router
