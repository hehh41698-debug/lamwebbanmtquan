<template>
  <div class="card h-100 shadow-sm">
    <img :src="product.image" class="card-img-top p-3" :alt="product.name" />
    <div class="card-body">
      <h5 class="card-title text-truncate">{{ product.name }}</h5>
      <p class="card-text text-muted small">{{ product.brand }}</p>
      <p class="card-text fw-bold text-danger fs-5">
        {{ formatPrice(product.price) }}
      </p>
      <router-link :to="`/product/${product.id}`" class="btn btn-primary w-100">
        <i class="fas fa-eye me-1"></i> Xem chi tiết
      </router-link>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + 'đ'
}
</script>

<style scoped>
.card {
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

.card-img-top {
  background: #f8f9fa;
  height: 200px;
  object-fit: contain;
}

.card-title {
  min-height: 48px;
  font-size: 1rem;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
</style>