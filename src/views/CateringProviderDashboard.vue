<template>
  <div class="admin-container">
    <Navbar />
    
    <div class="admin-content">
      <!-- Modern Dashboard Hero -->
      <div class="dashboard-hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="hero-text">
            <h2>Welcome Back, {{ userName }}</h2>
            <p>Here's what's happening with your catering business today.</p>
          </div>
          <div class="current-date">
            {{ currentDate }}
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-info">
            <h3>{{ totalOrders }}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon yellow">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-info">
            <h3>{{ pendingOrders }}</h3>
            <p>Pending Orders</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="stat-info">
            <h3>RM {{ totalRevenue.toFixed(2) }}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
          </div>
          <div class="stat-info">
            <h3>{{ totalMenuItems }}</h3>
            <p>Menu Items</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="dashboard-section">
        <div class="section-header">
          <h3>Quick Actions</h3>
        </div>
        <div class="actions-grid">
          <router-link to="/provider/orders" class="action-card">
            <div class="action-icon-wrapper blue-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <span>Manage Orders</span>
          </router-link>
          
          <router-link to="/provider/menu" class="action-card">
            <div class="action-icon-wrapper orange-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
            </div>
            <span>Update Menu</span>
          </router-link>
          
          <router-link to="/provider/events" class="action-card">
            <div class="action-icon-wrapper purple-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <span>Schedule</span>
          </router-link>
          
          <router-link to="/provider/reports" class="action-card">
            <div class="action-icon-wrapper green-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <span>Reports</span>
          </router-link>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="dashboard-section">
        <div class="section-header">
          <h3>Recent Orders</h3>
          <router-link to="/provider/orders" class="view-all-link">View All</router-link>
        </div>
        
        <div class="recent-orders-card">
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="recentOrders.length === 0">
                  <td colspan="6" class="empty-cell">No recent orders found</td>
                </tr>
                <tr v-for="order in recentOrders" :key="order._id">
                  <td class="order-id">#{{ order.orderNumber || order._id.slice(-6).toUpperCase() }}</td>
                  <td class="customer-name">
                    <div class="avatar-placeholder">{{ order.customerName.charAt(0) }}</div>
                    {{ order.customerName }}
                  </td>
                  <td>{{ formatDate(order.createdAt) }}</td>
                  <td class="amount">RM {{ order.totalAmount.toFixed(2) }}</td>
                  <td>
                    <span :class="['status-badge', order.status.toLowerCase().replace(' ', '-')]">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>
                    <router-link :to="`/provider/orders`" class="btn-icon-view" title="View Details">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useOrdersStore } from '@/stores/orders'
import { useMenuStore } from '@/stores/menu'
import { useAuthStore } from '@/stores/auth' // Import Auth Store
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  computed: {
    userName() {
      const authStore = useAuthStore()
      return authStore.user?.businessName || authStore.user?.name || 'Partner'
    },
    totalOrders() {
      const ordersStore = useOrdersStore()
      return ordersStore.allOrders.length
    },
    pendingOrders() {
      const ordersStore = useOrdersStore()
      return ordersStore.pendingOrders.length
    },
    totalRevenue() {
      const ordersStore = useOrdersStore()
      return ordersStore.allOrders.reduce((sum, order) => {
        if (order.status !== 'cancelled') {
          return sum + order.totalAmount
        }
        return sum
      }, 0)
    },
    totalMenuItems() {
      const menuStore = useMenuStore()
      return menuStore.allPackages.length + menuStore.availableFoods.length
    },
    recentOrders() {
      const ordersStore = useOrdersStore()
      // Sort by date descending
      return [...ordersStore.allOrders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    },
    currentDate() {
      return new Date().toLocaleDateString('en-MY', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-MY', { 
        month: 'short', 
        day: 'numeric'
      })
    }
  },
  async mounted() {
    const ordersStore = useOrdersStore()
    const menuStore = useMenuStore()
    /* ...existing code... */
    await ordersStore.fetchAllOrders()
    await menuStore.fetchPackages()
    await menuStore.fetchFoods()
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
  margin-left: 260px; /* Sidebar width */
  padding: 32px;
  width: calc(100% - 260px);
}

/* Hero Section */
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
  align-items: flex-end;
  border: 1px solid #e2e8f0;
}

.hero-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: radial-gradient(circle at top right, rgba(6, 182, 212, 0.1), transparent 70%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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

.current-date {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 8px 16px;
  border-radius: 20px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-icon.blue { background: #eff6ff; color: #3b82f6; }
.stat-icon.yellow { background: #fefce8; color: #eab308; }
.stat-icon.green { background: #f0fdf4; color: #22c55e; }
.stat-icon.purple { background: #faf5ff; color: #a855f7; }

.stat-info h3 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.stat-info p {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}

/* Section Common */
.dashboard-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.view-all-link {
  color: #06b6d4;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.view-all-link:hover {
  text-decoration: underline;
}

/* Quick Actions */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.action-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.action-card:hover {
  border-color: #06b6d4;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(6, 182, 212, 0.1);
}

.action-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: transform 0.2s;
}

.action-card:hover .action-icon-wrapper {
  transform: scale(1.1);
}

.action-icon-wrapper.blue-bg { background: #eff6ff; color: #3b82f6; }
.action-icon-wrapper.orange-bg { background: #fff7ed; color: #f97316; }
.action-icon-wrapper.purple-bg { background: #faf5ff; color: #a855f7; }
.action-icon-wrapper.green-bg { background: #f0fdf4; color: #22c55e; }

.action-card span {
  font-weight: 600;
  color: #334155;
  font-size: 14px;
}

/* Recent Orders Table */
.recent-orders-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 16px 24px;
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 14px;
}

tr:last-child td {
  border-bottom: none;
}

.customer-name {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  color: #0f172a;
}

.avatar-placeholder {
  width: 32px;
  height: 32px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.order-id {
  font-family: monospace;
  font-weight: 600;
  color: #64748b;
}

.amount {
  font-weight: 600;
  color: #0f172a;
}

/* Status Badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending { background: #fffbeb; color: #b45309; }
.status-badge.confirmed { background: #eff6ff; color: #1d4ed8; }
.status-badge.completed { background: #f0fdf4; color: #15803d; }
.status-badge.cancelled { background: #fef2f2; color: #b91c1c; }

.btn-icon-view {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #64748b;
  transition: all 0.2s;
}

.btn-icon-view:hover {
  background: #f1f5f9;
  color: #0f172a;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .admin-content {
    margin-left: 0;
    width: 100%;
    padding: 20px;
    padding-bottom: 80px; /* Space for mobile nav */
  }
  
  .hero-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .stats-grid, .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
