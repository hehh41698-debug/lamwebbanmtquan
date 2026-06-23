<template>
  <h1 class="display-5 fw-bold mb-4"><i class="fas fa-shopping-cart"></i> Giỏ hàng</h1>
  
  <div v-if="cartStore.items.length === 0" class="text-center py-5">
    <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
    <h3>Giỏ hàng trống</h3>
    <router-link to="/" class="btn btn-primary">Mua sắm ngay</router-link>
  </div>

  <div v-else>
    <div class="table-responsive">
      <table class="table table-hover">
        <thead class="table-dark">
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tạm tính</th>
            <th></th>
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
                <input type="number" v-model.number="item.quantity" min="1" 
                       class="form-control" style="width: 60px;">
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
    
    <div class="d-flex justify-content-between">
      <router-link to="/" class="btn btn-outline-primary">
        <i class="fas fa-arrow-left"></i> Tiếp tục mua
      </router-link>
      <router-link to="/checkout" class="btn btn-success btn-lg">
        <i class="fas fa-check"></i> Đặt hàng
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + 'đ'
}

const updateCart = async (id, quantity) => {
  if (quantity <= 0) {
    alert('Số lượng phải lớn hơn 0!')
    return
  }
  await cartStore.updateCart(id, quantity)
}

const removeFromCart = async (id) => {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    await cartStore.removeFromCart(id)
  }
}

onMounted(() => {
  cartStore.loadCart()
})
</script>

<style scoped>
.cart-item-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.table th {
  background: #1a1a2e;
  color: white;
}

.table td {
  vertical-align: middle;
}
</style>