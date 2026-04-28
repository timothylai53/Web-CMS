import { defineStore } from 'pinia'
import { quotationAPI } from '@/services/api'
import { useAuthStore } from './auth'

export const useQuotationsStore = defineStore('quotations', {
  state: () => ({
    quotations: [],
    loading: false,
    error: null
  }),

  getters: {
    allQuotations: (state) => state.quotations,
    
    customerQuotations: (state) => (customerId) => {
      return state.quotations.filter(q => q.userId === customerId)
    },

    pendingQuotations: (state) => {
      return state.quotations.filter(q => q.status === 'pending')
    },

    quotedQuotations: (state) => {
      return state.quotations.filter(q => q.status === 'quoted' || q.status === 'quotedEdited')
    }
  },

  actions: {
    async submitQuotation(quotationData) {
      try {
        const response = await quotationAPI.createQuotation(quotationData)
        this.quotations.push(response.data.quotation)
        return response.data.quotation
      } catch (error) {
        console.error('Error submitting quotation:', error)
        this.error = error.response?.data?.message || 'Failed to submit quotation'
        throw error
      }
    },

    async fetchMyQuotations() {
      try {
        this.loading = true
        const response = await quotationAPI.getMyQuotations()
        this.quotations = response.data
        this.error = null
      } catch (error) {
        console.error('Error fetching quotations:', error)
        this.error = error.response?.data?.message || 'Failed to fetch quotations'
      } finally {
        this.loading = false
      }
    },

    async fetchAllQuotations() {
      try {
        this.loading = true
        const response = await quotationAPI.getAllQuotations()
        this.quotations = response.data
        this.error = null
      } catch (error) {
        console.error('Error fetching all quotations:', error)
        this.error = error.response?.data?.message || 'Failed to fetch quotations'
      } finally {
        this.loading = false
      }
    },

    async updateQuotation(quotationId, updateData) {
      try {
        const response = await quotationAPI.updateQuotation(quotationId, updateData)
        const index = this.quotations.findIndex(q => q._id === quotationId)
        if (index !== -1) {
          this.quotations[index] = response.data.quotation
        }
        return response.data.quotation
      } catch (error) {
        console.error('Error updating quotation:', error)
        throw error
      }
    },

    async updateQuotationStatus(quotationId, status, adminNotes = null, quotedAmount = null) {
      const updateData = { status }
      if (adminNotes) updateData.adminNotes = adminNotes
      if (quotedAmount !== null) updateData.quotedAmount = quotedAmount
      
      return await this.updateQuotation(quotationId, updateData)
    },

    async acceptQuotation(quotationId) {
      try {
        const response = await quotationAPI.acceptQuotation(quotationId)
        const index = this.quotations.findIndex(q => q._id === quotationId)
        if (index !== -1) {
          this.quotations[index] = response.data.quotation
        }
        return response.data.quotation
      } catch (error) {
        console.error('Error accepting quotation:', error)
        throw error
      }
    },

    async rejectQuotation(quotationId) {
      try {
        const response = await quotationAPI.rejectQuotation(quotationId)
        const index = this.quotations.findIndex(q => q._id === quotationId)
        if (index !== -1) {
          this.quotations[index] = response.data.quotation
        }
        return response.data.quotation
      } catch (error) {
        console.error('Error rejecting quotation:', error)
        throw error
      }
    },

    async loadFromStorage() {
      // Load from API based on user role
      const authStore = useAuthStore()
      if (authStore.isAdmin) {
        await this.fetchAllQuotations()
      } else if (authStore.isAuthenticated) {
        await this.fetchMyQuotations()
      }
    }
  }
})