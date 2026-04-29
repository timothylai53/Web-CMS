<template>
  <div class="payment-page">
    <Navbar />

    <div class="payment-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1>Secure Payment</h1>
          <p class="hero-subtitle">Complete your transaction to confirm your catering booking.</p>
        </div>
      </div>

      <div class="payment-content">
        <div class="payment-grid">

          <!-- Left: Payment Form -->
          <div class="payment-form">

            <!-- Payment Method Selection -->
            <div class="form-card">
              <h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                Select Payment Method
              </h3>

              <div class="payment-methods">
                <label class="payment-method" :class="{ selected: paymentMethod === 'card' }">
                  <input type="radio" v-model="paymentMethod" value="card" />
                  <div class="method-icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                  <div class="method-info">
                    <span class="method-title">Credit/Debit Card</span>
                    <span class="method-desc">Pay securely with Visa or Mastercard</span>
                  </div>
                  <div class="check-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </label>

                <label class="payment-method" :class="{ selected: paymentMethod === 'fpx' }">
                  <input type="radio" v-model="paymentMethod" value="fpx" />
                  <div class="method-icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                  </div>
                  <div class="method-info">
                    <span class="method-title">Online Banking (FPX)</span>
                    <span class="method-desc">Maybank2u, CIMB Clicks, etc.</span>
                  </div>
                  <div class="check-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </label>

                <label class="payment-method" :class="{ selected: paymentMethod === 'ewallet' }">
                  <input type="radio" v-model="paymentMethod" value="ewallet" />
                  <div class="method-icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    </svg>
                  </div>
                  <div class="method-info">
                    <span class="method-title">E-Wallet</span>
                    <span class="method-desc">Touch 'n Go, GrabPay, Boost</span>
                  </div>
                  <div class="check-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </label>
              </div>
            </div>

            <!-- Card Details Form -->
            <transition name="fade" mode="out-in">
              <div v-if="paymentMethod === 'card'" class="form-card details-card">
                <h3>Card Details</h3>

                <div class="form-group">
                  <label>Cardholder Name *</label>
                  <div class="input-with-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <input type="text" v-model="cardDetails.name" placeholder="Name on card" required />
                  </div>
                </div>

                <div class="form-group">
                  <label>Credit / Debit Card *</label>
                  <div id="card-element" class="form-input"
                    style="padding: 14px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px;"></div>
                  <div id="card-errors" role="alert" style="color: #ef4444; font-size: 13px; margin-top: 8px;"></div>
                </div>
              </div>

              <!-- FPX Form -->
              <div v-else-if="paymentMethod === 'fpx'" class="form-card details-card">
                <h3>Select Your Bank</h3>
                <div class="form-group">
                  <select v-model="fpxBank" required class="full-select">
                    <option value="">-- Choose Bank --</option>
                    <option value="maybank2u">Maybank</option>
                    <option value="cimb">CIMB Bank</option>
                    <option value="public_bank">Public Bank</option>
                    <option value="rhb">RHB Bank</option>
                    <option value="hong_leong_bank">Hong Leong Bank</option>
                    <option value="ambank">AmBank</option>
                    <option value="bsn">Bank Simpanan Nasional</option>
                  </select>
                </div>
                <div class="info-alert">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <p>You will be redirected to your bank's secure login page to complete the transaction.</p>
                </div>
              </div>

              <!-- E-Wallet Form -->
              <div v-else-if="paymentMethod === 'ewallet'" class="form-card details-card">
                <h3>Select E-Wallet</h3>
                <div class="form-group">
                  <label>E-Wallet Provider *</label>
                  <select v-model="ewalletProvider" required class="full-select">
                    <option value="">-- Choose E-Wallet --</option>
                    <option value="tng">Touch 'n Go eWallet</option>
                    <option value="grabpay">GrabPay</option>
                    <option value="boost">Boost</option>
                    <option value="shopeepay">ShopeePay</option>
                  </select>
                </div>
                <div class="info-alert">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                    <line x1="12" y1="20" x2="12.01" y2="20"></line>
                  </svg>
                  <p>Open your e-wallet app to scan the QR code on the next screen.</p>
                </div>
              </div>
            </transition>

            <div class="security-note">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Your payment information is encrypted and secure.</span>
            </div>
          </div>

          <!-- Right: Order Summary -->
          <div class="summary-wrapper">
            <div class="summary-card">
              <h3>Order Summary</h3>

              <div class="pricing-breakdown">
                <div class="price-row">
                  <span>Subtotal</span>
                  <span>RM {{ orderData.subtotal?.toFixed(2) }}</span>
                </div>
                <div class="price-row">
                  <span>Service Fee (5%)</span>
                  <span>RM {{ orderData.serviceFee?.toFixed(2) }}</span>
                </div>
                <div class="price-row">
                  <span>Delivery Fee</span>
                  <span>RM {{ orderData.deliveryFee?.toFixed(2) }}</span>
                </div>
                <div class="divider"></div>
                <div class="price-row total">
                  <span>Total Due</span>
                  <span>RM {{ orderData.total?.toFixed(2) }}</span>
                </div>
              </div>

              <div class="event-details-preview">
                <h4>Event Details</h4>
                <div class="preview-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{{ orderData.eventDate }} at {{ orderData.eventTime }}</span>
                </div>
                <div class="preview-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span class="truncate">{{ orderData.eventLocation }}</span>
                </div>
                <div class="preview-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>{{ orderData.numberOfGuests }} Guests</span>
                </div>
              </div>

              <button @click="processPayment" class="btn-submit" :disabled="!canPay || isProcessing">
                <span v-if="!isProcessing">Pay RM {{ orderData.total?.toFixed(2) }}</span>
                <span v-else>Processing...</span>
                <svg v-if="!isProcessing" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
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
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'

