import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    quotationRequest: null
  }),

  getters: {
    cartItemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    
    cartTotal: (state) => state.items.reduce((total, item) => {
      const baseTotal = (Number(item.price) || 0) * (Number(item.quantity) || 0)
      const waiterTotal = item.wantsWaiters
        ? (Number(item.waiterFee) || 0) * (Number(item.waiterQuantity) || 0)
        : 0
      const venueTotal = item.wantsVenue
        ? (Number(item.venueFee) || 0)
        : 0
      return total + baseTotal + waiterTotal + venueTotal
    }, 0),
    
    cartItems: (state) => state.items
  },

  actions: {
    addToCart(item) {
      const existingItem = this.items.find(i => i.id === item.id)
      if (existingItem) {
        existingItem.quantity += item.quantity || 1
      } else {
        this.items.push({
          ...item,
          quantity: item.quantity || 1
        })
      }
      this.saveToStorage()
    },

    removeFromCart(itemId) {
      this.items = this.items.filter(item => item.id !== itemId)
      this.saveToStorage()
    },

    updateQuantity(itemId, quantity) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        item.quantity = Math.max(1, quantity)
        this.saveToStorage()
      }
    },

    clearCart() {
      this.items = []
      this.saveToStorage()
    },

    saveQuotationRequest(data) {
      this.quotationRequest = data
    },

    saveToStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    loadFromStorage() {
      const cart = localStorage.getItem('cart')
      if (cart) {
        this.items = JSON.parse(cart)
      }
    }
  }
})
