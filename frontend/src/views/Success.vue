<template>
  <div class="text-center py-5">
    <i class="fas fa-check-circle text-success" style="font-size: 5rem;"></i>
    <h1 class="display-4 fw-bold text-success mt-3">Đặt hàng thành công!</h1>
    <p class="lead">Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ sớm nhất.</p>
    
    <div class="card shadow mx-auto" style="max-width: 500px;">
      <div class="card-body text-start">
        <h5>📋 Thông tin đặt hàng:</h5>
        <p><strong>Họ tên:</strong> {{ orderInfo.fullname }}</p>
        <p><strong>Số điện thoại:</strong> {{ orderInfo.phone }}</p>
        <p><strong>Địa chỉ:</strong> {{ orderInfo.address }}</p>
        <p v-if="orderInfo.note"><strong>Ghi chú:</strong> {{ orderInfo.note }}</p>
      </div>
    </div>
    
    <div class="mt-4">
      <router-link to="/" class="btn btn-primary btn-lg">
        <i class="fas fa-home me-2"></i>Về trang chủ
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const orderInfo = ref({
  fullname: '',
  phone: '',
  address: '',
  note: ''
})

onMounted(() => {
  const data = localStorage.getItem('orderInfo')
  if (data) {
    orderInfo.value = JSON.parse(data)
  }
})
</script>

<style scoped>
.fa-check-circle {
  animation: scaleIn 0.6s ease;
}

@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>