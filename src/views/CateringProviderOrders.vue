<template>
  <div class="admin-container">
    <Navbar />
    
    <div class="admin-content">
      <!-- Modern Hero -->
      <div class="dashboard-hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="hero-text">
            <h2>Order Management</h2>
            <p>Track, manage, and fulfill your customer orders efficiently.</p>
          </div>
          <div class="stats-summary">
            <div class="stat-pill blue">
              <span class="label">Total</span>
              <span class="value">{{ allOrders.length }}</span>
            </div>
            <div class="stat-pill yellow">
              <span class="label">Pending</span>
              <span class="value">{{ pendingCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="dashboard-section">
        <div class="filters-bar">
          <button @click="filterStatus = 'all'" :class="['filter-btn', { active: filterStatus === 'all' }]">
            All Orders
          </button>
          <button @click="filterStatus = 'pending'" :class="['filter-btn', { active: filterStatus === 'pending' }]">
            Pending <span v-if="pendingCount" class="badge-count">{{ pendingCount }}</span>
          </button>
          <button @click="filterStatus = 'confirmed'" :class="['filter-btn', { active: filterStatus === 'confirmed' }]">
            Confirmed <span v-if="confirmedCount" class="badge-count">{{ confirmedCount }}</span>
          </button>
          <button @click="filterStatus = 'completed'" :class="['filter-btn', { active: filterStatus === 'completed' }]">
            Completed <span v-if="completedCount" class="badge-count">{{ completedCount }}</span>
          </button>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="dashboard-section">
        <div class="recent-orders-card">
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Details</th>
                  <th>Event Info</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Delivery</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredOrders.length === 0">
                  <td colspan="7" class="empty-cell">
                    <div class="empty-state">
                      <div class="empty-icon">📦</div>
                      <p>No orders found matching your filter.</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="order in filteredOrders" :key="order._id">
                  <td class="order-id">
                    {{ order.orderNumber || '#' + (order._id || '').slice(-6).toUpperCase() }}
                    <div class="timestamp">{{ formatDate(order.createdAt) }}</div>
                  </td>
                  <td>
                    <div class="customer-info">
                      <div class="avatar-placeholder">{{ (order.customerName || 'U').charAt(0) }}</div>
                      <div>
                        <div class="customer-name">{{ order.customerName || order.userId?.username || 'Guest' }}</div>
                        <div class="customer-contact">{{ order.customerPhone || 'No Phone' }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="event-info">
                      <div class="event-row event-date">
                        <svg class="event-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>{{ formatDate(order.eventDate) }}</span>
                      </div>
                      <div class="event-row event-time">
                        <svg class="event-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>{{ order.eventTime || 'TBA' }}</span>
                      </div>
                      <div class="event-row event-location">
                        <svg class="event-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span>{{ truncateText(order.location || 'TBA', 20) }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="amount">RM {{ order.totalAmount?.toFixed(2) || '0.00' }}</td>
                  <td>
                    <select 
                      :value="order.status" 
                      @change="updateStatus(order._id, $event.target.value)"
                      :class="['status-select', order.status]"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <select 
                      :value="order.deliveryStatus || 'pending'" 
                      @change="updateDelivery(order._id, $event.target.value)"
                      class="delivery-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="in-transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td>
                    <button @click="viewOrder(order)" class="btn-view-details">
                      Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Order Details Modal -->
      <div v-if="selectedOrder" class="modal-overlay" @click="closeModal">
        <div class="modal-card" @click.stop>
          <div class="modal-header">
            <div>
              <h3>Order {{ selectedOrder.orderNumber || '#' + (selectedOrder._id || '').slice(-6).toUpperCase() }}</h3>
              <p class="order-date">Created on {{ formatDateTime(selectedOrder.createdAt) }}</p>
            </div>
            <button class="modal-close-btn" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div class="modal-content-scroll">
            <div class="modal-grid">
              <!-- Customer & Event Card -->
              <div class="info-card">
                <h4>Customer & Event</h4>
                <div class="info-row">
                  <span class="label">Name</span>
                  <span class="value">{{ selectedOrder.customerName || 'N/A' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Contact</span>
                  <span class="value">{{ selectedOrder.customerPhone || 'N/A' }}</span>
                </div>
                 <div class="info-row">
                  <span class="label">Email</span>
                  <span class="value">{{ selectedOrder.customerEmail || 'N/A' }}</span>
                </div>
                <div class="divider"></div>
                <div class="info-row">
                  <span class="label">Date</span>
                  <span class="value">{{ formatDate(selectedOrder.eventDate) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Time</span>
                  <span class="value">{{ selectedOrder.eventTime || 'Not Set' }}</span>
                </div>
                 <div class="info-row">
                  <span class="label">Guests</span>
                  <span class="value">{{ selectedOrder.numberOfPax }} Pax</span>
                </div>
                <div class="info-row location-row">
                  <span class="label">Loc</span>
                  <span class="value">{{ selectedOrder.location || 'Not Specified' }}</span>
                </div>
              </div>

              <!-- Payment & Status Card -->
              <div class="info-card">
                <h4>Status & Payment</h4>
                <div class="info-row">
                  <span class="label">Order Status</span>
                  <span :class="['status-badge', selectedOrder.status]">{{ selectedOrder.status }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Delivery</span>
                  <span class="value">{{ selectedOrder.deliveryStatus || 'Pending' }}</span>
                </div>
                <div class="divider"></div>
                <div class="info-row">
                  <span class="label">Method</span>
                  <span class="value">{{ selectedOrder.paymentMethod || 'Online' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Payment</span>
                  <span :class="['status-badge', selectedOrder.paymentStatus]">{{ selectedOrder.paymentStatus || 'Pending' }}</span>
                </div>
              </div>
            </div>

            <!-- Order Items Card -->
            <div class="menu-items-card">
              <h4>Order Items</h4>
              <div class="package-header-row">
                <span class="pkg-name">{{ selectedOrder.packageName }}</span>
                <span class="pkg-price">RM {{ selectedOrder.packagePrice?.toFixed(2) }} x {{ selectedOrder.numberOfPax }}</span>
              </div>

              <div class="selections-container">
                <div v-if="selectedOrder.selectedFoods?.length" class="selection-group">
                  <h5>Main Dishes</h5>
                  <div class="tags-wrapper">
                    <span v-for="(food, i) in selectedOrder.selectedFoods" :key="i" class="food-tag">{{ food }}</span>
                  </div>
                </div>
                
                <div v-if="selectedOrder.selectedDrinks?.length" class="selection-group">
                  <h5>Beverages</h5>
                  <div class="tags-wrapper">
                    <span v-for="(drink, i) in selectedOrder.selectedDrinks" :key="i" class="drink-tag">{{ drink }}</span>
                  </div>
                </div>
                
                <div v-if="selectedOrder.selectedCakes?.length" class="selection-group">
                  <h5>Desserts</h5>
                  <div class="tags-wrapper">
                    <span v-for="(cake, i) in selectedOrder.selectedCakes" :key="i" class="dessert-tag">{{ cake }}</span>
                  </div>
                </div>
              </div>

              <div v-if="selectedOrder.specialRequests || selectedOrder.notes" class="notes-box">
                <strong>Notes:</strong> {{ selectedOrder.specialRequests }} {{ selectedOrder.notes }}
              </div>
            </div>

            <!-- Total Summary -->
            <div class="total-summary-card">
              <div class="calc-row">
                <span>Subtotal</span>
                <span>RM {{ calculateSubtotal(selectedOrder).toFixed(2) }}</span>
              </div>
              <div v-if="selectedOrder.deliveryFee" class="calc-row">
                <span>Delivery Fee</span>
                <span>RM {{ selectedOrder.deliveryFee.toFixed(2) }}</span>
              </div>
              <div v-if="selectedOrder.serviceFee" class="calc-row">
                <span>Service Fee</span>
                <span>RM {{ selectedOrder.serviceFee.toFixed(2) }}</span>
              </div>
              <div class="calc-row total">
                <span>Total Amount</span>
                <span>RM {{ selectedOrder.totalAmount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="closeModal" class="btn-close">Close</button>
            <button @click="printOrder(selectedOrder)" class="btn-print">Print Order</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useOrdersStore } from '@/stores/orders'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  data() {
    return {
      filterStatus: 'all',
      selectedOrder: null
    }
  },
  computed: {
    allOrders() {
      const ordersStore = useOrdersStore()
      return ordersStore.allOrders
    },
    filteredOrders() {
      let orders = this.allOrders
      if (this.filterStatus !== 'all') {
        orders = this.allOrders.filter(order => order.status === this.filterStatus)
      }
      // Sort: Newest first
      return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
    pendingCount() {
      return this.allOrders.filter(o => o.status === 'pending').length
    },
    confirmedCount() {
      return this.allOrders.filter(o => o.status === 'confirmed').length
    },
    completedCount() {
      return this.allOrders.filter(o => o.status === 'completed').length
    }
  },
  methods: {
    async updateStatus(orderId, status) {
      try {
        const ordersStore = useOrdersStore()
        await ordersStore.updateOrderStatus(orderId, status)
        // No alert needed, reactive UI updates are better
      } catch (error) {
        console.error('Error updating status:', error)
        alert('Failed to update order status.')
      }
    },
    async updateDelivery(orderId, deliveryStatus) {
      try {
        const ordersStore = useOrdersStore()
        await ordersStore.updateDeliveryStatus(orderId, deliveryStatus)
      } catch (error) {
        console.error('Error updating delivery status:', error)
        alert('Failed to update delivery status.')
      }
    },
    viewOrder(order) {
      this.selectedOrder = order
    },
    closeModal() {
      this.selectedOrder = null
    },
    calculateSubtotal(order) {
      if (!order.items && !order.packagePrice) return 0
      if (order.packagePrice) return order.packagePrice * order.numberOfPax
      return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-MY', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },
    formatDateTime(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleString('en-MY', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    },
    truncateText(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    },
    printOrder(order) {
      window.print()
    }
  },
  mounted() {
    const ordersStore = useOrdersStore()
    ordersStore.fetchAllOrders()
  }
}
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
}

.admin-content {
  flex: 1;
  margin-left: 260px;
  padding: 32px;
  width: calc(100% - 260px);
}

/* Hero */
.dashboard-hero {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
}

.hero-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 70%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-text h2 {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.hero-text p {
  color: #64748b;
  font-size: 16px;
}

.stats-summary {
  display: flex;
  gap: 16px;
}

.stat-pill {
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  border-radius: 12px;
  min-width: 100px;
  text-align: center;
}

.stat-pill.blue { background: #eff6ff; border: 1px solid #dbeafe; }
.stat-pill.yellow { background: #fefce8; border: 1px solid #fef9c3; }

.stat-pill .label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
}

.stat-pill .value {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
}

/* Filters */
.dashboard-section { margin-bottom: 24px; }

.filters-bar {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.filter-btn {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.filter-btn.active {
  background: #0f172a;
  color: white;
  border-color: #0f172a;
}

.badge-count {
  background: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
}

.filter-btn:not(.active) .badge-count {
  background: #e2e8f0;
  color: #475569;
}

/* Table */
.recent-orders-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  overflow: hidden;
}

.table-responsive { overflow-x: auto; }

table { width: 100%; border-collapse: collapse; }

th {
  text-align: left;
  padding: 16px 24px;
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 14px;
  vertical-align: middle;
}

.order-id {
  font-family: monospace;
  font-weight: 600;
  color: #3b82f6;
}

.timestamp {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 400;
  margin-top: 4px;
  font-family: sans-serif;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-placeholder {
  width: 36px;
  height: 36px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #64748b;
}

.customer-name {
  font-weight: 600;
  color: #0f172a;
}

.customer-contact {
  font-size: 12px;
  color: #64748b;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.event-icon {
  color: #64748b;
  flex-shrink: 0;
}

.amount {
  font-weight: 700;
  color: #0f172a;
}

/* Status Badges & Selects */
.status-select, .delivery-select {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #cbd5e1;
  background-color: white;
  cursor: pointer;
}

.status-select.pending { border-color: #fcd34d; color: #b45309; background: #fffbeb; }
.status-select.confirmed { border-color: #86efac; color: #15803d; background: #f0fdf4; }
.status-select.completed { border-color: #93c5fd; color: #1e40af; background: #eff6ff; }
.status-select.cancelled { border-color: #fca5a5; color: #b91c1c; background: #fef2f2; }

.btn-view-details {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-view-details:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.empty-icon { font-size: 40px; margin-bottom: 10px; }

/* Modal Design */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  width: 90%;
  max-width: 800px;
  height: 85vh;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.order-date { font-size: 13px; color: #64748b; }

.modal-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px;
}

.modal-close-btn:hover { color: #0f172a; }

.modal-content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f8fafc;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.info-card, .menu-items-card, .total-summary-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.info-card h4, .menu-items-card h4 {
  font-size: 14px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 16px;
  letter-spacing: 0.05em;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-row .label { color: #64748b; }
.info-row .value { color: #0f172a; font-weight: 500; text-align: right; max-width: 60%; }

.divider { height: 1px; background: #f1f5f9; margin: 12px 0; }

.status-badge {
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending { background: #fffbeb; color: #b45309; }
.status-badge.confirmed, .status-badge.paid { background: #f0fdf4; color: #15803d; }
.status-badge.cancelled { background: #fef2f2; color: #b91c1c; }

/* Menu Card Styles */
.package-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 16px;
}

.pkg-name { font-weight: 700; color: #0f172a; font-size: 16px; }
.pkg-price { color: #64748b; font-size: 14px; }

.selection-group h5 {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.food-tag, .drink-tag, .dessert-tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 500;
}

.food-tag { background: #fff1f2; color: #be123c; border: 1px solid #ffe4e6; }
.drink-tag { background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe; }
.dessert-tag { background: #fdf2f8; color: #be185d; border: 1px solid #fce7f3; }

.notes-box {
  background: #fffbeb;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #92400e;
  border: 1px solid #fef3c7;
}

/* Total Summary */
.total-summary-card {
  margin-top: 24px;
}

.calc-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: #64748b;
}

.calc-row.total {
  border-top: 1px solid #e2e8f0;
  margin-top: 12px;
  padding-top: 12px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-close {
  padding: 10px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-print {
  padding: 10px 20px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 768px) {
  .admin-content { margin-left: 0; width: 100%; padding: 16px; padding-bottom: 80px; }
  .modal-grid { grid-template-columns: 1fr; }
  .modal-card { width: 100%; height: 100%; border-radius: 0; }
  th, td { padding: 12px 16px; }
  .customer-info { flex-direction: column; align-items: flex-start; gap: 4px; }
  .avatar-placeholder { display: none; }
}
</style>
