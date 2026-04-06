<template>
  <div class="success-page">
    <Navbar />
    
    <div class="success-container">
      <div class="success-content">
        <div class="success-card">
          <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          
          <h1>Payment Successful!</h1>
          <p class="subtitle">Thank you for your order. Your catering service has been confirmed.</p>
          
          <div class="order-details-card">
            <div class="detail-row">
              <span class="label">Order ID</span>
              <span class="value">#{{ orderNumber || 'PENDING' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status</span>
              <span class="status-badge">Confirmed</span>
            </div>
            <div class="detail-row">
              <span class="label">Confirmation Sent To</span>
              <span class="value">{{ userEmail }}</span>
            </div>
          </div>

          <div class="message-box">
            <p>We have sent a confirmation email with full details of your order. You can track the status of your catering in the Orders section.</p>
          </div>

          <div class="action-buttons">
            <router-link to="/orders" class="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              View My Orders
            </router-link>
            <router-link to="/menu" class="btn-secondary">
              Continue Shopping
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'

export default {
  components: { Navbar },
  data() {
    return {
      orderNumber: '',
      userEmail: ''
    }
  },
  async mounted() {
    const orderId = this.$route.params.orderId
    const authStore = useAuthStore()
    const ordersStore = useOrdersStore()
    
    this.userEmail = authStore.user?.email || 'your email'

    if (orderId) {
      // Try to find in existing orders
      let order = ordersStore.allOrders.find(o => o.id == orderId || o._id == orderId)
      
      // If not found, fetch latest
      if (!order) {
        await ordersStore.fetchOrders()
        order = ordersStore.allOrders.find(o => o.id == orderId || o._id == orderId)
      }

      if (order) {
        this.orderNumber = order.orderNumber || order._id.slice(-6).toUpperCase()
      } else {
        this.orderNumber = orderId.slice(-6).toUpperCase()
      }
    }
    
    // Clear checkout data
    sessionStorage.removeItem('checkoutData')
    sessionStorage.removeItem('quotationOrder')
  }
}
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

.success-container {
  margin-left: 260px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.success-content {
  width: 100%;
  max-width: 600px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-card {
  background: white;
  border-radius: 24px;
  padding: 50px 40px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
}

.icon-wrapper {
  width: 100px;
  height: 100px;
  background: #ecfdf5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  color: #10b981;
}

.icon-wrapper svg {
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

h1 {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748b;
  font-size: 16px;
  margin: 0 0 40px 0;
}

.order-details-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
  text-align: left;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #e2e8f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
}

.detail-row .value {
  color: #0f172a;
  font-weight: 600;
  font-size: 15px;
}

.status-badge {
  background: #d1fae5;
  color: #059669;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.message-box {
  margin-bottom: 40px;
}

.message-box p {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #0f172a;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.2);
}

.btn-primary:hover {
  background: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.2);
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f8fafc;
  color: #0f172a;
  border-color: #cbd5e1;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .success-container {
    margin-left: 70px;
    padding: 20px;
  }
  
  .success-card {
    padding: 30px 20px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-primary, .btn-secondary {
    justify-content: center;
    width: 100%;
  }
}
</style>
