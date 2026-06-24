<template>
  <div>
    <div class="text-center mb-4">
      <h1 class="display-4 fw-bold text-primary">🖥️ Laptop & PC</h1>
      <p class="text-muted">Khám phá những sản phẩm công nghệ tốt nhất</p>
    </div>

    <!-- Tìm kiếm và lọc -->
    <div class="row g-2 mb-4">
      <div class="col-md-6">
        <input type="text" v-model="searchText" class="form-control" 
               placeholder="Tìm kiếm sản phẩm..." @keyup.enter="searchProducts">
      </div>
      <div class="col-md-4">
        <select v-model="selectedBrand" class="form-select" @change="searchProducts">
          <option value="">Tất cả thương hiệu</option>
          <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <button @click="searchProducts" class="btn btn-primary w-100">
          <i class="fas fa-search"></i> Tìm
        </button>
      </div>
    </div>

    <!-- Danh sách sản phẩm -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="products.length === 0" class="text-center py-5">
      <h3 class="text-muted">😅 Không có sản phẩm nào</h3>
      <p class="text-muted">Vui lòng kiểm tra kết nối với server</p>
      <button @click="loadProducts" class="btn btn-primary mt-3">
        <i class="fas fa-sync me-1"></i> Tải lại
      </button>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="text-center py-5">
      <h3 class="text-muted">😅 Không tìm thấy sản phẩm phù hợp</h3>
    </div>

    <div v-else class="row g-4">
      <div v-for="product in filteredProducts" :key="product.id" class="col-lg-3 col-md-4 col-sm-6">
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api'
import ProductCard from '../components/ProductCard.vue'

const products = ref([])
const brands = ref([])
const searchText = ref('')
const selectedBrand = ref('')
const loading = ref(false)

const filteredProducts = computed(() => {
  let result = products.value
  
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.brand.toLowerCase().includes(search)
    )
  }
  
  if (selectedBrand.value) {
    result = result.filter(p => p.brand === selectedBrand.value)
  }
  
  return result
})

const loadProducts = async () => {
  loading.value = true
  try {
    const response = await api.get('/products')
    console.log('📦 Đã nhận:', response.data.length, 'sản phẩm')
    products.value = response.data
  } catch (error) {
    console.error('❌ Lỗi load sản phẩm:', error)
    products.value = []
    alert('Không thể kết nối đến server! Vui lòng kiểm tra backend.')
  } finally {
    loading.value = false
  }
}

const loadBrands = async () => {
  try {
    const response = await api.get('/brands')
    brands.value = response.data
  } catch (error) {
    console.error('❌ Lỗi load thương hiệu:', error)
  }
}

const searchProducts = () => {
  // computed sẽ tự động cập nhật
}

onMounted(() => {
  loadProducts()
  loadBrands()
})
</script>