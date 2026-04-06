<template>
  <nav class="navbar">
    <div class="nav-header">
      <div class="user-avatar">
        {{ userName.charAt(0).toUpperCase() }}
      </div>
      <div class="user-info">
        <h2 class="nav-brand">{{ userName }}</h2>
        <span class="role-badge" :class="userRole">
          <span class="status-dot"></span>
          {{ roleLabel }}
        </span>
      </div>
    </div>
    
    <div class="nav-content">
      <ul class="nav-links">
        <!-- Customer Links -->
        <template v-if="isCustomer">
          <li class="nav-category">Menu</li>
          <li>
            <router-link to="/home" active-class="active-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span class="nav-text">Home</span>
            </router-link>
          </li>
          
          <li>
            <router-link to="/cart" class="cart-link" active-class="active-link">
              <div class="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <span v-if="cartCount > 0" class="cart-pulse"></span>
              </div>
              <span class="nav-text">Cart</span>
              <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
            </router-link>
          </li>
          
          <li class="nav-category">Manage</li>
          <li>
            <router-link to="/quotations" active-class="active-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span class="nav-text">Quotations</span>
            </router-link>
          </li>
          
          <li>
            <router-link to="/orders" active-class="active-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <span class="nav-text">My Orders</span>
            </router-link>
          </li>
          
          <li class="nav-category">Communication</li>
          <li>
            <router-link to="/chat" class="chat-link" active-class="active-link">
              <div class="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span v-if="chatUnreadCount > 0" class="cart-pulse"></span>
              </div>
              <span class="nav-text">Messages</span>
              <span v-if="chatUnreadCount > 0" class="cart-badge">{{ chatUnreadCount }}</span>
            </router-link>
          </li>
        </template>
        
        <!-- Catering Provider Links -->
        <template v-if="isProvider">
          <li class="nav-category">Overview</li>
          <li><router-link to="/provider/dashboard" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span class="nav-text">Dashboard</span>
          </router-link></li>
          
          <li class="nav-category">Management</li>
          <li><router-link to="/provider/orders" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span class="nav-text">Orders</span>
          </router-link></li>
          
          <li><router-link to="/provider/quotations" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span class="nav-text">Quotations</span>
          </router-link></li>
          
          <li><router-link to="/provider/menu" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            <span class="nav-text">Menu</span>
          </router-link></li>
          
          <li><router-link to="/provider/events" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span class="nav-text">Events</span>
          </router-link></li>
          
          <li class="nav-category">Operations</li>
          <li><router-link to="/provider/reports" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            <span class="nav-text">Reports</span>
          </router-link></li>
          
          <li><router-link to="/provider/inventory" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>
            <span class="nav-text">Inventory</span>
          </router-link></li>
          
          <li><router-link to="/provider/logistics" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <span class="nav-text">Logistics</span>
          </router-link></li>
          
          <li><router-link to="/provider/profile" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span class="nav-text">Profile</span>
          </router-link></li>
          
          <li class="nav-category">Communication</li>
          <li><router-link to="/provider/chat" class="chat-link" active-class="active-link">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span v-if="chatUnreadCount > 0" class="cart-pulse"></span>
            </div>
            <span class="nav-text">Messages</span>
            <span v-if="chatUnreadCount > 0" class="cart-badge">{{ chatUnreadCount }}</span>
          </router-link></li>
        </template>

        <!-- Super Admin Links -->
        <template v-if="isSuperAdmin">
          <li class="nav-category">System</li>
          <li><router-link to="/superadmin/dashboard" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span class="nav-text">Dashboard</span>
          </router-link></li>
          
          <li><router-link to="/superadmin/provider-approval" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            <span class="nav-text">Approvals</span>
          </router-link></li>
          
          <li><router-link to="/superadmin/user-management" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span class="nav-text">Users</span>
          </router-link></li>
          
          <li><router-link to="/superadmin/settings" active-class="active-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span class="nav-text">Settings</span>
          </router-link></li>
        </template>
      </ul>
    </div>

    <div class="user-menu">
      <button @click="logout" class="logout-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span class="nav-text">Sign Out</span>
      </button>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useChatStore } from '@/stores/chat'

