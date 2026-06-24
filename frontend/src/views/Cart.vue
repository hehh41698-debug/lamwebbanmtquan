<template>
  <h1 class="display-5 fw-bold mb-4"><i class="fas fa-shopping-cart"></i> Giỏ hàng</h1>
  
  <div v-if="loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else-if="cartStore.items.length === 0" class="text-center py-5">
    <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
    <h3>Giỏ hàng trống</h3>
    <p class="text-muted">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
    <router-link to="/" class="btn btn-primary">Mua sắm ngay</router-link>
  </div>

  <div v-else>
    <div class="table-responsive">
      <table class="table table-hover">
        <thead class="table-dark">
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th style="width: 150px;">Số lượng</th>
            <th>Tạm tính</th>
            <th style="width: 80px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartStore.items" :key="item.id">
            <td>
              <div class="d-flex align-items-center">
                <img :src="item.image" :alt="item.name" class="cart-item-img me-3">
                <div>
                  <strong>{{ item.name }}</strong>
                  <br><small class="text-muted">{{ item.brand }}</small>
                </div>
              </div>
            </td>
            <td>{{ formatPrice(item.price) }}</td>
            <td>
              <div class="d-flex gap-1">
                <button @click="decreaseQuantity(item.id)" class="btn btn-sm btn-outline-secondary">-</button>
                <input type="number" v-model.number="item.quantity" min="1" 
                       class="form-control text-center" style="width: 60px;">
                <button @click="increaseQuantity(item.id)" class="btn btn-sm btn-outline-secondary">+</button>
                <button @click="updateCart(item.id, item.quantity)" class="btn btn-sm btn-primary">
                  <i class="fas fa-sync"></i>
                </button>
              </div>
            </td>
            <td>{{ formatPrice(item.subtotal) }}</td>
            <td>
              <button @click="removeFromCart(item.id)" class="btn btn-sm btn-danger">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-end fw-bold fs-5">Tổng cộng:</td>
            <td colspan="2" class="fw-bold fs-4 text-danger">{{ formatPrice(cartStore.total) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <div class="d-flex justify-content-between flex-wrap gap-2">
      <button @click="clearCart" class="btn btn-outline-danger">
        <i class="fas fa-trash-alt me-1"></i> Xóa giỏ hàng
      </button>
      <div>
        <router-link to="/" class="btn btn-outline-primary me-2">
          <i class="fas fa-arrow-left"></i> Tiếp tục mua
        </router-link>
        <router-link to="/checkout" class="btn btn-success btn-lg">
          <i class="fas fa-check"></i> Đặt hàng
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const loading = ref(false)

const formatPrice = (price) => {
  return price ? price.toLocaleString('vi-VN') + 'đ' : '0đ'
}

const decreaseQuantity = (id) => {
  const item = cartStore.items.find(i => i.id === id)
  if (item && item.quantity > 1) {
    item.quantity--
    updateCart(id, item.quantity)
  }
}

const increaseQuantity = (id) => {
  const item = cartStore.items.find(i => i.id === id)
  if (item) {
    item.quantity++
    updateCart(id, item.quantity)
  }
}

const updateCart = async (id, quantity) => {
  if (quantity <= 0) {
    alert('Số lượng phải lớn hơn 0!')
    return
  }
  loading.value = true
  try {
    await cartStore.updateCart(id, quantity)
  } catch (error) {
    console.error('Lỗi cập nhật:', error)
  } finally {
    loading.value = false
  }
}

const removeFromCart = async (id) => {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    loading.value = true
    try {
      await cartStore.removeFromCart(id)
    } catch (error) {
      console.error('Lỗi xóa:', error)
    } finally {
      loading.value = false
    }
  }
}

const clearCart = async () => {
  if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
    loading.value = true
    try {
      await cartStore.clearCart()
    } catch (error) {
      console.error('Lỗi xóa giỏ hàng:', error)
    } finally {
      loading.value = false
    }
  }
}

onMounted(() => {
  cartStore.loadCart()
})
</script>

<style scoped>
.cart-item-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  background: #f8f9fa;
  padding: 5px;
  border-radius: 8px;
}

.table th {
  background: #1a1a2e;
  color: white;
}

.table td {
  vertical-align: middle;
}
</style>