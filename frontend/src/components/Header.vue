<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold">
        <i class="fas fa-laptop me-2"></i>TechStore
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item"><router-link to="/" class="nav-link">Trang chủ</router-link></li>
          <li class="nav-item"><router-link to="/admin" class="nav-link">Quản trị</router-link></li>
        </ul>
        <router-link to="/cart" class="btn btn-outline-light position-relative">
          <i class="fas fa-shopping-cart"></i>
          <span v-if="store.count > 0" class="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
            {{ store.count }}
          </span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '../stores/cart'

const store = useCartStore()
onMounted(() => store.loadCart())
</script>