export default {
  mounted() {
    const authStore = useAuthStore()
    if (authStore.isAuthenticated && authStore.user?.role !== 'superadmin') {
      const chatStore = useChatStore()
      chatStore.startPolling()
    }
  },
  beforeUnmount() {
    const chatStore = useChatStore()
    chatStore.stopPolling()
  },
  computed: {
    isCustomer() {
      const authStore = useAuthStore()
      return authStore.isCustomer
    },
    isProvider() {
      const authStore = useAuthStore()
      return authStore.isCateringProvider
    },
    isSuperAdmin() {
      const authStore = useAuthStore()
      return authStore.isSuperAdmin
    },
    userRole() {
      const authStore = useAuthStore()
      return authStore.user?.role || ''
    },
    roleLabel() {
      const role = this.userRole
      if (role === 'customer') return 'Customer'
      if (role === 'cateringProvider') return 'Provider'
      if (role === 'superadmin') return 'Admin'
      return 'User'
    },
    userName() {
      const authStore = useAuthStore()
      return authStore.user?.fullName || authStore.user?.username || 'User'
    },
    cartCount() {
      const cartStore = useCartStore()
      return cartStore.cartItemCount
    },
    chatUnreadCount() {
      const chatStore = useChatStore()
      return chatStore.unreadCount
    }
  },
  methods: {
    logout() {
      const authStore = useAuthStore()
      authStore.logout()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 260px;
  background: #1a2332;
  color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  transition: width 0.3s ease;
}

.nav-header {
  padding: 30px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.nav-brand {
  font-size: 16px;
  margin: 0 0 4px 0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #f8fafc;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.4);
  flex-shrink: 0;
}

.role-badge.superadmin {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}

.role-badge.superadmin .status-dot {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}

.role-badge.cateringProvider {
  background: rgba(6, 182, 212, 0.15);
  color: #67e8f9;
}

.role-badge.cateringProvider .status-dot {
  background: #06b6d4;
  box-shadow: 0 0 8px rgba(6, 182, 212, 0.4);
}

.nav-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  overflow-x: hidden;
}

/* Scrollbar styling */
.nav-content::-webkit-scrollbar {
  width: 4px;
}

.nav-content::-webkit-scrollbar-track {
  background: transparent;
}

.nav-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-category {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #64748b;
  font-weight: 600;
  margin: 24px 0 12px 12px;
}

.nav-category:first-child {
  margin-top: 0;
}

.nav-links li {
  margin-bottom: 4px;
}

.nav-links a {
  display: flex;
  align-items: center;
  padding: 12px;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  font-size: 14px;
  position: relative;
  overflow: hidden;
}

/* Icon wrapper creates space even if empty */
.icon-wrapper {
  position: relative;
  margin-right: 12px;
  display: flex;
  align-items: center;
  min-width: 20px;
  justify-content: center;
}

.nav-links a svg {
  margin-right: 12px;
  transition: transform 0.2s;
  stroke-width: 2px;
  opacity: 0.7;
  flex-shrink: 0;
}

.nav-links a .icon-wrapper svg {
  margin-right: 0;
}


.nav-text {
  white-space: nowrap;
}

.nav-links a:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.05);
}

.nav-links a:hover svg {
  transform: translateX(2px);
  opacity: 1;
}

.nav-links a.active-link {
  background: linear-gradient(90deg, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%);
  color: #22d3ee;
}

.nav-links a.active-link svg {
  color: #22d3ee;
  opacity: 1;
}

.nav-links a.active-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #22d3ee;
  border-radius: 0 4px 4px 0;
  box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
}

/* Cart Specific Styles */
.cart-link {
  display: flex;
  align-items: center;
}

.cart-badge {
  background: #ef4444;
  color: white;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  margin-left: auto;
  padding: 0 6px;
  box-shadow: 0 2px 5px rgba(239, 68, 68, 0.4);
}

.cart-pulse {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 1px solid #1a2332;
  box-shadow: 0 0 0 rgba(239, 68, 68, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.user-menu {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
}

.logout-btn {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: #94a3b8;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 500;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.logout-btn svg {
  width: 18px;
  height: 18px;
}
</style>
