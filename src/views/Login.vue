<!--
  Login Component
  Role: Public (Unauthenticated Users)
  Function: User authentication and login
  Features:
    - Email/password authentication
    - Role-based routing (customer, cateringProvider, superadmin)
    - Approval status checking for providers
    - Account activation status checking
-->
<template>
  <div class="login-layout">
    <!-- Visual Side (Left) -->
    <div class="visual-side">
      <div class="brand-content">
        <div class="brand-intro">
          <img src="@/assets/cmslogo.png" alt="CaterFlow Logo" class="brand-logo" />
        </div>
        
        <div class="visual-graphic">
          <!-- CSS Dashboard Visualization -->
          <div class="mock-window">
             <div class="window-header">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
             </div>
             <div class="window-body">
                <div class="row header-row"></div>
                <!-- Animated rows -->
                <div class="row r1"></div>
                <div class="row r2"></div>
                <div class="row r3"></div>
                <div class="chart-area">
                   <div class="bar b1"></div>
                   <div class="bar b2"></div>
                   <div class="bar b3"></div>
                   <div class="bar b4"></div>
                </div>
             </div>
          </div>
        </div>

        <div class="feature-pills">
          <div class="pill">
            <i class="fas fa-boxes"></i> Smart Inventory
          </div>
          <div class="pill">
            <i class="fas fa-chart-line"></i> Analytics
          </div>
          <div class="pill">
            <i class="fas fa-truck"></i> Logistics
          </div>
        </div>
      </div>
      
      <!-- Decorative Overlay -->
      <div class="overlay-pattern"></div>
    </div>

    <!-- Form Side (Right) -->
    <div class="form-side">
      <div class="form-container">
        <div class="form-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your catering dashboard</p>
        </div>

        <form @submit.prevent="login">
          <div class="input-group">
            <label>Username / Email</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </span>
              <input 
                v-model="username" 
                type="text" 
                placeholder="Enter your username" 
                required 
              />
            </div>
          </div>
          
          <div class="input-group">
            <label>Password</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </span>
              <input 
                v-model="password" 
                type="password" 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>

          <div v-if="error" class="error-alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {{ error }}
          </div>
          
          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Sign In</span>
            <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>

        </form>
        
        <div class="auth-divider">
          <span>or</span>
        </div>

        <div class="auth-links">
           <button @click.prevent="registerAccount" class="secondary-btn">
             Create New Account
           </button>
           <button @click.prevent="forgotPassword" class="text-link">
             Forgot Password?
           </button>
        </div>
      </div>
      
      <div class="footer-copy">
        &copy; 2026 Catering Management System
      </div>
    </div>

    <div v-if="showForgotModal" class="modal-overlay" @click="closeForgotModal">
      <div class="modal-card" @click.stop>
        <h3>Reset Password</h3>
        <p>Enter your account email. We’ll send you a reset link.</p>

        <div class="input-group compact">
          <label>Email</label>
          <input v-model="forgotEmail" type="email" placeholder="you@example.com" required />
        </div>

        <div v-if="forgotError" class="error-alert compact-alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {{ forgotError }}
        </div>

        <div v-if="forgotSuccess" class="success-alert compact-alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          {{ forgotSuccess }}
        </div>

        <div class="modal-actions">
          <button type="button" class="secondary-btn" @click="closeForgotModal">Cancel</button>
          <button type="button" class="submit-btn small" :disabled="forgotLoading" @click="submitForgotPassword">
            <span v-if="forgotLoading" class="spinner"></span>
            <span v-else>Send Reset Link</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { authAPI } from '@/services/api'

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
      loading: false,
      showForgotModal: false,
      forgotEmail: '',
      forgotLoading: false,
      forgotError: '',
      forgotSuccess: ''
    }
  },
  methods: {
    async login() {
      this.loading = true;
      this.error = '';
      
      try {
        const authStore = useAuthStore()
        const result = await authStore.login(this.username, this.password)
        
        if (result.success) {
          // Route based on user role
          if (result.role === 'superadmin') {
            await this.$router.push('/superadmin/dashboard')
          } else if (result.role === 'cateringProvider') {
            await this.$router.push('/provider/dashboard')
          } else if (result.role === 'admin') {
            // Legacy admin support - redirect to provider dashboard
            await this.$router.push('/provider/dashboard')
          } else {
            // Customer
            await this.$router.push('/home')
          }
        } else {
          // Handle specific error cases
          if (result.isPending) {
            this.error = 'Your provider application is pending approval. Please wait for admin review.'
          } else if (result.isRejected) {
            this.error = result.message || 'Your provider application was rejected.'
          } else {
            this.error = result.message || 'Invalid username or password'
          }
        }
      } catch (err) {
        this.error = 'An unexpected error occurred. Please try again.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    forgotPassword() {
      this.showForgotModal = true
      this.forgotError = ''
      this.forgotSuccess = ''
      if (!this.forgotEmail && this.username && String(this.username).includes('@')) {
        this.forgotEmail = this.username
      }
    },
    closeForgotModal() {
      this.showForgotModal = false
      this.forgotLoading = false
      this.forgotError = ''
      this.forgotSuccess = ''
    },
    async submitForgotPassword() {
      this.forgotError = ''
      this.forgotSuccess = ''

      const email = String(this.forgotEmail || '').trim()
      if (!email) {
        this.forgotError = 'Please enter your email address.'
        return
      }

      try {
        this.forgotLoading = true
        const response = await authAPI.forgotPassword(email)
        this.forgotSuccess = response?.data?.message || 'Reset link sent. Please check your email.'
      } catch (error) {
        this.forgotError = error?.response?.data?.message || 'Failed to send reset link. Please try again.'
      } finally {
        this.forgotLoading = false
      }
    },
    registerAccount() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
/* Modern Reset & Layout */
.login-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f8fafc;
  overflow: hidden;
}

/* --- Visual Side (Left) --- */
.visual-side {
  width: 45%;
  background: #0f172a;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  overflow: hidden;
  color: white;
}

.brand-content {
  position: relative;
  z-index: 10;
  max-width: 560px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-intro {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}

.brand-logo {
  width: min(600px, 100%);
  height: auto;
  display: block;
  margin: 0 auto;
  object-fit: contain;
  filter: drop-shadow(0 16px 30px rgba(15, 23, 42, 0.42));
}

/* Visualization (Mock Dashboard) */
.visual-graphic {
  width: 100%;
  margin: 14px 0 24px;
  perspective: 1000px;
}

.mock-window {
  background: linear-gradient(160deg, rgba(30, 41, 59, 0.76), rgba(15, 23, 42, 0.7));
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 28px 56px -18px rgba(0, 0, 0, 0.52);
  backdrop-filter: blur(10px);
  transform: rotateY(4deg) rotateX(4deg);
  transition: transform 0.5s ease;
}

.mock-window:hover {
  transform: rotateY(0) rotateX(0);
}

.window-header {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.dot { width: 10px; height: 10px; border-radius: 50%; }
.red { background: #ef4444; }
.yellow { background: #f59e0b; }
.green { background: #10b981; }

.window-body { display: flex; flex-direction: column; gap: 12px; }
.row { height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; }
.header-row { width: 40%; background: rgba(59, 130, 246, 0.5); margin-bottom: 8px; }
.r1 { width: 80%; }
.r2 { width: 60%; }
.r3 { width: 70%; }

.chart-area {
  display: flex;
  gap: 12px;
  height: 60px;
  align-items: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.bar { width: 20%; background: #3b82f6; border-radius: 4px 4px 0 0; opacity: 0.8; }
.b1 { height: 40%; }
.b2 { height: 70%; background: #8b5cf6; }
.b3 { height: 50%; }
.b4 { height: 85%; background: #10b981; }

/* Feature Pills */
.feature-pills {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.pill {
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.overlay-pattern {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: radial-gradient(#3b82f6 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.03;
  z-index: 1;
}

/* --- Form Side (Right) --- */
.form-side {
  width: 55%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;
}

.form-container {
  max-width: 400px;
  width: 100%;
}

.form-header {
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.form-header p {
  color: #64748b;
  font-size: 16px;
}

/* Inputs */
.input-group {
  margin-bottom: 24px;
}

.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  transition: color 0.2s;
}

input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #0f172a;
  transition: all 0.2s;
  background: #fff;
  font-weight: 500;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input:focus + .input-icon,
.input-wrapper:focus-within .input-icon {
  color: #3b82f6;
}

/* Buttons */
.submit-btn {
  width: 100%;
  padding: 16px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.2s;
  box-shadow: 0 10px 30px -10px rgba(15, 23, 42, 0.4);
}

.submit-btn:hover {
  background: #1e293b;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
}

.secondary-btn {
  width: 100%;
  padding: 14px;
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #475569;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #cbd5e1;
}

.text-link {
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin: 0 auto;
  display: block;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: all 0.2s;
}

.text-link:hover {
  color: #3b82f6;
  text-decoration-color: #3b82f6;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.62);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  box-shadow: 0 20px 45px -15px rgba(15, 23, 42, 0.4);
}

.modal-card h3 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 22px;
  font-weight: 700;
}

.modal-card p {
  margin: 0 0 18px;
  color: #64748b;
  font-size: 14px;
}

.input-group.compact {
  margin-bottom: 14px;
}

.compact-alert {
  margin-bottom: 14px;
}

.success-alert {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 6px;
}

.submit-btn.small {
  width: auto;
  padding: 12px 16px;
  font-size: 14px;
}

/* Dividers & Errors */
.auth-divider {
  display: flex;
  align-items: center;
  margin: 30px 0;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

.auth-divider::before, .auth-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.auth-divider span { padding: 0 16px; }

.auth-links {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error-alert {
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-copy {
  position: absolute;
  bottom: 30px;
  color: #94a3b8;
  font-size: 13px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 1024px) {
  .visual-side { display: none; }
  .form-side { width: 100%; padding: 20px; }
  .form-container { max-width: 100%; }
}
</style>
