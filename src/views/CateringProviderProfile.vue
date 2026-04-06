<!--
  Catering Provider Profile
  Role: Catering Provider
  Function: Manage business profile, branding, operations, and settings
  Features:
    - Brand identity management (logo, banner, about us)
    - Portfolio/gallery management
    - Operational rules (service area, lead time, MOV)
    - Document renewal (requires superadmin approval)
    - Financial settings (bank account - requires approval)
    - Security settings
-->
<template>
  <div class="admin-container">
    <Navbar />
    
    <main class="admin-content">
      <header class="page-header">
        <div class="header-content">
          <h1>Business Profile</h1>
          <p class="subtitle">Manage your brand identity, operations, and settings</p>
        </div>
      </header>

      <!-- Save Status Alert -->
      <div v-if="saveSuccess" class="alert success-alert">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span>{{ saveSuccess }}</span>
      </div>
      <div v-if="saveError" class="alert error-alert">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ saveError }}</span>
      </div>

      <!-- Tab Navigation -->
      <div class="tabs-container">
        <div class="tabs">
          <button 
            :class="['tab-btn', { active: activeTab === 'branding' }]" 
            @click="activeTab = 'branding'"
          >
            Brand Identity
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'operations' }]" 
            @click="activeTab = 'operations'"
          >
            Operations
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'compliance' }]" 
            @click="activeTab = 'compliance'"
          >
            Compliance
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'financial' }]" 
            @click="activeTab = 'financial'"
          >
            Financial
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'security' }]" 
            @click="activeTab = 'security'"
          >
            Security
          </button>
        </div>
      </div>

      <!-- Brand Identity Tab -->
      <div v-if="activeTab === 'branding'" class="content-section">
        <div class="section-header">
          <h2>Storefront Configuration</h2>
          <p class="section-desc">Control your public-facing brand identity</p>
        </div>

        <div class="form-grid">
          <!-- Business Name -->
          <div class="form-group">
            <label class="form-label">
              Business Name 
              <span v-if="pendingChanges.businessName" class="badge-warning">Pending Approval</span>
            </label>
            <div class="input-wrapper">
              <input 
                v-model="profileData.businessName" 
                type="text" 
                class="form-input"
                @change="markForApproval('businessName')"
              />
              <span class="icon-lock" title="Requires Approval">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
            </div>
          </div>

          <!-- Display Address -->
          <div class="form-group full-width">
            <label class="form-label">Official Address</label>
            <textarea 
              v-model="profileData.address" 
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <!-- Contact Information -->
          <div class="form-group">
            <label class="form-label">Customer Phone</label>
            <input 
              v-model="profileData.phone" 
              type="text" 
              class="form-input"
              placeholder="+60123456789"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Customer Email</label>
            <input 
              v-model="profileData.email" 
              type="email" 
              class="form-input"
            />
          </div>
        </div>

        <div class="divider"></div>

        <div class="form-grid">
           <!-- Logo Upload -->
          <div class="form-group">
            <label class="form-label">Company Logo</label>
            <div class="upload-area">
              <div v-if="profileData.logo" class="preview-container logo-preview">
                <img :src="profileData.logo" alt="Logo" />
                <button @click="removeLogo" class="btn-icon delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div v-else class="upload-placeholder" @click="$refs.logoInput.click()">
                <div class="upload-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <p>Upload Logo</p>
                <span>PNG, JPG (Max 2MB)</span>
              </div>
              <input 
                ref="logoInput" 
                type="file" 
                accept="image/*" 
                @change="handleLogoUpload" 
                hidden
              />
            </div>
          </div>

          <!-- Cover Banner Upload -->
          <div class="form-group full-width">
            <label class="form-label">Cover Banner</label>
            <div class="upload-area banner">
              <div v-if="profileData.banner" class="preview-container banner-preview">
                <img :src="profileData.banner" alt="Banner" />
                <button @click="removeBanner" class="btn-icon delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div v-else class="upload-placeholder" @click="$refs.bannerInput.click()">
                <div class="upload-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                     <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                     <circle cx="8.5" cy="8.5" r="1.5"/>
                     <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p>Upload Cover Banner</p>
                <span>PNG, JPG (Max 5MB, 16:9)</span>
              </div>
              <input 
                ref="bannerInput" 
                type="file" 
                accept="image/*" 
                @change="handleBannerUpload" 
                hidden
              />
            </div>
          </div>
        </div>

        <div class="form-group full-width mt-20">
          <label class="form-label">About Us</label>
          <textarea 
            v-model="profileData.aboutUs" 
            class="form-textarea"
            rows="6"
            placeholder="Tell customers about your history, specialty, and philosophy..."
          ></textarea>
          <div class="char-count">{{ profileData.aboutUs.length }} / 1000 characters</div>
        </div>
        
        <div class="form-group full-width mt-20">
            <label class="form-label">Portfolio Gallery</label>
            <p class="helper-text">Upload photos of past events, buffet setups, dome settings (Max 12)</p>
            
            <div class="gallery-grid">
              <div v-for="(photo, index) in profileData.gallery" :key="index" class="gallery-item">
                <img :src="photo" alt="Portfolio" />
                <button @click="removeGalleryPhoto(index)" class="btn-icon delete overlay">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div v-if="profileData.gallery.length < 12" class="gallery-add" @click="$refs.galleryInput.click()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>Add Photo</span>
              </div>
            </div>
            <input 
              ref="galleryInput" 
              type="file" 
              accept="image/*" 
              multiple
              @change="handleGalleryUpload" 
              hidden
            />
          </div>

        <div class="form-actions right">
           <button @click="saveBranding" class="btn-primary">Save Brand Identity</button>
        </div>
      </div>

      <!-- Operations Tab -->
      <div v-if="activeTab === 'operations'" class="content-section">
        <div class="section-header">
           <h2>Operational Rules</h2>
           <p class="section-desc">Configure delivery areas, lead times, and requirements</p>
        </div>

        <div class="form-grid">
           <!-- Service Area -->
          <div class="form-group full-width">
            <label class="form-label">Service Area</label>
            <div class="radio-cards">
              <label :class="['radio-card', { active: profileData.serviceAreaType === 'radius' }]">
                <input type="radio" v-model="profileData.serviceAreaType" value="radius" hidden />
                <div class="radio-content">
                  <span class="radio-title">Delivery Radius</span>
                  <span class="radio-desc">km from your kitchen</span>
                </div>
              </label>
              <label :class="['radio-card', { active: profileData.serviceAreaType === 'specific' }]">
                <input type="radio" v-model="profileData.serviceAreaType" value="specific" hidden />
                 <div class="radio-content">
                  <span class="radio-title">Specific Locations</span>
                  <span class="radio-desc">Select states/districts</span>
                </div>
              </label>
            </div>

            <div v-if="profileData.serviceAreaType === 'radius'" class="sub-input mt-20">
              <label class="form-label">Radius (km)</label>
              <input v-model.number="profileData.deliveryRadius" type="number" min="1" max="100" class="form-input narrow" />
            </div>

            <div v-if="profileData.serviceAreaType === 'specific'" class="sub-input mt-20">
              <label class="form-label">Select States/Districts</label>
              <div class="checkbox-grid">
                <label v-for="location in availableLocations" :key="location" class="checkbox-item">
                  <input 
                    type="checkbox" 
                    :value="location" 
                    v-model="profileData.serviceLocations"
                  />
                  <span>{{ location }}</span>
                </label>
              </div>
            </div>
          </div>
          
           <!-- Lead Time -->
          <div class="form-group">
            <label class="form-label">Lead Time (Days)</label>
             <div class="input-suffix">
              <input 
                v-model.number="profileData.leadTimeDays" 
                type="number" 
                min="1" 
                max="30" 
                class="form-input"
              />
              <span class="suffix">days</span>
            </div>
            <p class="helper-text">Minimum advance notice required</p>
          </div>

          <!-- Minimum Order Value -->
          <div class="form-group">
            <label class="form-label">Minimum Order Value</label>
            <div class="input-prefix">
              <span class="prefix">RM</span>
              <input 
                v-model.number="profileData.minimumOrderValue" 
                type="number" 
                min="0" 
                step="50" 
                class="form-input"
              />
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="form-group full-width">
            <label class="form-label">Operating Days & Hours</label>
            <div class="operating-hours-grid">
              <div v-for="day in daysOfWeek" :key="day" :class="['day-row', { active: profileData.operatingDays.includes(day) }]">
                <label class="day-check">
                  <input 
                    type="checkbox" 
                    :value="day" 
                    v-model="profileData.operatingDays"
                  />
                  <span class="day-name">{{ day }}</span>
                </label>
                <div class="time-inputs">
                   <div class="time-input-group">
                      <input 
                        v-model="profileData.operatingHours[day].open" 
                        type="time" 
                        class="form-input small"
                        :disabled="!profileData.operatingDays.includes(day)"
                      />
                      <span>to</span>
                      <input 
                        v-model="profileData.operatingHours[day].close" 
                        type="time" 
                        class="form-input small"
                        :disabled="!profileData.operatingDays.includes(day)"
                      />
                   </div>
                </div>
              </div>
            </div>
          </div>
          
           <div class="form-actions right">
              <button @click="saveOperations" class="btn-primary">Save Operational Rules</button>
           </div>
      </div>

      <!-- Compliance Tab -->
      <div v-if="activeTab === 'compliance'" class="content-section">
        <div class="section-header">
           <h2>Compliance & Verification</h2>
           <p class="section-desc">Manage your business documents and verification status</p>
        </div>

        <div class="status-cards-grid">
          <div :class="['status-card', getDocStatus('businessRegistration')]">
            <div class="status-icon-wrapper">
               <span class="status-emoji">{{ getDocIcon('businessRegistration') }}</span>
            </div>
            <div class="status-details">
               <strong>Business Registration</strong>
               <p>{{ getDocStatusText('businessRegistration') }}</p>
            </div>
          </div>
           <div :class="['status-card', getDocStatus('foodLicense')]">
             <div class="status-icon-wrapper">
               <span class="status-emoji">{{ getDocIcon('foodLicense') }}</span>
             </div>
            <div class="status-details">
               <strong>Food License</strong>
               <p>{{ getDocStatusText('foodLicense') }}</p>
            </div>
          </div>
           <div :class="['status-card', getDocStatus('bankStatement')]">
             <div class="status-icon-wrapper">
               <span class="status-emoji">{{ getDocIcon('bankStatement') }}</span>
             </div>
            <div class="status-details">
               <strong>Bank Statement</strong>
               <p>{{ getDocStatusText('bankStatement') }}</p>
            </div>
          </div>
           <div :class="['status-card', getDocStatus('halalCertificate')]">
             <div class="status-icon-wrapper">
                <span class="status-emoji">{{ getDocIcon('halalCertificate') }}</span>
             </div>
            <div class="status-details">
               <strong>Halal Certificate</strong>
               <p>{{ getDocStatusText('halalCertificate') }}</p>
            </div>
          </div>
        </div>
        
        <div class="divider"></div>

        <h3 class="subsection-title">Upload Documents</h3>
        <p class="helper-text mb-4">⚠️ All document changes require superadmin approval</p>
        
        <div class="upload-grid">
              <!-- SSM / Business Reg -->
              <div class="upload-item-card">
                <h4>Business Reg. / SSM</h4>
                <button @click="selectDocument('businessRegistration')" class="btn-secondary small">
                  {{ documents.businessRegistration.pending ? 'Pending Approval' : 'Upload New' }}
                </button>
                <input 
                  ref="ssmInput" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  @change="handleDocUpload($event, 'businessRegistration')" 
                  hidden
                />
              </div>

              <!-- Food License -->
              <div class="upload-item-card">
                <h4>Food License</h4>
                <button @click="selectDocument('foodLicense')" class="btn-secondary small">
                  {{ documents.foodLicense.pending ? 'Pending Approval' : 'Upload New' }}
                </button>
                <input 
                  ref="foodLicenseInput" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  @change="handleDocUpload($event, 'foodLicense')" 
                  hidden
                />
              </div>

              <!-- Bank Statement -->
              <div class="upload-item-card">
                <h4>Bank Statement</h4>
                <button @click="selectDocument('bankStatement')" class="btn-secondary small">
                   {{ documents.bankStatement.pending ? 'Pending Approval' : 'Upload New' }}
                </button>
                <input 
                  ref="bankStatementInput" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  @change="handleDocUpload($event, 'bankStatement')" 
                  hidden
                />
              </div>

              <!-- Halal Cert -->
              <div class="upload-item-card">
                <h4>Halal Certificate</h4>
                <button @click="selectDocument('halalCertificate')" class="btn-secondary small">
                  {{ documents.halalCertificate.pending ? 'Pending Approval' : 'Upload New' }}
                </button>
                <input 
                  ref="halalCertInput" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  @change="handleDocUpload($event, 'halalCertificate')" 
                  hidden
                />
              </div>
            </div>
      </div>

       <!-- Financial Tab -->
      <div v-if="activeTab === 'financial'" class="content-section">
        <div class="section-header">
           <h2>Financial Settings</h2>
           <p class="section-desc">Banking details and notification preferences</p>
        </div>

        <div class="form-grid">
           <!-- Bank Account (Requires Approval) -->
          <div class="form-group">
            <label class="form-label">
              Bank Account Number 
              <span v-if="pendingChanges.bankAccount" class="badge-warning">Pending Approval</span>
            </label>
             <div class="input-wrapper">
               <input 
                v-model="profileData.bankAccount" 
                type="text" 
                class="form-input"
                placeholder="1234567890"
                @change="markForApproval('bankAccount')"
              />
              <span class="icon-lock" title="Requires Approval">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
             </div>
          </div>
          
           <div class="form-group">
            <label class="form-label">Bank Name</label>
            <select v-model="profileData.bankName" class="form-select">
              <option value="">Select Bank</option>
              <option value="Maybank">Maybank</option>
              <option value="CIMB">CIMB Bank</option>
              <option value="Public Bank">Public Bank</option>
              <option value="RHB Bank">RHB Bank</option>
              <option value="Hong Leong Bank">Hong Leong Bank</option>
              <option value="AmBank">AmBank</option>
              <option value="Bank Islam">Bank Islam</option>
              <option value="Bank Rakyat">Bank Rakyat</option>
              <option value="Affin Bank">Affin Bank</option>
              <option value="Alliance Bank">Alliance Bank</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Account Holder Name</label>
            <input 
              v-model="profileData.accountHolderName" 
              type="text" 
              class="form-input"
            />
          </div>
        </div>

        <div class="divider"></div>

        <div class="form-group">
            <label class="form-label">Notification Preferences</label>
            <div class="checkbox-list">
              <label class="checkbox-card">
                <input type="checkbox" v-model="profileData.notifications.email" />
                <span>📧 Email Notifications</span>
              </label>
              <label class="checkbox-card">
                <input type="checkbox" v-model="profileData.notifications.sms" />
                <span>📱 SMS Notifications</span>
              </label>
              <label class="checkbox-card">
                <input type="checkbox" v-model="profileData.notifications.dashboard" />
                <span>🔔 Dashboard Popups</span>
              </label>
            </div>
          </div>
          
          <div class="form-actions right">
            <button @click="saveFinancial" class="btn-primary">Save Financial Settings</button>
          </div>
      </div>

      <!-- Security Tab -->
      <div v-if="activeTab === 'security'" class="content-section">
         <div class="section-header">
           <h2>Security Settings</h2>
           <p class="section-desc">Password and account security</p>
        </div>

        <div class="form-grid">
           <div class="form-group full-width">
            <label class="form-label">Current Password</label>
            <input 
              v-model="securityData.currentPassword" 
              type="password" 
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">New Password</label>
            <input 
              v-model="securityData.newPassword" 
              type="password" 
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <input 
              v-model="securityData.confirmPassword" 
              type="password" 
              class="form-input"
            />
          </div>
        </div>

        <div class="form-actions right">
          <button @click="changePassword" class="btn-primary">Change Password</button>
        </div>
      </div>

    </main>
  </div>
