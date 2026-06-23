import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const count = ref(0)
  const total = ref(0)

  const getCount = computed(() => count.value)
  const getTotal = computed(() => total.value)
  const getItems = computed(() => items.value)

  // Load giỏ hàng từ server
  const loadCart = async () => {
    try {
      const response = await api.get('/cart')
      items.value = response.data.items || []
      total.value = response.data.total || 0
      count.value = response.data.count || 0
    } catch (error) {
      console.error('Lỗi load giỏ hàng:', error)
    }
  }

  // Thêm vào giỏ hàng
  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart/add', { id: productId, quantity })
      await loadCart()
      return true
    } catch (error) {
      console.error('Lỗi thêm vào giỏ hàng:', error)
      return false
    }
  }

  // Cập nhật giỏ hàng
  const updateCart = async (productId, quantity) => {
    try {
      await api.post('/cart/update', { id: productId, quantity })
      await loadCart()
      return true
    } catch (error) {
      console.error('Lỗi cập nhật giỏ hàng:', error)
      return false
    }
  }

  // Xóa khỏi giỏ hàng
  const removeFromCart = async (productId) => {
    try {
      await api.post('/cart/remove', { id: productId })
      await loadCart()
      return true
    } catch (error) {
      console.error('Lỗi xóa khỏi giỏ hàng:', error)
      return false
    }
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      await api.post('/cart/clear')
      await loadCart()
      return true
    } catch (error) {
      console.error('Lỗi xóa giỏ hàng:', error)
      return false
    }
  }

  return {
    items,
    count,
    total,
    getCount,
    getTotal,
    getItems,
    loadCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart
  }
})