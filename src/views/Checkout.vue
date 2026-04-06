<template>
  <div class="checkout-page">
    <Navbar />
    
    <div class="checkout-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1>Secure Checkout</h1>
          <p class="hero-subtitle">Complete your order details to finalize your event catering.</p>
        </div>
      </div>

      <div class="checkout-content">
        <div class="checkout-grid">
          
          <!-- Left: Order Form -->
          <div class="checkout-form">
            
            <!-- Contact Information -->
            <div class="form-card">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Contact Information
              </h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Full Name *</label>
                  <input type="text" v-model="formData.fullName" placeholder="e.g. John Doe" required />
                </div>
                <div class="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" v-model="formData.phone" placeholder="e.g. 012-3456789" required />
                </div>
              </div>
              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" v-model="formData.email" placeholder="e.g. john@example.com" required />
              </div>
            </div>

            <!-- Event Details -->
            <div class="form-card">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Event Details
              </h3>
              <div class="form-row">
                <div class="form-group">
                  <label>Event Date *</label>
                  <input type="date" v-model="formData.eventDate" required />
                </div>
                <div class="form-group">
                  <label>Event Time *</label>
                  <input type="time" v-model="formData.eventTime" required />
                </div>
              </div>
              <div class="form-group">
                <label>Event Location / Venue Address *</label>
                <textarea v-model="formData.eventLocation" rows="3" placeholder="Enter full address of the venue..." required></textarea>
              </div>
            </div>

            <!-- Special Instructions -->
            <div class="form-card">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Additional Notes
              </h3>
              <div class="form-group">
                <label>Special Requests (Optional)</label>
                <textarea 
                  v-model="formData.notes" 
                  rows="4" 
                  placeholder="Any dietary requirements, allergies, or specific delivery instructions..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Right: Order Summary -->
          <div class="summary-wrapper">
            <div class="summary-card">
              <h3>Order Summary</h3>
              
              <div class="order-items">
                <div v-for="item in cartItems" :key="item.id" class="order-item">
                  <div class="item-details">
                    <h4>{{ item.name }}</h4>
                    <p class="item-meta">{{ item.quantity }} pax × RM {{ item.price }}</p>
                  </div>
                  <div class="item-price">
                    RM {{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                </div>
              </div>

              <div class="pricing-breakdown">
                <div class="price-row">
                  <span>Subtotal</span>
                  <span>RM {{ cartTotal.toFixed(2) }}</span>
                </div>
                <div class="price-row">
                  <span>Service Fee (5%)</span>
                  <span>RM {{ serviceFee.toFixed(2) }}</span>
                </div>
                <div class="price-row">
                  <span>Delivery Fee</span>
                  <span>RM {{ deliveryFee.toFixed(2) }}</span>
                </div>
                <div class="divider"></div>
                <div class="price-row total">
                  <span>Total Amount</span>
                  <span>RM {{ grandTotal.toFixed(2) }}</span>
                </div>
              </div>

              <button 
                @click="proceedToPayment" 
                class="btn-submit"
                :disabled="!isFormValid"
              >
                <span>Proceed to Payment</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  data() {
    return {
      formData: {
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        fullName: '',
        phone: '',
        email: '',
        notes: ''
      },
      deliveryFee: 50
    }
  },
  computed: {
    cartItems() {
      const cartStore = useCartStore()
      return cartStore.cartItems
    },
    cartTotal() {
      const cartStore = useCartStore()
      return cartStore.cartTotal
    },
    serviceFee() {
      return this.cartTotal * 0.05
    },
    grandTotal() {
      return this.cartTotal + this.serviceFee + this.deliveryFee
    },
    isFormValid() {
      return this.formData.eventDate && 
             this.formData.eventTime && 
             this.formData.eventLocation &&
             this.formData.fullName &&
             this.formData.phone &&
             this.formData.email
    }
  },
  methods: {
    proceedToPayment() {
      if (!this.isFormValid) {
        alert('Please fill in all required fields')
        return
      }

      // Check if this is a quotation order
      const quotationOrder = sessionStorage.getItem('quotationOrder')
      const quotationData = quotationOrder ? JSON.parse(quotationOrder) : null

      // Save order data to session storage
      const firstItem = this.cartItems[0]
      
      // For quotation orders, use quotation data; otherwise use cart item data
      const providerId = quotationData?.providerId || firstItem?.providerId
      const packageId = quotationData?.packageId || firstItem?.packageId || firstItem?.id
      
      const checkoutData = {
        ...this.formData,
        items: this.cartItems,
        packageId: packageId,
        providerId: providerId,
        packageName: firstItem?.name,
        packagePrice: firstItem?.price,
        numberOfGuests: firstItem?.quantity,
        selectedFoods: firstItem?.foods || [],
        selectedDrinks: firstItem?.drinks || [],
        selectedCakes: firstItem?.cakes || [],
        subtotal: this.cartTotal,
        serviceFee: this.serviceFee,
        deliveryFee: this.deliveryFee,
        total: this.grandTotal
      }

      // Add quotation reference if this is from a quotation
      if (quotationData) {
        checkoutData.quotationId = quotationData.quotationId
        checkoutData.quotationNumber = quotationData.quotationNumber
        checkoutData.isQuotationOrder = true
      }

      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))

      this.$router.push('/payment')
    }
  },
  mounted() {
    const authStore = useAuthStore()
    const cartStore = useCartStore()
    
    if (this.cartItems.length === 0) {
      this.$router.push('/menu')
      return
    }

    // Pre-fill user data if available
    if (authStore.user) {
      this.formData.fullName = authStore.user.fullName || ''
      this.formData.email = authStore.user.email || ''
      this.formData.phone = authStore.user.phone || ''
    }

    // Check if this is a quotation order and pre-fill event data
    const quotationOrder = sessionStorage.getItem('quotationOrder')
    if (quotationOrder) {
      const quotationData = JSON.parse(quotationOrder)
      
      // Pre-fill event details from quotation
      if (quotationData.eventDate) {
        // Convert ISO date to YYYY-MM-DD format for input field
        const date = new Date(quotationData.eventDate)
        this.formData.eventDate = date.toISOString().split('T')[0]
      }
      if (quotationData.eventTime) {
        this.formData.eventTime = quotationData.eventTime
      }
      if (quotationData.location) {
        this.formData.eventLocation = quotationData.location
      }
    }
  }
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

