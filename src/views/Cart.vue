<template>
  <div class="cart-page">
    <Navbar />
    
    <div class="cart-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1>Your Shopping Cart</h1>
          <p class="hero-subtitle">Review your selected packages and items</p>
        </div>
      </div>

      <div class="cart-content">
        <div v-if="cartItems.length === 0" class="empty-state">
          <div class="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't made any selections yet.</p>
          <router-link to="/home" class="btn-primary">Browse Menu</router-link>
        </div>

        <div v-else class="cart-grid">
          <!-- Cart Items List -->
          <div class="items-section">
            <div v-for="item in cartItems" :key="item.id" class="cart-card">
              <div class="card-header">
                <div>
                  <h3>{{ item.name }}</h3>
                  <div class="provider-badge">
                    {{ item.providerName || 'Provider' }}
                  </div>
                </div>
                <button @click="removeItem(item.id)" class="btn-icon delete" title="Remove Item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>

              <div class="card-body">
                <p class="description">{{ item.description }}</p>
                
                <!-- Selected Items Summary -->
                <div class="selected-items-tags">
                  <span v-for="(food, index) in item.foods" :key="'food-'+index" class="tag">{{ food }}</span>
                  <span v-for="(drink, index) in item.drinks" :key="'drink-'+index" class="tag">{{ drink }}</span>
                  <span v-for="(cake, index) in item.cakes" :key="'cake-'+index" class="tag">{{ cake }}</span>
                </div>

                <div v-if="item.remark" class="remark-box">
                  <span class="label">Note:</span> {{ item.remark }}
                </div>
              </div>

              <div class="card-footer">
                <div class="price-info">
                  <span class="price-label">Price per pax</span>
                  <span class="price-value">RM {{ item.price }}</span>
                </div>

                <div class="quantity-control">
                  <button @click="decreaseQuantity(item.id)" class="qty-btn" :disabled="item.quantity <= 1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                  <div class="qty-input">
                    <input 
                      type="number" 
                      :value="item.quantity" 
                      @change="updateQuantity(item.id, $event.target.value)"
                      min="1"
                    />
                    <span>pax</span>
                  </div>
                  <button @click="increaseQuantity(item.id)" class="qty-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>

                <div class="total-price">
                  <span class="label">Total</span>
                  <span class="value">RM {{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="summary-section">
            <div class="summary-card">
              <h3>Order Summary</h3>
              
              <div class="summary-row">
                <span>Subtotal</span>
                <span>RM {{ cartTotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Service Fee (5%)</span>
                <span>RM {{ (cartTotal * 0.05).toFixed(2) }}</span>
              </div>
              
              <div class="divider"></div>
              
              <div class="summary-row total">
                <span>Total Amount</span>
                <span>RM {{ (cartTotal * 1.05).toFixed(2) }}</span>
              </div>

              <div class="action-buttons">
                <router-link to="/checkout" class="btn-checkout">
                  Proceed to Checkout
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </router-link>
                <router-link to="/menu" class="btn-continue">
                  Continue Shopping
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '@/stores/cart'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  computed: {
    cartItems() {
      const cartStore = useCartStore()
      return cartStore.cartItems
    },
    cartTotal() {
      const cartStore = useCartStore()
      return cartStore.cartTotal
    }
  },
  methods: {
    removeItem(itemId) {
      const cartStore = useCartStore()
      if (confirm('Remove this item from cart?')) {
        cartStore.removeFromCart(itemId)
      }
    },
    increaseQuantity(itemId) {
      const cartStore = useCartStore()
      const item = this.cartItems.find(i => i.id === itemId)
      if (item) {
        cartStore.updateQuantity(itemId, item.quantity + 1)
      }
    },
    decreaseQuantity(itemId) {
      const cartStore = useCartStore()
      const item = this.cartItems.find(i => i.id === itemId)
      if (item && item.quantity > 1) {
        cartStore.updateQuantity(itemId, item.quantity - 1)
      }
    },
    updateQuantity(itemId, value) {
      const cartStore = useCartStore()
      const quantity = parseInt(value)
      if (quantity > 0) {
        cartStore.updateQuantity(itemId, quantity)
      }
    }
  },
  mounted() {
    const cartStore = useCartStore()
    cartStore.loadFromStorage()
  }
}
</script>


<style scoped>
.cart-page {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

.cart-container {
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
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
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

/* Cart Content */
.cart-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 50px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 24px;
  color: #0f172a;
  margin-bottom: 10px;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 30px;
}

/* Cart Grid */
.cart-grid {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
}

/* Cart Items */
.items-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.2s;
}

.cart-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  border-color: #cbd5e1;
}

.card-header {
  padding: 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 5px 0;
}

.provider-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #0891b2;
  background: #ecfeff;
  padding: 4px 10px;
  border-radius: 20px;
}

.btn-icon {
  background: none;
  border: none;
  color: #94a3b8;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #fef2f2;
  color: #ef4444;
}

.card-body {
  padding: 20px;
}

.description {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.selected-items-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tag {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.remark-box {
  background: #fffbeb;
  border: 1px solid #fcd34d;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 13px;
  color: #92400e;
}

.remark-box .label {
  font-weight: 600;
}

.card-footer {
  padding: 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.price-info {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 12px;
  color: #64748b;
}

.price-value {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.quantity-control {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 4px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: white;
  border-radius: 8px;
  color: #0f172a;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background: #06b6d4;
  color: white;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f1f5f9;
}

.qty-input {
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 4px;
}

.qty-input input {
  width: 40px;
  text-align: center;
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 16px;
  color: #0f172a;
}

.qty-input input:focus {
  outline: none;
}

.qty-input span {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.total-price {
  text-align: right;
  min-width: 100px;
}

.total-price .label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 2px;
}

.total-price .value {
  font-size: 18px;
  font-weight: 800;
  color: #0891b2;
}

/* Summary Section */
.summary-section {
  position: relative;
}

.summary-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  position: sticky;
  top: 20px;
}

.summary-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 20px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #64748b;
}

.summary-row.total {
  color: #0f172a;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 0;
}

.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 20px 0;
}

.action-buttons {
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-checkout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #06b6d4;
  color: white;
  padding: 14px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  width: 100%;
}

.btn-checkout:hover {
  background: #0891b2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);
}

.btn-continue {
  display: block;
  text-align: center;
  padding: 12px;
  color: #64748b;
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
}

.btn-continue:hover {
  color: #0f172a;
}

@media (max-width: 1024px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-container {
    margin-left: 70px;
  }

  .cart-content {
    padding: 20px;
  }

  .hero-section {
    padding: 30px 20px;
  }

  .card-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .price-info, .total-price {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .quantity-control {
    justify-content: space-between;
  }
}
</style>
