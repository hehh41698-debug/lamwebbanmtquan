<template>
  <h1 class="display-5 fw-bold mb-4"><i class="fas fa-clipboard-check"></i> Thanh toán</h1>

  <div class="row g-4">
    <div class="col-md-7">
      <div class="card shadow">
        <div class="card-body">
          <h5 class="card-title">Thông tin đặt hàng</h5>
          <form @submit.prevent="submitOrder">
            <div class="mb-3">
              <label class="form-label">Họ và tên <span class="text-danger">*</span></label>
              <input type="text" v-model="order.fullname" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
              <input type="tel" v-model="order.phone" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
              <input type="text" v-model="order.address" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Ghi chú</label>
              <textarea v-model="order.note" class="form-control" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-success btn-lg w-100" :disabled="submitting">
              <i class="fas fa-check me-2"></i>
              {{ submitting ? 'Đang xử lý...' : 'Xác nhận đặt hàng' }}
            </button>
          </form>
        </div>
      </div>
    </div>
    
    <div class="col-md-5">
      <div class="card shadow">
        <div class="card-body">
          <h5 class="card-title">Đơn hàng</h5>
          <hr>
          <div v-for="item in cartStore.items" :key="item.id" class="d-flex justify-content-between mb-2">
            <span>{{ item.name }} x {{ item.quantity }}</span>
            <span>{{ formatPrice(item.subtotal) }}</span>
          </div>
          <hr>
          <div class="d-flex justify-content-between fs-5 fw-bold">
            <span>Tổng cộng:</span>
            <span class="text-danger">{{ formatPrice(cartStore.total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import api from '../api'

const router = useRouter()
const cartStore = useCartStore()

const submitting = ref(false)
const order = ref({
  fullname: '',
  phone: '',
  address: '',
  note: ''
})

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + 'đ'
}

const submitOrder = async () => {
  if (!order.value.fullname || !order.value.phone || !order.value.address) {
    alert('Vui lòng điền đầy đủ thông tin!')
    return
  }
  
  submitting.value = true
  try {
    const orderData = {
      ...order.value,
      items: cartStore.items,
      total: cartStore.total
    }
    
    await api.post('/checkout', orderData)
    
    // Lưu thông tin đơn hàng để hiển thị ở trang success
    localStorage.setItem('orderInfo', JSON.stringify(order.value))
    
    // Xóa giỏ hàng
    await cartStore.clearCart()
    
    // Chuyển đến trang thành công
    router.push('/success')
  } catch (error) {
    console.error('Lỗi đặt hàng:', error)
    alert('Có lỗi xảy ra khi đặt hàng!')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (cartStore.items.length === 0) {
    router.push('/cart')
  }
})
</script>