</template>

<script>
import axios from 'axios'
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'CateringProviderProfile',
  components: {
    Navbar
  },
  data() {
    return {
      activeTab: 'branding',
      saveSuccess: '',
      saveError: '',
      profileData: {
        // Brand Identity
        businessName: '',
        address: '',
        phone: '',
        email: '',
        logo: null,
        banner: null,
        aboutUs: '',
        gallery: [],

        // Operations
        serviceAreaType: 'radius',
        deliveryRadius: 50,
        serviceLocations: [],
        leadTimeDays: 3,
        minimumOrderValue: 500,
        operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        operatingHours: {
          Monday: { open: '09:00', close: '18:00' },
          Tuesday: { open: '09:00', close: '18:00' },
          Wednesday: { open: '09:00', close: '18:00' },
          Thursday: { open: '09:00', close: '18:00' },
          Friday: { open: '09:00', close: '18:00' },
          Saturday: { open: '09:00', close: '18:00' },
          Sunday: { open: '09:00', close: '18:00' }
        },

        // Financial
        bankAccount: '',
        bankName: '',
        accountHolderName: '',
        notifications: {
          email: true,
          sms: false,
          dashboard: true
        }
      },
      documents: {
        businessRegistration: { current: null, pending: false },
        foodLicense: { current: null, pending: false },
        bankStatement: { current: null, pending: false },
        halalCertificate: { current: null, pending: false }
      },
      pendingChanges: {
        businessName: false,
        bankAccount: false
      },
      securityData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      availableLocations: [
        'Kuala Lumpur', 'Selangor', 'Putrajaya', 'Negeri Sembilan', 
        'Melaka', 'Johor', 'Pahang', 'Terengganu', 'Kelantan',
        'Perak', 'Penang', 'Kedah', 'Perlis', 'Sabah', 'Sarawak'
      ]
    }
  },
  mounted() {
    console.log('CateringProviderProfile mounted!')
    this.loadProfile()
  },
  methods: {
    getAuthHeaders() {
      const authStore = useAuthStore()
      return {
        headers: { Authorization: `Bearer ${authStore.token}` }
      }
    },
    async loadProfile() {
      try {
        console.log('Loading profile...')
        console.log('Auth headers:', this.getAuthHeaders())
        
        const response = await axios.get('http://localhost:5000/api/provider/profile', this.getAuthHeaders())
        
        console.log('Profile loaded:', response.data)
        
        // Merge loaded data with defaults
        if (response.data) {
          Object.assign(this.profileData, response.data.profile)
          Object.assign(this.documents, response.data.documents)
          Object.assign(this.pendingChanges, response.data.pendingChanges)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        console.error('Error response:', error.response)
        this.saveError = 'Failed to load profile: ' + (error.response?.data?.message || error.message)
      }
    },
    
    // Image Uploads
    handleLogoUpload(e) {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          this.saveError = 'Logo must be less than 2MB'
          return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          this.profileData.logo = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    removeLogo() {
      this.profileData.logo = null
      this.$refs.logoInput.value = ''
    },
    handleBannerUpload(e) {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          this.saveError = 'Banner must be less than 5MB'
          return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          this.profileData.banner = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    removeBanner() {
      this.profileData.banner = null
      this.$refs.bannerInput.value = ''
    },
    handleGalleryUpload(e) {
      const files = Array.from(e.target.files)
      files.forEach(file => {
        if (file.size > 3 * 1024 * 1024) {
          this.saveError = 'Each photo must be less than 3MB'
          return
        }
        if (this.profileData.gallery.length >= 12) {
          this.saveError = 'Maximum 12 photos allowed'
          return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          this.profileData.gallery.push(e.target.result)
        }
        reader.readAsDataURL(file)
      })
      this.$refs.galleryInput.value = ''
    },
    removeGalleryPhoto(index) {
      this.profileData.gallery.splice(index, 1)
    },

    // Document Management
    selectDocument(docType) {
      const refMap = {
        businessRegistration: 'ssmInput',
        foodLicense: 'foodLicenseInput',
        bankStatement: 'bankStatementInput',
        halalCertificate: 'halalCertInput'
      }
      this.$refs[refMap[docType]].click()
    },
    async handleDocUpload(e, docType) {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          this.saveError = 'Document must be less than 5MB'
          return
        }

        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            // Upload document with pending approval status
            await axios.post('http://localhost:5000/api/provider/upload-document', {
              documentType: docType,
              documentData: e.target.result
            }, this.getAuthHeaders())

            this.documents[docType].pending = true
            this.saveSuccess = 'Document uploaded. Awaiting superadmin approval.'
            setTimeout(() => this.saveSuccess = '', 3000)
          } catch (error) {
            this.saveError = 'Failed to upload document'
            setTimeout(() => this.saveError = '', 3000)
          }
        }
        reader.readAsDataURL(file)
      }
    },
    getDocStatus(docType) {
      if (this.documents[docType].pending) return 'warning'
      if (this.documents[docType].current) return 'verified'
      return 'missing'
    },
    getDocIcon(docType) {
      if (this.documents[docType].pending) return '⏳'
      if (this.documents[docType].current) return '✅'
      return '❌'
    },
    getDocStatusText(docType) {
      if (this.documents[docType].pending) return 'Pending Approval'
      if (this.documents[docType].current) return 'Verified'
      return 'Not Uploaded'
    },

    // Approval Management
    markForApproval(field) {
      this.pendingChanges[field] = true
    },

    // Save Methods
    async saveBranding() {
      try {
        await axios.put('http://localhost:5000/api/provider/profile/branding', {
          ...this.profileData,
          pendingChanges: this.pendingChanges
        }, this.getAuthHeaders())
        
        this.saveSuccess = 'Brand identity saved successfully!'
        setTimeout(() => this.saveSuccess = '', 3000)
      } catch (error) {
        this.saveError = 'Failed to save branding'
        setTimeout(() => this.saveError = '', 3000)
      }
    },
    async saveOperations() {
      try {
        await axios.put('http://localhost:5000/api/provider/profile/operations', {
          serviceAreaType: this.profileData.serviceAreaType,
          deliveryRadius: this.profileData.deliveryRadius,
          serviceLocations: this.profileData.serviceLocations,
          leadTimeDays: this.profileData.leadTimeDays,
          minimumOrderValue: this.profileData.minimumOrderValue,
          operatingDays: this.profileData.operatingDays,
          operatingHours: this.profileData.operatingHours
        }, this.getAuthHeaders())
        
        this.saveSuccess = 'Operational rules saved successfully!'
        setTimeout(() => this.saveSuccess = '', 3000)
      } catch (error) {
        this.saveError = 'Failed to save operations'
        setTimeout(() => this.saveError = '', 3000)
      }
    },
    async saveFinancial() {
      try {
        await axios.put('http://localhost:5000/api/provider/profile/financial', {
          bankAccount: this.profileData.bankAccount,
          bankName: this.profileData.bankName,
          accountHolderName: this.profileData.accountHolderName,
          notifications: this.profileData.notifications,
          pendingChanges: this.pendingChanges
        }, this.getAuthHeaders())
        
        this.saveSuccess = 'Financial settings saved successfully!'
        setTimeout(() => this.saveSuccess = '', 3000)
      } catch (error) {
        this.saveError = 'Failed to save financial settings'
        setTimeout(() => this.saveError = '', 3000)
      }
    },
    async changePassword() {
      if (this.securityData.newPassword !== this.securityData.confirmPassword) {
        this.saveError = 'Passwords do not match'
        setTimeout(() => this.saveError = '', 3000)
        return
      }

      if (this.securityData.newPassword.length < 6) {
        this.saveError = 'Password must be at least 6 characters'
        setTimeout(() => this.saveError = '', 3000)
        return
      }

      try {
        await axios.put('http://localhost:5000/api/provider/change-password', {
          currentPassword: this.securityData.currentPassword,
          newPassword: this.securityData.newPassword
        }, this.getAuthHeaders())
        
        this.saveSuccess = 'Password changed successfully!'
        this.securityData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        setTimeout(() => this.saveSuccess = '', 3000)
      } catch (error) {
        this.saveError = error.response?.data?.message || 'Failed to change password'
        setTimeout(() => this.saveError = '', 3000)
      }
    }
  }
}
</script>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
}

