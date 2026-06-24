<template>
  <div>
    <h1 class="display-5 fw-bold mb-4"><i class="fas fa-cog"></i> Quản trị sản phẩm</h1>
    
    <!-- Form thêm sản phẩm -->
    <div class="card shadow mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0"><i class="fas fa-plus me-2"></i>Thêm sản phẩm mới</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="addProduct">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Tên sản phẩm <span class="text-danger">*</span></label>
              <input type="text" v-model="newProduct.name" class="form-control" required>
            </div>
            <div class="col-md-2">
              <label class="form-label">Thương hiệu <span class="text-danger">*</span></label>
              <input type="text" v-model="newProduct.brand" class="form-control" required>
            </div>
            <div class="col-md-2">
              <label class="form-label">Giá (VNĐ) <span class="text-danger">*</span></label>
              <input type="number" v-model="newProduct.price" class="form-control" required>
            </div>
            <div class="col-md-4">
              <label class="form-label">URL hình ảnh</label>
              <input type="url" v-model="newProduct.image" class="form-control" placeholder="https://example.com/image.jpg">
            </div>
            <div class="col-md-3">
              <label class="form-label">CPU</label>
              <input type="text" v-model="newProduct.cpu" class="form-control" placeholder="Intel Core i7">
            </div>
            <div class="col-md-3">
              <label class="form-label">RAM</label>
              <input type="text" v-model="newProduct.ram" class="form-control" placeholder="16GB DDR4">
            </div>
            <div class="col-md-3">
              <label class="form-label">Ổ cứng</label>
              <input type="text" v-model="newProduct.storage" class="form-control" placeholder="512GB SSD">
            </div>
            <div class="col-md-3">
              <label class="form-label">Màn hình</label>
              <input type="text" v-model="newProduct.screen" class="form-control" placeholder="15.6 inch FHD">
            </div>
            <div class="col-12">
              <button type="submit" class="btn btn-success" :disabled="adding">
                <i class="fas fa-plus me-2"></i>
                {{ adding ? 'Đang thêm...' : 'Thêm sản phẩm' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Danh sách sản phẩm -->
    <div class="card shadow">
      <div class="card-header bg-secondary text-white">
        <h5 class="mb-0"><i class="fas fa-list me-2"></i>Danh sách sản phẩm ({{ products.length }})</h5>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="products.length === 0" class="text-center py-3">
          <p class="text-muted">Chưa có sản phẩm nào</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hình ảnh</th>
                <th>Tên</th>
                <th>Thương hiệu</th>
                <th>Giá</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>
                  <img :src="product.image" :alt="product.name" 
                       style="width: 50px; height: 50px; object-fit: contain; background: #f8f9fa; padding: 5px; border-radius: 4px;">
                </td>
                <td>{{ product.name }}</td>
                <td>{{ product.brand }}</td>
                <td>{{ formatPrice(product.price) }}</td>
                <td>
                  <button @click="editProduct(product)" class="btn btn-sm btn-primary me-1" data-bs-toggle="modal" data-bs-target="#editModal">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="deleteProduct(product.id)" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal sửa -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">✏️ Sửa sản phẩm</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEdit">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Tên sản phẩm</label>
                  <input type="text" v-model="editProductData.name" class="form-control" required>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Thương hiệu</label>
                  <input type="text" v-model="editProductData.brand" class="form-control" required>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Giá (VNĐ)</label>
                  <input type="number" v-model="editProductData.price" class="form-control" required>
                </div>
                <div class="col-12">
                  <label class="form-label">URL hình ảnh</label>
                  <input type="url" v-model="editProductData.image" class="form-control">
                </div>
                <div class="col-md-3">
                  <label class="form-label">CPU</label>
                  <input type="text" v-model="editProductData.cpu" class="form-control">
                </div>
                <div class="col-md-3">
                  <label class="form-label">RAM</label>
                  <input type="text" v-model="editProductData.ram" class="form-control">
                </div>
                <div class="col-md-3">
                  <label class="form-label">Ổ cứng</label>
                  <input type="text" v-model="editProductData.storage" class="form-control">
                </div>
                <div class="col-md-3">
                  <label class="form-label">Màn hình</label>
                  <input type="text" v-model="editProductData.screen" class="form-control">
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" @click="saveEdit" class="btn btn-primary" :disabled="editing">
              {{ editing ? 'Đang lưu...' : 'Lưu thay đổi' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const products = ref([])
const loading = ref(false)
const adding = ref(false)
const editing = ref(false)

const newProduct = ref({
  name: '',
  brand: '',
  price: '',
  image: '',
  cpu: '',
  ram: '',
  storage: '',
  screen: ''
})

const editProductData = ref({
  id: null,
  name: '',
  brand: '',
  price: '',
  image: '',
  cpu: '',
  ram: '',
  storage: '',
  screen: ''
})

const formatPrice = (price) => {
  return price ? price.toLocaleString('vi-VN') + 'đ' : '0đ'
}

const loadProducts = async () => {
  loading.value = true
  try {
    const response = await api.get('/products')
    products.value = response.data
    console.log('📦 Admin: Đã load', products.value.length, 'sản phẩm')
  } catch (error) {
    console.error('❌ Lỗi load sản phẩm:', error)
    alert('Không thể tải danh sách sản phẩm!')
  } finally {
    loading.value = false
  }
}

const addProduct = async () => {
  if (!newProduct.value.name || !newProduct.value.brand || !newProduct.value.price) {
    alert('Vui lòng điền đầy đủ thông tin!')
    return
  }
  
  adding.value = true
  try {
    await api.post('/admin/products', newProduct.value)
    await loadProducts()
    
    // Reset form
    newProduct.value = {
      name: '',
      brand: '',
      price: '',
      image: '',
      cpu: '',
      ram: '',
      storage: '',
      screen: ''
    }
    
    alert('✅ Thêm sản phẩm thành công!')
  } catch (error) {
    console.error('❌ Lỗi thêm sản phẩm:', error)
    alert('❌ Có lỗi xảy ra khi thêm sản phẩm!')
  } finally {
    adding.value = false
  }
}

const editProduct = (product) => {
  editProductData.value = { ...product }
}

const saveEdit = async () => {
  editing.value = true
  try {
    const id = editProductData.value.id
    await api.put(`/admin/products/${id}`, editProductData.value)
    await loadProducts()
    
    // Đóng modal
    const modal = document.getElementById('editModal')
    const bsModal = bootstrap.Modal.getInstance(modal)
    if (bsModal) bsModal.hide()
    
    alert('✅ Cập nhật sản phẩm thành công!')
  } catch (error) {
    console.error('❌ Lỗi sửa sản phẩm:', error)
    alert('❌ Có lỗi xảy ra khi cập nhật!')
  } finally {
    editing.value = false
  }
}

const deleteProduct = async (id) => {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    try {
      await api.delete(`/admin/products/${id}`)
      await loadProducts()
      alert('✅ Xóa sản phẩm thành công!')
    } catch (error) {
      console.error('❌ Lỗi xóa sản phẩm:', error)
      alert('❌ Có lỗi xảy ra khi xóa!')
    }
  }
}

onMounted(() => {
  loadProducts()
})
</script>