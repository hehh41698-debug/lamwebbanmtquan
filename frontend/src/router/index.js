import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import Success from '../views/Success.vue'
import Admin from '../views/Admin.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/product/:id', name: 'Detail', component: Detail },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/success', name: 'Success', component: Success },
  { path: '/admin', name: 'Admin', component: Admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router