.admin-content {
  flex: 1;
  padding: 32px;
  margin-left: 280px; 
}

/* Page Header */
.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.025em;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #64748b;
  font-size: 16px;
}

/* Alerts */
.alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 500;
}

.success-alert {
  background-color: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.error-alert {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Tabs */
.tabs-container {
  margin-bottom: 32px;
  border-bottom: 1px solid #e2e8f0;
}

.tabs {
  display: flex;
  gap: 32px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0 0 16px 0;
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #0f172a;
}

.tab-btn.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
  font-weight: 600;
}

/* Content Sections */
.content-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  margin-bottom: 40px;
  max-width: 1000px;
}

.section-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.section-desc {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

/* Grid Layouts */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.full-width {
  grid-column: span 2;
}

.divider {
  height: 1px;
  background-color: #f1f5f9;
  margin: 32px 0;
}

/* Forms */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  transition: all 0.2s;
  background-color: #fff;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input.narrow {
  width: 120px;
}
.form-input.small {
  padding: 8px 12px;
}

.input-wrapper {
  position: relative;
}

.icon-lock {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
}

.badge-warning {
  background-color: #fffbeb;
  color: #b45309;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-weight: 600;
  border: 1px solid #fcd34d;
}

/* Upload Areas */
.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background-color: #f8fafc;
  transition: all 0.2s;
  overflow: hidden;
  position: relative;
}

