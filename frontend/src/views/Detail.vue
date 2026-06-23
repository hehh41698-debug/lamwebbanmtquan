<template>
  <div v-if="loading" class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else-if="!product" class="text-center py-5">
    <h3 class="text-danger">Không tìm thấy sản phẩm!</h3>
    <router-link to="/" class="btn btn-primary mt-3">Về trang chủ</router-link>
  </div>

  <div v-else>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link></li>
        <li class="breadcrumb-item active">{{ product.name }}</li>
      </ol>
    </nav>

    <div class="row g-4">
      <div class="col-md-5">
        <img :src="product.image" class="img-fluid rounded shadow" :alt="product.name" 
             style="background: #f8f9fa; padding: 20px;">
      </div>
      <div class="col-md-7">
        <h1 class="display-6 fw-bold">{{ product.name }}</h1>
        <p class="text-muted"><i class="fas fa-tag me-1"></i>{{ product.brand }}</p>
        <h2 class="text-danger">{{ formatPrice(product.price) }}</h2>
        
        <hr>
        
        <h5>📋 Thông số kỹ thuật</h5>
        <table class="table table-bordered">
          <tbody>
            <tr>
              <th style="width: 30%;">CPU</th>
              <td>{{ product.cpu }}</td>
            </tr>
            <tr>
              <th>RAM</th>
              <td>{{ product.ram }}</td>
            </tr>
            <tr>
              <th>Ổ cứng</th>
              <td>{{ product.storage }}</td>
            </tr>
            <tr>
              <th>Màn hình</th>
              <td>{{ product.screen }}</td>
            </tr>
          </tbody>
        </table>
        
        <button @click="addToCart" class="btn btn-success btn-lg w-100" :disabled="adding">
          <i class="fas fa-cart-plus me-2"></i>
          {{ adding ? 'Đang thêm...' : 'Thêm vào giỏ hàng' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const cartStore = useCartStore()

const product = ref(null)
const loading = ref(false)
const adding = ref(false)

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + 'đ'
}

const loadProduct = async () => {
  loading.value = true
  try {
    const id = route.params.id
    const response = await api.get(`/products/${id}`)
    product.value = response.data
  } catch (error) {
    console.error('Lỗi load sản phẩm:', error)
    product.value = null
  } finally {
    loading.value = false
  }
}

const addToCart = async () => {
  if (!product.value) return
  
  adding.value = true
  try {
    await cartStore.addToCart(product.value.id)
    alert(`Đã thêm "${product.value.name}" vào giỏ hàng!`)
  } catch (error) {
    console.error('Lỗi thêm vào giỏ:', error)
  } finally {
    adding.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>