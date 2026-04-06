import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    quotationRequest: null
  }),

  getters: {
    cartItemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    
    cartTotal: (state) => state.items.reduce((total, item) => {
      return total + (item.price * item.quantity)
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
