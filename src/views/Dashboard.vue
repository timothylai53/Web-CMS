<template>
  <div class="dashboard-container">
    <!-- Navbar -->
   <Navbar />

    <!-- Dashboard Content -->
    <div class="dashboard-content">
      <div class="welcome-section">
        <h2>Welcome Back, {{ username }}! 👋</h2>
        <p class="welcome-subtitle">Your catering journey starts here</p>
      </div>

      <!-- Summary Cards -->
      <div class="cards">
        <div class="card orders-card">
          <div class="card-icon">📦</div>
          <h3>My Orders</h3>
          <p>{{ myOrdersCount }}</p>
          <router-link to="/orders" class="card-link">View Orders</router-link>
        </div>
        <div class="card packages-card">
          <div class="card-icon">🍱</div>
          <h3>Catering Providers</h3>
          <p>{{ providers.length }}</p>
          <div class="card-link-disabled">Select provider below</div>
        </div>
        <div class="card cart-card">
          <div class="card-icon">🛒</div>
          <h3>Cart Items</h3>
          <p>{{ cartCount }}</p>
          <router-link to="/cart" class="card-link">View Cart</router-link>
        </div>
      </div>

      <!-- Catering Providers Section -->
      <section class="providers-section">
        <div class="section-header">
          <h3>🍽️ Catering Providers</h3>
          <p>Choose a provider to view their menu</p>
        </div>
        <div class="providers-grid">
          <div 
            v-for="provider in providers" 
            :key="provider._id" 
            class="provider-card"
            @click="viewProviderMenu(provider._id)"
          >
            <div class="provider-header">
              <div class="provider-avatar">👨‍🍳</div>
              <h4>{{ provider.businessName }}</h4>
            </div>
            <p class="provider-email">📧 {{ provider.email }}</p>
            <button class="btn-view-menu">View Menu</button>
          </div>
        </div>
      </section>

      <section class="system-info">
        <div class="info-header">
          <span class="info-icon">ℹ️</span>
          <h3>About Our Catering System</h3>
        </div>
        <p>
          This Web-Based Management System is a comprehensive solution tailored for catering businesses
          to manage orders, customers, and inventory efficiently. It allows catering providers to receive
          and track orders online, schedule deliveries, and manage event-based meal planning. The system
          includes a user-friendly interface for clients to customize menus, request quotes, and make payments securely.
        </p>
        <div class="features-grid">
          <div class="feature-item">
            <span class="feature-icon">✨</span>
            <span>Easy Online Ordering</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📅</span>
            <span>Event Scheduling</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🔒</span>
            <span>Secure Payments</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <span>Order Tracking</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useCartStore } from '@/stores/cart'
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  data() {
    return {
      providers: []
    }
  },
  computed: {
    username() {
      const authStore = useAuthStore()
      return authStore.user?.fullName || authStore.user?.username || 'User'
    },
    myOrdersCount() {
      const authStore = useAuthStore()
      const ordersStore = useOrdersStore()
      return ordersStore.userOrders(authStore.user?.id).length
    },
    cartCount() {
      const cartStore = useCartStore()
      return cartStore.cartItemCount
    }
  },
  methods: {
    async fetchProviders() {
      try {
        const response = await api.get('/auth/providers')
        this.providers = response.data
      } catch (error) {
        console.error('Error fetching providers:', error)
      }
    },
    viewProviderMenu(providerId) {
      this.$router.push({ path: '/menu', query: { providerId } })
    }
  },
  mounted() {
    const ordersStore = useOrdersStore()
    const cartStore = useCartStore()
    
    this.fetchProviders()
    ordersStore.loadFromStorage()
    cartStore.loadFromStorage()
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Main Content */
.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-section {
  text-align: center;
  margin-bottom: 50px;
  animation: slideDown 0.7s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-section h2 {
  color: #1a1d29;
  margin-bottom: 12px;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.welcome-subtitle {
  color: #6c757d;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0;
}

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
  animation: scaleIn 0.8s ease-out 0.2s both;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
  padding: 35px 30px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  text-align: center;
}

.card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(135deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transform: rotate(45deg);
  transition: all 0.5s;
}

.card:hover::before {
  left: 100%;
}

.card:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 0 25px 70px rgba(102, 126, 234, 0.25);
}

.orders-card:hover {
  box-shadow: 0 25px 70px rgba(102, 126, 234, 0.3);
}

.packages-card:hover {
  box-shadow: 0 25px 70px rgba(240, 147, 251, 0.3);
}

.cart-card:hover {
  box-shadow: 0 25px 70px rgba(245, 87, 108, 0.3);
}

.card-icon {
  font-size: 3.5rem;
  margin-bottom: 15px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.card h3 {
  color: #1a1d29;
  margin-bottom: 15px;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.card p {
  font-size: 3rem;
  font-weight: 800;
  margin: 20px 0;
  color: #3b82f6;
  line-height: 1;
}

.card-link {
  display: inline-block;
  padding: 12px 28px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  letter-spacing: 0.5px;
  margin-top: 10px;
}

.card-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.5);
}

.card-link-disabled {
  display: inline-block;
  padding: 12px 28px;
  background: #94a3b8;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-top: 10px;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Providers Section */
.providers-section {
  margin: 40px 0;
  animation: slideUp 1s ease-out 0.3s both;
}

.section-header {
  margin-bottom: 30px;
}

.section-header h3 {
  font-size: 1.8rem;
  color: #1a1d29;
  margin-bottom: 8px;
}

.section-header p {
  color: #718096;
  font-size: 1rem;
}

.providers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.provider-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.provider-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.25);
  border-color: #3b82f6;
}

.provider-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.provider-avatar {
  font-size: 3rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.provider-card h4 {
  color: #1a1d29;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
}

.provider-email {
  color: #718096;
  font-size: 0.95rem;
  margin-bottom: 20px;
}

.btn-view-menu {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 12px 0;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-size: 1rem;
}

.btn-view-menu:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.system-info {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  backdrop-filter: blur(20px);
  padding: 45px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: slideUp 1s ease-out 0.4s both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.info-icon {
  font-size: 2.5rem;
}

.system-info h3 {
  color: #1a1d29;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.system-info p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 30px;
  text-align: justify;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 14px;
  border: 2px solid rgba(102, 126, 234, 0.15);
  transition: all 0.3s ease;
  font-weight: 600;
  color: #4a5568;
}

.feature-item:hover {
  transform: translateX(5px);
  border-color: #667eea;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
}

.feature-icon {
  font-size: 1.8rem;
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 40px 20px;
  }
  
  .welcome-section h2 {
    font-size: 36px;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
  
  .cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .card {
    padding: 30px 25px;
  }
  
  .card-icon {
    font-size: 3rem;
  }
  
  .card p {
    font-size: 2.5rem;
  }
  
  .system-info {
    padding: 30px 25px;
  }
  
  .info-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .system-info h3 {
    font-size: 1.5rem;
  }
  
  .system-info p {
    font-size: 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>
