/**
 * Router Configuration
 * Role: All Users
 * Function: Defines application routes and navigation guards
 * Features:
 *   - Public routes (login, register)
 *   - Customer routes (menu, orders, quotations)
 *   - Catering Provider routes (manage menu, orders, events)
 *   - Super Admin routes (user management, provider approval, settings)
 *   - Role-based access control
 *   - Approval status checking for providers
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Public Views
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ResetPassword from '../views/ResetPassword.vue'

// Customer Views
import Home from '../views/Home.vue'
import Menu from '@/views/Menu.vue'
import Cart from '@/views/Cart.vue'
import Checkout from '@/views/Checkout.vue'
import Payment from '@/views/Payment.vue'
import PaymentSuccess from '@/views/PaymentSuccess.vue'
import Orders from '@/views/Orders.vue'
import Quotations from '@/views/Quotations.vue'

// Catering Provider Views (renamed from Admin)
import CateringProviderDashboard from '@/views/CateringProviderDashboard.vue'
import CateringProviderOrders from '@/views/CateringProviderOrders.vue'
import CateringProviderMenu from '@/views/CateringProviderMenu.vue'
import CateringProviderEvents from '@/views/CateringProviderEvents.vue'
import CateringProviderReports from '@/views/CateringProviderReports.vue'
import CateringProviderQuotations from '@/views/CateringProviderQuotations.vue'
import CateringProviderProfile from '@/views/CateringProviderProfile.vue'
import CateringProviderInventory from '@/views/CateringProviderInventory.vue'
import CateringProviderEquipmentLogistics from '@/views/CateringProviderEquipmentLogistics.vue'

// Super Admin Views
import SuperAdminDashboard from '@/views/SuperAdminDashboard.vue'
import SuperAdminProviderApproval from '@/views/SuperAdminProviderApproval.vue'
import SuperAdminUserManagement from '@/views/SuperAdminUserManagement.vue'
import SuperAdminSettings from '@/views/SuperAdminSettings.vue'

// Chat Views
import Chat from '@/views/Chat.vue'
import CateringProviderChat from '@/views/CateringProviderChat.vue'

const routes = [
  // Public Routes
  { 
    path: '/', 
    name: 'Login', 
    component: Login,
    meta: { requiresAuth: false }
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { requiresAuth: false }
  },

  // Customer Routes
  { 
    path: '/home', 
    name: 'Home', 
    component: Home,
    meta: { requiresAuth: true, role: 'customer' }
  },
  { 
    path: '/menu', 
    name: 'Menu', 
    component: Menu,
    meta: { requiresAuth: true, role: 'customer' }
  },
  { 
    path: '/cart', 
    name: 'Cart', 
    component: Cart,
    meta: { requiresAuth: true, role: 'customer' }
  },
  { 
    path: '/checkout', 
    name: 'Checkout', 
    component: Checkout,
    meta: { requiresAuth: true, role: 'customer' }
  },
  { 
    path: '/payment', 
    name: 'Payment', 
    component: Payment,
    meta: { requiresAuth: true, role: 'customer' }
  },
  { 
    path: '/payment/success/:orderId', 
    name: 'PaymentSuccess', 
    component: PaymentSuccess,
    meta: { requiresAuth: true, role: 'customer' }
  },
  { 
    path: '/orders', 
    name: 'Orders', 
    component: Orders,
    meta: { requiresAuth: true, role: 'customer' }
  },
  { 
    path: '/quotations', 
    name: 'Quotations', 
    component: Quotations,
    meta: { requiresAuth: true, role: 'customer' }
  },
  { 
    path: '/chat', 
    name: 'Chat', 
    component: Chat,
    meta: { requiresAuth: true, role: 'customer' }
  },

  // Catering Provider Routes (renamed from /admin to /provider)
  { 
    path: '/provider/dashboard', 
    name: 'CateringProviderDashboard', 
    component: CateringProviderDashboard,
    meta: { requiresAuth: true, role: 'cateringProvider', requiresApproval: true }
  },
  { 
    path: '/provider/orders', 
    name: 'CateringProviderOrders', 
    component: CateringProviderOrders,
    meta: { requiresAuth: true, role: 'cateringProvider', requiresApproval: true }
  },
  { 
    path: '/provider/menu', 
    name: 'CateringProviderMenu', 
    component: CateringProviderMenu,
    meta: { requiresAuth: true, role: 'cateringProvider', requiresApproval: true }
  },
  { 
    path: '/provider/events', 
    name: 'CateringProviderEvents', 
    component: CateringProviderEvents,
    meta: { requiresAuth: true, role: 'cateringProvider', requiresApproval: true }
  },
  { 
    path: '/provider/reports', 
    name: 'CateringProviderReports', 
    component: CateringProviderReports,
    meta: { requiresAuth: true, role: 'cateringProvider', requiresApproval: true }
  },
  { 
    path: '/provider/profile', 
    name: 'CateringProviderProfile', 
    component: CateringProviderProfile,
    meta: { requiresAuth: true, role: 'cateringProvider', requiresApproval: true }
  },
  { 
    path: '/provider/quotations', 
    name: 'CateringProviderQuotations', 
    component: CateringProviderQuotations,
    meta: { requiresAuth: true, role: 'cateringProvider', requiresApproval: true }
  },
  { 
    path: '/provider/inventory', 
    name: 'CateringProviderInventory', 
    component: CateringProviderInventory,
    meta: { requiresAuth: true, role: 'cateringProvider', requiresApproval: true }
  },
  { 
    path: '/provider/logistics', 
    name: 'CateringProviderEquipmentLogistics', 
    component: CateringProviderEquipmentLogistics,
    meta: { requiresAuth: true, role: 'cateringProvider', requiresApproval: true }
  },
  { 
    path: '/provider/chat', 
    name: 'CateringProviderChat', 
    component: CateringProviderChat,
    meta: { requiresAuth: true, role: 'cateringProvider', requiresApproval: true }
  },

  // Legacy admin routes (redirect to provider routes for backward compatibility)
  { path: '/admin/dashboard', redirect: '/provider/dashboard' },
  { path: '/admin/orders', redirect: '/provider/orders' },
  { path: '/admin/menu', redirect: '/provider/menu' },
  { path: '/admin/events', redirect: '/provider/events' },
  { path: '/admin/reports', redirect: '/provider/reports' },
  { path: '/admin/quotations', redirect: '/provider/quotations' },

  // Super Admin Routes
  { 
    path: '/superadmin/dashboard', 
    name: 'SuperAdminDashboard', 
    component: SuperAdminDashboard,
    meta: { requiresAuth: true, role: 'superadmin' }
  },
  { 
    path: '/superadmin/provider-approval', 
    name: 'SuperAdminProviderApproval', 
    component: SuperAdminProviderApproval,
    meta: { requiresAuth: true, role: 'superadmin' }
  },
  { 
    path: '/superadmin/user-management', 
    name: 'SuperAdminUserManagement', 
    component: SuperAdminUserManagement,
    meta: { requiresAuth: true, role: 'superadmin' }
  },
  { 
    path: '/superadmin/settings', 
    name: 'SuperAdminSettings', 
    component: SuperAdminSettings,
    meta: { requiresAuth: true, role: 'superadmin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Load auth from storage if not loaded
  if (!authStore.isAuthenticated && (sessionStorage.getItem('token') || localStorage.getItem('token'))) {
    authStore.loadFromStorage()
  }

  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = authStore.isAuthenticated

  // Public routes - allow access
  if (requiresAuth === false) {
    next()
    return
  }

  // Protected routes - require authentication
  if (requiresAuth && !isAuthenticated) {
    if (to.path !== '/') {
      next('/')
    } else {
      next()
    }
    return
  }

  // User is authenticated
  if (isAuthenticated) {
    const userRole = authStore.user?.role
    const requiredRole = to.meta.role
    const approvalStatus = authStore.user?.approvalStatus
    const isActive = authStore.user?.isActive

    // Check if account is deactivated
    if (isActive === false) {
      authStore.logout()
      next('/')
      return
    }

    // Check provider approval
    if (userRole === 'cateringProvider' && approvalStatus !== 'approved') {
      if (to.path !== '/') {
        authStore.logout()
        next('/')
      } else {
        next()
      }
      return
    }

    // Check role-based access
    if (requiredRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard
      if (userRole === 'superadmin') {
        next('/superadmin/dashboard')
      } else if (userRole === 'cateringProvider') {
        next('/provider/dashboard')
      } else {
        next('/dashboard')
      }
      return
    }
  }

  next()
})

export default router