export default {
  components: { Navbar },
  data() {
    return {
      paymentMethod: 'card',
      cardDetails: {
        name: '',
      },
      fpxBank: '',
      ewalletProvider: '',
      orderData: {},
      isProcessing: false,
      stripe: null,
      cardElement: null
    }
  },
  computed: {
    canPay() {
      if (this.paymentMethod === 'card') {
        return this.cardDetails.name !== ''
      } else if (this.paymentMethod === 'fpx') {
        return this.fpxBank !== ''
      } else if (this.paymentMethod === 'ewallet') {
        return this.ewalletProvider !== ''
      }
      return false
    }
  },
  watch: {
    paymentMethod(newVal) {
      if (newVal === 'card') {
        this.$nextTick(() => {
          if (this.cardElement) {
            this.cardElement.mount('#card-element');
          }
        });
      }
    }
  },
  methods: {
    async processPayment() {
      this.isProcessing = true;

      try {
        const ordersStore = useOrdersStore();
        const cartStore = useCartStore();
        const authStore = useAuthStore();

        if (!this.orderData.providerId) throw new Error('Provider ID missing.');

        // Validation checks
        if (this.paymentMethod === 'card' && !this.cardDetails.name) throw new Error("Please enter cardholder name.");
        if (this.paymentMethod === 'fpx' && !this.fpxBank) throw new Error("Please select a bank.");
        if (this.paymentMethod === 'ewallet' && !this.ewalletProvider) throw new Error("Please select an E-Wallet.");

        // 1. Prepare the Order Payload for MongoDB
        const orderPayload = {
          packageId: this.orderData.packageId,
          providerId: this.orderData.providerId,
          packageName: this.orderData.packageName,
          packagePrice: this.orderData.packagePrice,
          numberOfPax: this.orderData.numberOfGuests,
          totalAmount: this.orderData.total,
          eventDate: this.orderData.eventDate,
          eventTime: this.orderData.eventTime,
          location: this.orderData.eventLocation,
          customerName: this.orderData.fullName,
          customerPhone: this.orderData.phone,
          customerEmail: this.orderData.email || authStore.user?.email,
          selectedFoods: this.orderData.selectedFoods || [],
          selectedDrinks: this.orderData.selectedDrinks || [],
          selectedCakes: this.orderData.selectedCakes || [],
          specialRequests: this.orderData.notes || '',
          paymentStatus: 'pending' // Default to pending for now!
        };

        if (this.orderData.quotationId) {
          orderPayload.quotationId = this.orderData.quotationId;
          orderPayload.isQuotationOrder = true;
        }

        // 2. Request client secret from your Node.js backend
        const amountInCents = Math.round(this.orderData.total * 100);
        const userToken = authStore.token || localStorage.getItem('token');

        const response = await axios.post('http://localhost:5000/api/payment/create-payment-intent',
          { amount: amountInCents },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );

        // --- PATH 1: CARD PAYMENT (Instant) ---
        if (this.paymentMethod === 'card') {
          const result = await this.stripe.confirmCardPayment(response.data.clientSecret, {
            payment_method: {
              card: this.cardElement,
              billing_details: { name: this.cardDetails.name, email: orderPayload.customerEmail }
            }
          });

          if (result.error) throw new Error(result.error.message);

          // Card success! Save order as Paid.
          orderPayload.paymentStatus = 'paid';
          const order = await ordersStore.createOrder(orderPayload);
          cartStore.clearCart();
          sessionStorage.removeItem('quotationOrder');

          this.isProcessing = false;
          this.$router.push({ name: 'PaymentSuccess', params: { orderId: order._id || order.id } });
        }

        // --- PATH 2: FPX REDIRECT FLOW ---
        else if (this.paymentMethod === 'fpx') {
          // Save order to DB first as 'pending'
          const order = await ordersStore.createOrder(orderPayload);
          cartStore.clearCart();
          sessionStorage.removeItem('quotationOrder');

          // Construct the exact URL to send them back to after Maybank
          const routeInfo = this.$router.resolve({ name: 'PaymentSuccess', params: { orderId: order._id || order.id } });
          const returnUrl = `${window.location.origin}${routeInfo.href}`;

          // Tell Stripe to redirect them
          const { error } = await this.stripe.confirmFpxPayment(response.data.clientSecret, {
            payment_method: {
              fpx: { bank: this.fpxBank }
            },
            return_url: returnUrl
          });

          if (error) throw new Error(error.message);
        }

        // --- PATH 3: GRABPAY REDIRECT FLOW ---
        else if (this.paymentMethod === 'ewallet') {
          const order = await ordersStore.createOrder(orderPayload);
          cartStore.clearCart();
          sessionStorage.removeItem('quotationOrder');

          const returnUrl = `${window.location.origin}/payment-success/${order._id || order.id}`;

          const { error } = await this.stripe.confirmGrabPayPayment(response.data.clientSecret, {
            return_url: returnUrl
          });

          if (error) throw new Error(error.message);
        }

      } catch (error) {
        console.error('Payment error:', error);
        alert(error.message || 'Payment failed. Please try again.');
        this.isProcessing = false;
      }
    }
  },

  async mounted() {
    const checkoutData = sessionStorage.getItem('checkoutData')
    if (checkoutData) {
      this.orderData = JSON.parse(checkoutData)
    } else {
      this.$router.push('/menu')
      return;
    }

    this.stripe = await loadStripe('pk_test_51TQrGhB8ZaIWMBPR0ob61zDhxXT0PWc8JIMAKwJryEdjj9GDmYncICh1MOSY3iLfo1l3zfoQxFGLYyqZBPofULC000edU8MPfx');
    const elements = this.stripe.elements();

    this.cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '15px',
          color: '#0f172a',
          fontFamily: 'Inter, sans-serif',
          '::placeholder': { color: '#94a3b8' },
        },
      },
    });

    this.$nextTick(() => {
      if (this.paymentMethod === 'card') {
        this.cardElement.mount('#card-element');

        this.cardElement.on('change', (event) => {
          const displayError = document.getElementById('card-errors');
          if (event.error) {
            displayError.textContent = event.error.message;
          } else {
            displayError.textContent = '';
          }
        });
      }
    });
  }
}
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

