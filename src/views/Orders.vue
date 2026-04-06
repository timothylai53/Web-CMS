<template>
  <div class="orders-page">
    <Navbar />
    
    <div class="orders-container">
      <!-- Modern Hero Section -->
      <div class="hero-section">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1>My Orders</h1>
          <p class="hero-subtitle">Track and manage your catering orders</p>
          <router-link to="/home" class="btn-hero-action">
            <span>+</span> Place New Order
          </router-link>
        </div>
      </div>

      <div class="main-content">
        <!-- Tabs -->
        <div class="tabs-wrapper">
          <div class="tabs">
            <button 
              @click="activeTab = 'all'" 
              :class="{ active: activeTab === 'all' }"
            >
              All Orders
            </button>
            <button 
              @click="activeTab = 'pending'" 
              :class="{ active: activeTab === 'pending' }"
            >
              Pending
            </button>
            <button 
              @click="activeTab = 'confirmed'" 
              :class="{ active: activeTab === 'confirmed' }"
            >
              Confirmed
            </button>
            <button 
              @click="activeTab = 'completed'" 
              :class="{ active: activeTab === 'completed' }"
            >
              Completed
            </button>
          </div>
        </div>

        <div v-if="filteredOrders.length === 0" class="empty-state">
          <div class="empty-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders yet.</p>
          <router-link to="/menu" class="btn-primary">Browse Menu</router-link>
        </div>

        <div v-else class="orders-grid">
          <div v-for="order in filteredOrders" :key="order._id" class="order-card">
            <div class="card-status-bar" :class="order.status"></div>
            
            <div class="card-header">
              <div class="header-top">
                <span class="id-badge">#{{ (order._id || '').slice(-8).toUpperCase() }}</span>
                <span class="status-badge" :class="order.status">
                  {{ capitalizeStatus(order.status) }}
                </span>
              </div>
              <h3 class="package-name">{{ order.packageName }}</h3>
              <p class="event-date">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {{ formatDate(order.eventDate) }}
              </p>
            </div>

            <div class="card-body">
              <div class="info-grid">
                <div class="info-point">
                  <span class="label">Guests</span>
                  <span class="value">{{ order.numberOfPax }} pax</span>
                </div>
                <div class="info-point">
                  <span class="label">Total</span>
                  <span class="value amount">RM {{ order.totalAmount.toFixed(2) }}</span>
                </div>
              </div>
              
              <div class="delivery-status-wrapper">
                 <span class="label">Delivery:</span>
                 <span :class="['mini-badge', order.deliveryStatus || 'pending']">
                  {{ capitalizeStatus(order.deliveryStatus || 'pending') }}
                </span>
              </div>
            </div>

            <div class="card-footer">
              <button @click="viewDetails(order)" class="btn-details">View Details</button>
              <button v-if="order.status === 'pending'" @click="cancelOrder(order._id)" class="btn-cancel-sm">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Details Modal -->
      <div v-if="selectedOrder" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Order #{{ (selectedOrder._id || '').slice(-8).toUpperCase() }}</h3>
            <button class="close-btn" @click="closeModal">✕</button>
          </div>

          <div class="modal-body">
            <div class="status-banner">
               <div class="status-item">
                 <span class="label">Status</span>
                 <span :class="['status-badge', selectedOrder.status]">
                  {{ capitalizeStatus(selectedOrder.status) }}
                </span>
               </div>
               <div class="status-item">
                 <span class="label">Payment</span>
                 <span :class="['status-badge', selectedOrder.paymentStatus || 'pending']">
                  {{ capitalizeStatus(selectedOrder.paymentStatus || 'pending') }}
                </span>
               </div>
            </div>
            
            <div class="detail-section">
              <h4>📦 Package Information</h4>
              <div class="info-row">
                 <span>Package</span>
                 <strong>{{ selectedOrder.packageName }}</strong>
              </div>
              <div class="info-row">
                 <span>Guests</span>
                 <strong>{{ selectedOrder.numberOfPax }} pax</strong>
              </div>
              <div class="info-row">
                 <span>Price per pax</span>
                 <strong>RM {{ selectedOrder.packagePrice?.toFixed(2) }}</strong>
              </div>
            </div>

            <div class="detail-section" v-if="selectedOrder.selectedFoods && selectedOrder.selectedFoods.length">
              <h4>🍽️ Menu Items</h4>
              <div class="tags-container">
                <span v-for="(food, index) in selectedOrder.selectedFoods" :key="'food-' + index" class="item-tag">
                  {{ food }}
                </span>
              </div>
            </div>

             <div class="detail-section" v-if="selectedOrder.selectedDrinks && selectedOrder.selectedDrinks.length">
              <h4>🥤 Drinks & Desserts</h4>
              <div class="tags-container">
                <span v-for="(drink, index) in selectedOrder.selectedDrinks" :key="'drink-' + index" class="item-tag">
                  {{ drink }}
                </span>
                 <span v-for="(cake, index) in selectedOrder.selectedCakes" :key="'cake-' + index" class="item-tag">
                  {{ cake }}
                </span>
              </div>
            </div>

            <div class="detail-section">
              <h4>📅 Event Details</h4>
              <div class="info-row">
                 <span>Date</span>
                 <strong>{{ formatDate(selectedOrder.eventDate) }}</strong>
              </div>
              <div class="info-row">
                 <span>Time</span>
                 <strong>{{ selectedOrder.eventTime }}</strong>
              </div>
              <div class="info-row">
                 <span>Location</span>
                 <strong>{{ selectedOrder.location }}</strong>
              </div>
            </div>

            <div class="detail-section" v-if="selectedOrder.specialRequests">
              <h4>📝 Special Requests</h4>
              <p class="notes-text">{{ selectedOrder.specialRequests }}</p>
            </div>

            <div class="total-bar">
              <span>Total Amount</span>
              <span class="total-price">RM {{ selectedOrder.totalAmount?.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  data() {
    return {
      activeTab: 'all',
      selectedOrder: null
    }
  },
  computed: {
    userOrders() {
      const ordersStore = useOrdersStore()
      return ordersStore.orders
    },
    filteredOrders() {
      if (this.activeTab === 'all') {
        return this.userOrders
      }
      return this.userOrders.filter(order => order.status === this.activeTab)
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-MY', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      })
    },
    capitalizeStatus(status) {
      if (!status) return 'Pending'
      return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    },
    viewDetails(order) {
      this.selectedOrder = order
    },
    closeModal() {
      this.selectedOrder = null
    },
    async cancelOrder(orderId) {
      if (confirm('Are you sure you want to cancel this order?')) {
        try {
          const ordersStore = useOrdersStore()
          await ordersStore.updateOrderStatus(orderId, 'cancelled')
          alert('Order cancelled successfully')
        } catch (error) {
          alert('Failed to cancel order')
        }
      }
    }
  },
  async mounted() {
    const ordersStore = useOrdersStore()
    await ordersStore.fetchMyOrders()
  }
}
</script>

<style scoped>
/* Main Layout */
.orders-page {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.orders-container {
  flex: 1;
  margin-left: 260px;
  width: calc(100% - 260px);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Hero Section */
.hero-section {
  position: relative;
  background-color: #1e293b;
  color: white;
  padding: 50px 20px;
  text-align: center;
  overflow: hidden;
  margin-bottom: 0;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 20%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(to right, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 24px;
  line-height: 1.6;
}

.btn-hero-action {
  background: #2563eb;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
}

.btn-hero-action:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
}

.btn-hero-action span {
  font-size: 1.2rem;
  line-height: 1;
}

/* Tabs */
.tabs-wrapper {
  margin-top: -24px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
}

.tabs {
  background: white;
  padding: 4px;
  border-radius: 16px;
  display: inline-flex;
  gap: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;
  justify-content: center;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-size: 0.95rem;
}

.tabs button.active {
  background: #f1f5f9;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  margin: 40px auto;
  border: 1px dashed #cbd5e1;
}

.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: #94a3b8;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 24px;
}

.btn-primary {
  background: #0f172a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #1e293b;
  transform: translateY(-1px);
}

/* Orders Grid */
.orders-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}

.order-card {
  width: 100%;
  max-width: 380px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

/* Status Bar Logic */
.card-status-bar {
  height: 4px;
  width: 100%;
}
.card-status-bar.pending { background: #f59e0b; }
.card-status-bar.confirmed { background: #3b82f6; }
.card-status-bar.completed { background: #10b981; }
.card-status-bar.cancelled { background: #ef4444; }
.card-status-bar.preparing { background: #8b5cf6; }

.card-header {
  padding: 20px;
  border-bottom: 1px solid #f8fafc;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.id-badge {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.75rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
}

.status-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.02em;
}

.status-badge.pending { background: #fffbeb; color: #b45309; }
.status-badge.confirmed { background: #eff6ff; color: #1d4ed8; }
.status-badge.completed { background: #f0fdf4; color: #15803d; }
.status-badge.cancelled { background: #fef2f2; color: #b91c1c; }
.status-badge.preparing { background: #f5f3ff; color: #6d28d9; }

.package-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
  text-transform: capitalize;
}

.event-date {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.9rem;
}

.card-body {
  padding: 20px;
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.info-point {
  display: flex;
  flex-direction: column;
}

.info-point .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 4px;
}

.info-point .value {
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
}

.value.amount {
  color: #2563eb;
}

.delivery-status-wrapper {
  background: #f8fafc;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px dashed #cbd5e1;
}

.delivery-status-wrapper .label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

.mini-badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: capitalize;
}
.mini-badge.pending { background: #fffbeb; color: #b45309; }
.mini-badge.delivered { background: #f0fdf4; color: #15803d; }
.mini-badge.in-transit { background: #eff6ff; color: #1d4ed8; }

.card-footer {
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-details {
  background: transparent;
  border: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
}

.btn-details:hover {
  text-decoration: underline;
  color: #334155;
}

.btn-cancel-sm {
  background: white;
  color: #ef4444;
  border: 1px solid #fee2e2;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel-sm:hover {
  background: #fef2f2;
  border-color: #fecaca;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.25rem;
  font-weight: 700;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  line-height: 1;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.modal-body {
  padding: 24px;
}

.status-banner {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.status-item .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 600;
}

.detail-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.info-row span {
  color: #64748b;
}

.info-row strong {
  color: #334155;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.item-tag {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}

.notes-text {
  background: #fffbeb;
  padding: 12px;
  border-radius: 8px;
  color: #92400e;
  font-size: 0.9rem;
  line-height: 1.5;
}

.total-bar {
  margin-top: 10px;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 2px dashed #e2e8f0;
}

.total-bar span:first-child {
  font-weight: 600;
  color: #0f172a;
}

.total-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2563eb;
}

@media (max-width: 768px) {
  .orders-grid {
    grid-template-columns: 1fr;
  }
}
</style>
