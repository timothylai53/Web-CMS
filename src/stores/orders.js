import { defineStore } from 'pinia'
import { orderAPI } from '@/services/api'
import { useAuthStore } from './auth'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  }),

  getters: {
    userOrders: (state) => (userId) => {
      return state.orders.filter(order => order.userId === userId)
    },
    
    pendingOrders: (state) => {
      return state.orders.filter(order => order.status === 'pending')
    },

    allOrders: (state) => state.orders
  },

  actions: {
    async createOrder(orderData) {
      try {
        const response = await orderAPI.createOrder(orderData)
        this.orders.unshift(response.data.order)
        return response.data.order
      } catch (error) {
        console.error('Error creating order:', error)
        this.error = error.response?.data?.message || 'Failed to create order'
        throw error
      }
    },

    async fetchMyOrders() {
      try {
        this.loading = true
        const response = await orderAPI.getMyOrders()
        this.orders = response.data
        this.error = null
      } catch (error) {
        console.error('Error fetching orders:', error)
        this.error = error.response?.data?.message || 'Failed to fetch orders'
      } finally {
        this.loading = false
      }
    },

    async fetchAllOrders() {
      try {
        this.loading = true
        const response = await orderAPI.getAllOrders()
        this.orders = response.data
        this.error = null
      } catch (error) {
        console.error('Error fetching all orders:', error)
        this.error = error.response?.data?.message || 'Failed to fetch orders'
      } finally {
        this.loading = false
      }
    },

    async updateOrderStatus(orderId, status) {
      try {
        const response = await orderAPI.updateOrderStatus(orderId, status)
        const index = this.orders.findIndex(o => o._id === orderId)
        if (index !== -1) {
          this.orders[index] = response.data.order
        }
      } catch (error) {
        console.error('Error updating order status:', error)
        throw error
      }
    },

    async updatePaymentStatus(orderId, paymentStatus) {
      try {
        const response = await orderAPI.updatePaymentStatus(orderId, paymentStatus)
        const index = this.orders.findIndex(o => o._id === orderId)
        if (index !== -1) {
          this.orders[index] = response.data.order
        }
      } catch (error) {
        console.error('Error updating payment status:', error)
        throw error
      }
    },

    async updateDeliveryStatus(orderId, deliveryStatus) {
      try {
        const response = await orderAPI.updateDeliveryStatus(orderId, deliveryStatus)
        const index = this.orders.findIndex(o => o._id === orderId)
        if (index !== -1) {
          this.orders[index] = response.data.order
        }
      } catch (error) {
        console.error('Error updating delivery status:', error)
        throw error
      }
    },

    async loadFromStorage() {
      // Load from API based on user role
      const authStore = useAuthStore()
      if (authStore.isAdmin) {
        await this.fetchAllOrders()
      } else if (authStore.isAuthenticated) {
        await this.fetchMyOrders()
      }
    }
  }
})