.upload-area:hover {
  border-color: #2563eb;
  background-color: #eff6ff;
}

.upload-placeholder {
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
}

.upload-icon {
  color: #94a3b8;
  margin-bottom: 12px;
}

.upload-placeholder p {
  font-weight: 600;
  color: #475569;
  margin: 0 0 4px 0;
  font-size: 14px;
}

.upload-placeholder span {
  font-size: 12px;
  color: #94a3b8;
}

.preview-container {
  position: relative;
  width: 100%;
}

.logo-preview {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.logo-preview img {
  max-height: 100%;
  max-width: 100%;
  border-radius: 8px;
}

.banner-preview {
  height: 200px;
}

.banner-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-icon.delete {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  color: #ef4444;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-icon.delete:hover {
  background: #fef2f2;
}

/* Gallery */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-add {
  aspect-ratio: 1;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #f8fafc;
  color: #64748b;
  transition: all 0.2s;
  gap: 8px;
}

.gallery-add:hover {
  border-color: #2563eb;
  color: #2563eb;
  background-color: #eff6ff;
}

/* Radio Cards */
.radio-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.radio-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-card:hover {
  border-color: #94a3b8;
}

.radio-card.active {
  border-color: #2563eb;
  background-color: #eff6ff;
}

.radio-title {
  display: block;
  font-weight: 600;
  color: #0f172a;
  font-size: 14px;
}

.radio-desc {
  font-size: 13px;
  color: #64748b;
}

/* Buttons */
.btn-primary {
  background-color: #0f172a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-primary:hover {
  background-color: #1e293b;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: white;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.btn-secondary:hover {
  border-color: #cbd5e1;
  background-color: #f8fafc;
}

.form-actions {
  margin-top: 32px;
  display: flex;
}

.form-actions.right {
  justify-content: flex-end;
}

/* Helper Text */
.helper-text {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0 0;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
}

/* Status Documentation Cards */
.status-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
}

.status-card.verified {
  border-color: #a7f3d0;
  background-color: #ecfdf5;
}

.status-card.warning {
  border-color: #fcd34d;
  background-color: #fffbeb;
}

.status-card.missing {
  border-color: #fecaca;
  background-color: #fef2f2;
}

.status-emoji {
  font-size: 24px;
}

.status-details strong {
  display: block;
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 2px;
}

.status-details p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

/* Files Upload Grid */
.upload-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.upload-item-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
}

.upload-item-card h4 {
  margin: 0;
  font-size: 14px;
  color: #334155;
  font-weight: 600;
}

/* Operating Days */
.operating-hours-grid {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.day-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  transition: all 0.2s;
}

.day-row:last-child {
  border-bottom: none;
}

.day-row.active {
  background-color: #eff6ff;
}

.day-check {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  min-width: 140px;
}

.day-name {
  font-weight: 500;
  color: #334155;
}

.time-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-input-group span {
  color: #94a3b8;
  font-size: 13px;
}

/* Checkbox Lists */
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}
.checkbox-item:hover {
  background: #f1f5f9;
}

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  transition: 0.2s;
}

.checkbox-card:hover {
  background-color: #f8fafc;
}

.mt-20 {
  margin-top: 20px;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