.payment-container {
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

/* Payment Content */
.payment-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 50px;
}

.payment-grid {
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

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  position: relative;
}

.payment-method:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.payment-method.selected {
  border-color: #10b981;
  background: #f0fdf4;
  box-shadow: 0 0 0 1px #10b981;
}

.payment-method input[type="radio"] {
  display: none;
}

.method-icon-wrapper {
  color: #64748b;
  margin-right: 15px;
}

.payment-method.selected .method-icon-wrapper {
  color: #10b981;
}

.method-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.method-title {
  font-weight: 600;
  color: #0f172a;
  font-size: 15px;
}

.method-desc {
  font-size: 13px;
  color: #64748b;
  margin-top: 2px;
}

.check-icon {
  color: #10b981;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s;
}

.payment-method.selected .check-icon {
  opacity: 1;
  transform: scale(1);
}

/* Form Groups */
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

.input-with-icon {
  position: relative;
}

.input-with-icon svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.form-group input,
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

.input-with-icon input {
  padding-left: 45px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.full-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.info-alert {
  background: #eff6ff;
  border: 1px solid #dbeafe;
  color: #1e40af;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  line-height: 1.5;
}

.security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
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

.event-details-preview {
  margin-bottom: 25px;
  padding: 0 5px;
}

.event-details-preview h4 {
  font-size: 13px;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.preview-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #334155;
  margin-bottom: 10px;
}

.preview-row svg {
  color: #64748b;
  flex-shrink: 0;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Tablet adjustments */
@media (max-width: 1024px) {
  .payment-grid {
    grid-template-columns: 1fr;
  }

  .summary-card {
    position: static;
    order: -1;
    margin-bottom: 30px;
  }
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .payment-container {
    margin-left: 70px;
  }

  .payment-content {
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
