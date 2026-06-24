import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const count = ref(0)
  const total = ref(0)

  const loadCart = async () => {
    try {
      const res = await api.get('/cart')
      items.value = res.data.items || []
      total.value = res.data.total || 0
      count.value = res.data.count || 0
    } catch (error) {
      console.error('Lỗi load cart:', error)
    }
  }

  const addToCart = async (id, quantity = 1) => {
    try {
      await api.post('/cart/add', { id, quantity })
      await loadCart()
      return true
    } catch (error) {
      console.error('Lỗi thêm cart:', error)
      return false
    }
  }

  const updateCart = async (id, quantity) => {
    try {
      await api.post('/cart/update', { id, quantity })
      await loadCart()
      return true
    } catch (error) {
      console.error('Lỗi update cart:', error)
      return false
    }
  }

  const removeFromCart = async (id) => {
    try {
      await api.post('/cart/remove', { id })
      await loadCart()
      return true
    } catch (error) {
      console.error('Lỗi remove cart:', error)
      return false
    }
  }

  const clearCart = async () => {
    try {
      await api.post('/cart/clear')
      await loadCart()
      return true
    } catch (error) {
      console.error('Lỗi clear cart:', error)
      return false
    }
  }

  return { items, count, total, loadCart, addToCart, updateCart, removeFromCart, clearCart }
})