<!--
  Register Component
  Role: Public (Unauthenticated Users)
  Function: User registration for Customers and Catering Providers
  Features:
    - Role selection (Customer/Catering Provider)
    - Business information for providers
    - F&B license upload for providers
    - Form validation
-->
<template>
  <div class="register-layout">
    <!-- Visual Side (Left) -->
    <div class="visual-side">
      <div class="brand-content">
        <div class="logo-area">
          <div class="logo-icon">CMS</div>
          <h1>Join the Platform</h1>
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
                <div class="grid-preview">
                   <div class="card c1"></div>
                   <div class="card c2"></div>
                   <div class="card c3"></div>
                   <div class="card c4"></div>
                </div>
             </div>
          </div>
        </div>

        <div class="feature-pills">
          <div class="pill">
            <i class="fas fa-rocket"></i> Instant Setup
          </div>
          <div class="pill">
            <i class="fas fa-shield-alt"></i> Secure
          </div>
          <div class="pill">
            <i class="fas fa-chart-pie"></i> Analytics
          </div>
        </div>
      </div>
      <div class="overlay-pattern"></div>
    </div>

    <!-- Form Side (Right) -->
    <div class="form-side">
      <div class="form-container">
        <div class="form-header">
          <h2>Create Account</h2>
          <p>Start managing your catering business today</p>
        </div>

        <div v-if="error" class="error-alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {{ error }}
        </div>
        
        <div v-if="success" class="success-alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          {{ success }}
        </div>

        <form @submit.prevent="register">
          <!-- Role Selection -->
          <div class="role-selection">
            <label class="role-card" :class="{ selected: formData.role === 'customer' }">
              <input type="radio" v-model="formData.role" value="customer" class="hidden-radio" />
              <div class="role-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <span>Customer</span>
            </label>
            <label class="role-card" :class="{ selected: formData.role === 'cateringProvider' }">
              <input type="radio" v-model="formData.role" value="cateringProvider" class="hidden-radio" />
              <div class="role-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <span>Provider</span>
            </label>
          </div>

          <div class="form-grid">
            <div class="input-group">
              <label>Full Name</label>
              <input v-model="formData.fullName" type="text" placeholder="John Doe" required />
            </div>
            <div class="input-group">
              <label>Username</label>
              <input v-model="formData.username" type="text" placeholder="johndoe" required />
            </div>
          </div>

          <div v-if="formData.role === 'cateringProvider'" class="input-group">
            <label>Business Name</label>
            <input v-model="formData.businessName" type="text" placeholder="Catering Co." required />
          </div>

          <div class="form-grid">
            <div class="input-group">
              <label>Email</label>
              <input v-model="formData.email" type="email" placeholder="john@example.com" required />
            </div>
            <div class="input-group">
              <label>Phone</label>
              <input v-model="formData.phone" type="tel" placeholder="+60 12-345 6789" required />
            </div>
          </div>

          <div class="input-group">
            <label>Address</label>
            <textarea v-model="formData.address" rows="2" placeholder="Full address" required></textarea>
          </div>

          <!-- Document Uploads (Provider Only) -->
          <div v-if="formData.role === 'cateringProvider'" class="documents-section">
            <h3 class="section-title">Required Documents</h3>
            <p class="section-subtitle">Please upload your business documents for verification.</p>

            <div class="upload-grid">
              <!-- Helper component for uploads to reduce repetition -->
              <div v-for="(label, key) in documentLabels" :key="key" class="upload-card">
                <label>{{ label }}</label>
                <div class="upload-box" @click="triggerUpload(key)" :class="{ 'has-file': documents[key].preview }">
                   <input type="file" :ref="`${key}Input`" @change="(e) => handleFileUpload(e, key)" accept=".pdf,.jpg,.jpeg,.png" style="display:none" />
                   
                   <div v-if="!documents[key].preview" class="upload-content">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                     <span>Upload</span>
                   </div>
                   <div v-else class="preview-content">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                     <span class="filename">{{ truncate(documents[key].name) }}</span>
                     <button type="button" @click.stop="removeFile(key)" class="remove-btn">&times;</button>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-grid">
            <div class="input-group">
              <label>Password</label>
              <input v-model="formData.password" type="password" placeholder="••••••••" required />
            </div>
            <div class="input-group">
              <label>Confirm Password</label>
              <input v-model="formData.confirmPassword" type="password" placeholder="••••••••" required />
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
             <span v-if="loading" class="spinner"></span>
             <span v-else>Create Account</span>
          </button>
        </form>

        <div class="auth-divider">
          <span>Already have an account?</span>
        </div>

        <div class="auth-links">
          <router-link to="/" class="text-link">Sign In here</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'

