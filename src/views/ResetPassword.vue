<template>
  <div class="reset-page">
    <div class="reset-card">
      <h1>Set New Password</h1>
      <p class="subtitle">Enter your new password below.</p>

      <div v-if="error" class="error-alert">{{ error }}</div>
      <div v-if="success" class="success-alert">{{ success }}</div>

      <form @submit.prevent="submitReset" v-if="!success">
        <div class="input-group">
          <label>New Password</label>
          <input v-model="password" type="password" placeholder="At least 6 characters" required />
        </div>

        <div class="input-group">
          <label>Confirm Password</label>
          <input v-model="confirmPassword" type="password" placeholder="Repeat password" required />
        </div>

        <button class="submit-btn" type="submit" :disabled="loading">
          <span v-if="loading">Updating...</span>
          <span v-else>Update Password</span>
        </button>
      </form>

      <button class="link-btn" @click="goLogin">Back to Sign In</button>
    </div>
  </div>
</template>

<script>
import { authAPI } from '@/services/api'

export default {
  data() {
    return {
      password: '',
      confirmPassword: '',
      loading: false,
      error: '',
      success: ''
    }
  },
  computed: {
    resetToken() {
      return String(this.$route.query?.token || '').trim()
    }
  },
  mounted() {
    if (!this.resetToken) {
      this.error = 'Invalid reset link. Please request a new password reset email.'
    }
  },
  methods: {
    goLogin() {
      this.$router.push('/')
    },
    async submitReset() {
      this.error = ''
      this.success = ''

      if (!this.resetToken) {
        this.error = 'Invalid reset token. Please request a new reset link.'
        return
      }

      if (!this.password || this.password.length < 6) {
        this.error = 'Password must be at least 6 characters.'
        return
      }

      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match.'
        return
      }

      try {
        this.loading = true
        const response = await authAPI.resetPassword(this.resetToken, this.password)
        this.success = response?.data?.message || 'Password updated successfully. You can sign in now.'
        this.password = ''
        this.confirmPassword = ''
      } catch (error) {
        this.error = error?.response?.data?.message || 'Failed to reset password. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.reset-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
  padding: 20px;
}

.reset-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 20px 40px -20px rgba(15, 23, 42, 0.35);
}

h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.subtitle {
  margin: 8px 0 20px;
  color: #64748b;
  font-size: 14px;
}

.input-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

.submit-btn {
  width: 100%;
  margin-top: 6px;
  border: none;
  border-radius: 10px;
  background: #0f172a;
  color: white;
  padding: 12px 14px;
  font-weight: 600;
  cursor: pointer;
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.link-btn {
  margin-top: 12px;
  border: none;
  background: transparent;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.error-alert {
  margin-bottom: 14px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #b91c1c;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}

.success-alert {
  margin-bottom: 14px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}
</style>
