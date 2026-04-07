/**
 * Authentication Store
 * Role: All Users
 * Function: Manages user authentication, login, registration, and session
 * Features:
 *   - Login/logout functionality
 *   - Registration for customers and catering providers
 *   - Token management (JWT)
 *   - Role-based access control
 *   - Provider approval status checking
 */
import { defineStore } from 'pinia'
import { authAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: null
  }),

  getters: {
    // Role checking getters
    isAdmin: (state) => state.user?.role === 'cateringProvider' || state.user?.role === 'admin', // Legacy support - checks both old and new roles
    isCateringProvider: (state) => state.user?.role === 'cateringProvider',
    isSuperAdmin: (state) => state.user?.role === 'superadmin',
    isCustomer: (state) => state.user?.role === 'customer',
    
    // Provider approval status
    isProviderPending: (state) => 
      state.user?.role === 'cateringProvider' && state.user?.approvalStatus === 'pending',
    isProviderApproved: (state) => 
      state.user?.role === 'cateringProvider' && state.user?.approvalStatus === 'approved',
    isProviderRejected: (state) => 
      state.user?.role === 'cateringProvider' && state.user?.approvalStatus === 'rejected',
    
    // Account status
    isAccountActive: (state) => state.user?.isActive !== false,
    
    currentUser: (state) => state.user
  },

  actions: {
    async login(email, password) {
      try {
        const response = await authAPI.login({ email, password })
        
        this.token = response.data.token
        this.user = response.data.user
        this.isAuthenticated = true
        
        sessionStorage.setItem('token', this.token)
        sessionStorage.setItem('user', JSON.stringify(this.user))
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // Check if account is deactivated
        if (this.user.isActive === false) {
          return {
            success: false,
            message: 'Your account has been deactivated. Please contact support.'
          }
        }
        
        // Check if catering provider is pending approval
        if (this.user.role === 'cateringProvider' && this.user.approvalStatus === 'pending') {
          return {
            success: false,
            message: 'Your catering provider application is pending approval.',
            isPending: true
          }
        }
        
        // Check if catering provider is rejected
        if (this.user.role === 'cateringProvider' && this.user.approvalStatus === 'rejected') {
          return {
            success: false,
            message: `Your application was rejected. Reason: ${this.user.rejectionReason || 'Not specified'}`,
            isRejected: true
          }
        }
        
        return { success: true, role: this.user.role }
      } catch (error) {
        console.error('Login error:', error)
        return { 
          success: false, 
          message: error.response?.data?.message || 'Login failed' 
        }
      }
    },

    async register(userData) {
      try {
        const response = await authAPI.register(userData)
        
        // For catering providers, don't auto-login (they need approval)
        if (userData.role === 'cateringProvider') {
          return { 
            success: true, 
            isPending: true,
            message: 'Application submitted successfully. Awaiting admin approval.' 
          }
        }
        
        // For customers, auto-login
        this.token = response.data.token
        this.user = response.data.user
        this.isAuthenticated = true
        
        sessionStorage.setItem('token', this.token)
        sessionStorage.setItem('user', JSON.stringify(this.user))
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        return { success: true }
      } catch (error) {
        console.error('Registration error:', error)
        console.error('Error response:', error.response?.data)
        return { 
          success: false, 
          message: error.response?.data?.message || error.response?.data?.error || 'Registration failed' 
        }
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      this.token = null
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    loadFromStorage() {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token')
      const user = sessionStorage.getItem('user') || localStorage.getItem('user')
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.isAuthenticated = true
        if (!sessionStorage.getItem('token') || !sessionStorage.getItem('user')) {
          sessionStorage.setItem('token', token)
          sessionStorage.setItem('user', user)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
    }
  }
})