export default {
  data() {
    return {
      formData: {
        role: 'customer',
        fullName: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        businessName: '',
        businessRegistration: null,
        foodLicense: null,
        bankStatement: null,
        halalCertificate: null,
        password: '',
        confirmPassword: ''
      },
      documents: {
        ssm: { preview: null, name: '' },
        foodLicense: { preview: null, name: '' },
        bankStatement: { preview: null, name: '' },
        halalCert: { preview: null, name: '' }
      },
      documentLabels: {
        ssm: 'Business Reg. / SSM',
        foodLicense: 'Food License',
        bankStatement: 'Bank Statement',
        halalCert: 'Halal Certificate'
      },
      error: '',
      success: '',
      loading: false
    }
  },
  methods: {
    triggerUpload(key) {
      const refName = `${key}Input`;
      if (this.$refs[refName] && this.$refs[refName][0]) {
         this.$refs[refName][0].click();
      }
    },
    truncate(str) {
      if (str.length > 20) return str.substring(0, 17) + '...';
      return str;
    },
    handleFileUpload(e, docType) {
      const file = e.target.files[0]
      if (file) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          this.error = `${this.getDocumentLabel(docType)} file size must be less than 5MB`
          return
        }

        this.documents[docType].name = file.name
        const reader = new FileReader()
        reader.onload = (e) => {
          this.documents[docType].preview = e.target.result
          
          // Map to formData fields
          const fieldMap = {
            ssm: 'businessRegistration',
            foodLicense: 'foodLicense',
            bankStatement: 'bankStatement',
            halalCert: 'halalCertificate'
          }
          this.formData[fieldMap[docType]] = e.target.result
        }
        reader.readAsDataURL(file)
        this.error = '' // Clear any previous errors
      }
    },
    removeFile(docType) {
      this.documents[docType].preview = null
      this.documents[docType].name = ''
      
      // Map to formData fields
      const fieldMap = {
        ssm: 'businessRegistration',
        foodLicense: 'foodLicense',
        bankStatement: 'bankStatement',
        halalCert: 'halalCertificate'
      }
      this.formData[fieldMap[docType]] = null
      
      // Clear the file input
      const refName = `${docType}Input`;
      if (this.$refs[refName] && this.$refs[refName][0]) {
        this.$refs[refName][0].value = ''
      }
    },
    getDocumentLabel(docType) {
      return this.documentLabels[docType]
    },
    async register() {
      this.error = ''
      this.success = ''
      this.loading = true

      try {
        // Validation
        if (this.formData.password !== this.formData.confirmPassword) {
          throw new Error('Passwords do not match')
        }

        if (this.formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters')
        }

        if (this.formData.role === 'cateringProvider' && !this.formData.businessName) {
          throw new Error('Business name is required for catering providers')
        }

        // Validate all 4 documents for catering providers
        if (this.formData.role === 'cateringProvider') {
          if (!this.formData.businessRegistration) throw new Error('Business Registration (SSM) document is required')
          if (!this.formData.foodLicense) throw new Error('Food License document is required')
          if (!this.formData.bankStatement) throw new Error('Bank Statement document is required')
          if (!this.formData.halalCertificate) throw new Error('Halal Certificate document is required')
        }

        const authStore = useAuthStore()
        const result = await authStore.register(this.formData)

        if (result.success) {
          if (this.formData.role === 'cateringProvider') {
            this.success = 'Application submitted successfully! Redirecting...'
            setTimeout(() => {
              this.$router.push('/')
            }, 3000)
          } else {
            this.success = 'Registration successful! Redirecting...'
            setTimeout(() => {
              this.$router.push('/home')
            }, 1500)
          }
        } else {
          this.error = result.message || 'Registration failed'
        }
      } catch (err) {
        this.error = err.message || 'An error occurred during registration';
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Modern Reset & Layout */
.register-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f8fafc;
  overflow: hidden;
}

/* --- Visual Side (Left) --- */
.visual-side {
  width: 40%;
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
  max-width: 480px;
  width: 100%;
}

.logo-area {
  margin-bottom: 60px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
}

.brand-content h1 {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 12px;
  letter-spacing: -1px;
  background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Visualization (Mock Grid) */
.visual-graphic {
  margin: 40px 0;
  perspective: 1000px;
}

.mock-window {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  transform: rotateY(5deg) rotateX(5deg);
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

.grid-preview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.card {
  height: 80px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.c1 { background: #3b82f6; opacity: 0.2; }

/* Feature Pills */
.feature-pills {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.pill {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
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
  width: 60%;
  padding: 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-container {
  max-width: 520px;
  width: 100%;
  margin: auto 0;
}

.form-header {
  margin-bottom: 32px;
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

/* Role Selection */
.role-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.role-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.role-card:hover { border-color: #cbd5e1; background: #f8fafc; }
.role-card.selected { 
  border-color: #3b82f6; 
  background: #eff6ff; 
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); 
}

.hidden-radio { display: none; }

.role-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s;
}

.role-card.selected .role-icon {
  background: #3b82f6;
  color: white;
}

.role-card span { font-weight: 600; font-size: 14px; color: #334155; }
.role-card.selected span { color: #0f172a; }

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Inputs */
.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

input, textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #0f172a;
  transition: all 0.2s;
  background: white;
  font-weight: 500;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

textarea { resize: vertical; min-height: 80px; }

/* Documents Section */
.documents-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
}

.upload-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.upload-card label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.upload-box {
  border: 2px dashed #cbd5e0;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-box:hover {
  border-color: #94a3b8;
  background: #f1f5f9;
}

.upload-box.has-file {
  border-style: solid;
  border-color: #e2e8f0;
  background: #f0fdf4;
}

.upload-content {
  display: flex;
  flex-direction: column;
  items-align: center;
  gap: 4px;
  color: #64748b;
}

.upload-content span { font-size: 12px; font-weight: 500; }

.preview-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.filename {
  font-size: 11px;
  color: #059669;
  font-weight: 600;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  line-height: 1;
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

.submit-btn:hover { background: #1e293b; transform: translateY(-2px); }
.submit-btn:disabled { background: #94a3b8; cursor: not-allowed; }

.auth-divider {
  display: flex;
  align-items: center;
  margin: 30px 0;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

.auth-divider::before, .auth-divider::after {
  content: ""; flex: 1; height: 1px; background: #e2e8f0;
}
.auth-divider span { padding: 0 16px; }

.text-link {
  color: #3b82f6; text-decoration: none; font-weight: 600; font-size: 14px;
}
.text-link:hover { text-decoration: underline; }
.auth-links { text-align: center; }

/* Alerts */
.error-alert, .success-alert {
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 24px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.error-alert { background: #fef2f2; border: 1px solid #fee2e2; color: #b91c1c; }
.success-alert { background: #f0fdf4; border: 1px solid #dcfce7; color: #15803d; }

.spinner {
  width: 20px; height: 20px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 1024px) {
  .visual-side { display: none; }
  .form-side { width: 100%; padding: 20px; }
  .form-container { max-width: 100%; }
}
@media (max-width: 640px) {
  .form-grid, .role-selection, .upload-grid { grid-template-columns: 1fr; }
}
</style>