.checkout-container {
  margin-left: 260px;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
  padding-bottom: 50px;
}

/* Hero Section */
.hero-section {
  position: relative;
  background: white;
  padding: 40px 50px;
  overflow: hidden;
  border-bottom: 1px solid #e2e8f0;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  color: #64748b;
  font-size: 16px;
  max-width: 600px;
  line-height: 1.5;
  margin: 0;
}

/* Checkout Content */
.checkout-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 50px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 30px;
  align-items: start;
}

/* Form Sections */
.form-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 25px;
}

.form-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 25px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 15px;
  color: #0f172a;
  transition: all 0.2s;
  background: #f8fafc;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #94a3b8;
}

/* Order Summary */
.summary-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  position: sticky;
  top: 20px;
}

.summary-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #f1f5f9;
}

.order-items {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 5px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px dashed #e2e8f0;
}

.order-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.item-details h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.item-meta {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.item-price {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.pricing-breakdown {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 10px;
}

.price-row.total {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #cbd5e1;
  color: #0f172a;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 0;
}

.btn-submit {
  width: 100%;
  background: #10b981;
  color: white;
  padding: 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
}

.btn-submit:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: #94a3b8;
  box-shadow: none;
}

/* Tablet adjustments */
@media (max-width: 1024px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-card {
    position: static;
    order: -1; /* Show summary first on mobile */
  }
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .checkout-container {
    margin-left: 70px;
  }
  
  .checkout-content {
    padding: 20px;
  }

  .hero-section {
    padding: 30px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>