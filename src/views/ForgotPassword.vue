<template>
  <div class="forgot-layout">
    <div class="visual-side">
      <div class="brand-content">
        <div class="brand-intro">
          <img src="@/assets/cmslogo.png" alt="CaterFlow Logo" class="brand-logo" />
        </div>

        <div class="visual-graphic">
          <div class="mock-window">
            <div class="window-header">
              <div class="dot red"></div>
              <div class="dot yellow"></div>
              <div class="dot green"></div>
            </div>
            <div class="window-body">
              <div class="row header-row"></div>
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

      <div class="overlay-pattern"></div>
    </div>

    <div class="form-side">
      <div class="form-container">
        <div class="form-header">
          <h2>Forgot Password</h2>
          <p>Enter your account email and we’ll send a reset link.</p>
        </div>

        <div v-if="error" class="error-alert">{{ error }}</div>
        <div v-if="success" class="success-alert">{{ success }}</div>

        <form @submit.prevent="submitForgotPassword" v-if="!success">
          <div class="input-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </span>
              <input v-model="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>

          <button class="submit-btn" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Send Reset Link</span>
          </button>
        </form>

        <div class="auth-divider">
          <span>or</span>
        </div>

        <button class="secondary-btn" @click="goLogin">Back to Sign In</button>
      </div>

      <div class="footer-copy">
        &copy; 2026 Catering Management System
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/services/api'

export default {
  data() {
    return {
      email: '',
      loading: false,
      error: '',
      success: ''
    }
  },
  mounted() {
    const emailFromQuery = String(this.$route.query?.email || '').trim()
    if (emailFromQuery) {
      this.email = emailFromQuery
    }
  },
  methods: {
    goLogin() {
      this.$router.push('/')
    },
    async submitForgotPassword() {
      this.error = ''
      this.success = ''

      const normalizedEmail = String(this.email || '').trim()
      if (!normalizedEmail) {
        this.error = 'Please enter your email address.'
        return
      }

      try {
        this.loading = true
        const response = await authAPI.forgotPassword(normalizedEmail)
        this.success = response?.data?.message || 'Reset link sent. Please check your email.'
      } catch (error) {
        this.error = error?.response?.data?.message || 'Failed to send reset link. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.forgot-layout {
  min-height: 100vh;
  display: flex;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f8fafc;
  overflow: hidden;
}

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
  max-width: 420px;
  width: 100%;
}

.form-header {
  margin-bottom: 36px;
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

.error-alert {
  margin-bottom: 24px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.success-alert {
  margin-bottom: 24px;
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

.auth-divider {
  display: flex;
  align-items: center;
  margin: 30px 0;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

.auth-divider::before,
.auth-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.auth-divider span {
  padding: 0 16px;
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

@media (max-width: 1024px) {
  .visual-side { display: none; }
  .form-side { width: 100%; padding: 20px; }
  .form-container { max-width: 100%; }
}
</style>
