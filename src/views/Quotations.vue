<template>
  <div class="quotations-page">
    <Navbar />
    
    <div class="quotations-container">
      <!-- Modern Hero Section -->
      <div class="hero-section">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1>My Quotation Requests</h1>
          <p class="hero-subtitle">Track and manage your custom catering inquiries</p>
          <button @click="showRequestModal = true" class="btn-hero-action">
            <span>+</span> Request New Quotation
          </button>
        </div>
      </div>

      <div class="main-content">
        <!-- Status Tabs -->
        <div class="tabs-wrapper">
          <div class="tabs">
            <button @click="activeTab = 'all'" :class="{ active: activeTab === 'all' }">
              All Requests <span class="count-badge">{{ allQuotations.length }}</span>
            </button>
            <button @click="activeTab = 'pending'" :class="{ active: activeTab === 'pending' }">
              Pending <span class="count-badge">{{ pendingCount }}</span>
            </button>
            <button @click="activeTab = 'quoted'" :class="{ active: activeTab === 'quoted' }">
              Received Quotes <span class="count-badge">{{ quotedCount }}</span>
            </button>
            <button @click="activeTab = 'accepted'" :class="{ active: activeTab === 'accepted' }">
              Accepted <span class="count-badge">{{ acceptedCount }}</span>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredQuotations.length === 0" class="empty-state">
          <div class="empty-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h3>No Quotations Found</h3>
          <p>You haven't submitted any quotation requests yet.</p>
          <button @click="showRequestModal = true" class="btn-primary">Create First Request</button>
        </div>

        <!-- Quotations List -->
        <div v-else class="quotations-grid">
          <div v-for="quotation in filteredQuotations" :key="quotation._id" class="quotation-card">
            <div class="card-status-bar" :class="quotation.status"></div>
            
            <div class="card-header">
              <div class="header-top">
                <span class="id-badge">#{{ quotation.quotationId || 'PROCESSING' }}</span>
                <span class="status-badge" :class="quotation.status">
                  {{ quotation.status === 'quoted' ? 'QUOTE RECEIVED' : quotation.status.toUpperCase() }}
                </span>
              </div>
              <h3 class="event-title">{{ quotation.eventType || 'Catering Event' }}</h3>
              <p class="event-date">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {{ formatDate(quotation.eventDate) }}
              </p>
            </div>

            <div class="card-body">
              <div class="info-grid">
                <div class="info-point">
                  <span class="label">Guests</span>
                  <span class="value">{{ quotation.numberOfGuests }} pax</span>
                </div>
                <div class="info-point">
                  <span class="label">Location</span>
                  <span class="value truncate">{{ quotation.location || 'TBA' }}</span>
                </div>
                <div class="info-point">
                  <span class="label">Catering Provider</span>
                  <span class="value">{{ getProviderName(quotation) }}</span>
                </div>
                <div class="info-point">
                  <span class="label">Selected Package</span>
                  <span class="value">{{ getPackageName(quotation) }}</span>
                </div>
              </div>

              <!-- Admin Response Preview -->
              <div v-if="quotation.status === 'quoted' || quotation.status === 'accepted'" class="quote-preview">
                <div class="quote-amount">
                  <span class="label">Quoted Price</span>
                  <span class="amount">RM {{ quotation.quotedAmount?.toFixed(2) || '0.00' }}</span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <div class="card-main-actions">
                <button class="btn-details" @click="openDetailsModal(quotation)">
                  View Details
                </button>
                <button
                  v-if="quotation.status === 'quoted' && quotation.quotationPdfUrl"
                  class="btn-view-pdf"
                  @click.stop="downloadQuotationPdf(quotation)"
                >
                  View PDF
                </button>
              </div>
              
              <div v-if="quotation.status === 'quoted'" class="action-actions-sm">
                 <button @click.stop="acceptQuotation(quotation)" class="btn-xs-accept">Accept</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div v-if="showDetailsModal && selectedQuotation" class="modal-overlay" @click="closeDetailsModal">
      <div class="details-modal-content" @click.stop>
        <div class="details-modal-header">
          <div>
            <h3>Quotation Details</h3>
            <p class="details-subtitle">#{{ selectedQuotation.quotationId || 'PROCESSING' }}</p>
          </div>
          <button @click="closeDetailsModal" class="close-btn">✕</button>
        </div>

        <div class="details-modal-body grouped-details">
          <div class="details-category">
            <div class="section-title">
              <span class="section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
                </svg>
              </span>
              Event Details
            </div>
            <div class="details-list">
              <div class="detail-row">
                <span class="detail-key">Date & Time</span>
                <span class="detail-val">{{ formatDate(selectedQuotation.eventDate) }}{{ selectedQuotation.eventTime ? `, ${selectedQuotation.eventTime}` : '' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Guests</span>
                <span class="detail-val">{{ selectedQuotation.numberOfGuests }} pax</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Event Type</span>
                <span class="detail-val">{{ selectedQuotation.eventType || 'General Event' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Location</span>
                <span class="detail-val">{{ selectedQuotation.location || 'To be confirmed' }}</span>
              </div>
            </div>
          </div>

          <div class="details-category">
            <div class="section-title">
              <span class="section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="18" rx="1" stroke="currentColor" stroke-width="2"/>
                  <rect x="14" y="8" width="7" height="13" rx="1" stroke="currentColor" stroke-width="2"/>
                  <line x1="6.5" y1="7" x2="6.5" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <line x1="6.5" y1="11" x2="6.5" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <line x1="6.5" y1="15" x2="6.5" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </span>
              Provider & Package
            </div>
            <div class="details-list">
              <div class="detail-row">
                <span class="detail-key">Catering Provider</span>
                <span class="detail-val">{{ getProviderName(selectedQuotation) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Selected Package</span>
                <span class="detail-val">{{ getPackageName(selectedQuotation) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Status</span>
                <span class="detail-val">{{ selectedQuotation.status }}</span>
              </div>
            </div>
          </div>

          <div class="details-category" v-if="selectedQuotation.status === 'quoted' || selectedQuotation.status === 'accepted'">
            <div class="section-title">
              <span class="section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M9 9.5C9 8.67 9.9 8 11 8H13C14.1 8 15 8.67 15 9.5C15 10.33 14.1 11 13 11H11C9.9 11 9 11.67 9 12.5C9 13.33 9.9 14 11 14H13C14.1 14 15 14.67 15 15.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </span>
              Quotation Summary
            </div>
            <div class="details-list">
              <div class="detail-row">
                <span class="detail-key">Quoted Amount</span>
                <span class="detail-val detail-strong">RM {{ selectedQuotation.quotedAmount?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Price Per Pax</span>
                <span class="detail-val">RM {{ getQuotedPerPax(selectedQuotation).toFixed(2) }}</span>
              </div>
              <div class="detail-row" v-if="selectedQuotation.quotationPdfUrl">
                <span class="detail-key">Quotation PDF</span>
                <span class="detail-val">
                  <button class="btn-download-pdf" @click="downloadQuotationPdf(selectedQuotation)">Download PDF</button>
                </span>
              </div>
            </div>
          </div>

          <div class="details-category">
            <div class="section-title">
              <span class="section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 3H17L21 7V21H7V3Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M17 3V7H21" stroke="currentColor" stroke-width="2"/>
                  <line x1="10" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2"/>
                  <line x1="10" y1="16" x2="18" y2="16" stroke="currentColor" stroke-width="2"/>
                  <line x1="10" y1="8" x2="14" y2="8" stroke="currentColor" stroke-width="2"/>
                </svg>
              </span>
              Requirements (Managed)
            </div>
            <div v-if="getCategorizedRequirements(selectedQuotation).length === 0" class="requirements-empty">
              No special requirements submitted.
            </div>
            <div v-else class="requirements-grouped">
              <div
                v-for="(group, groupIndex) in getCategorizedRequirements(selectedQuotation)"
                :key="`${selectedQuotation._id || 'quotation'}-group-${groupIndex}`"
                class="req-category"
              >
                <div class="req-cat-title">{{ group.name }} :</div>
                <p v-if="isSingleLineRequirementCategory(group.name)" class="req-single-line">
                  {{ getSingleLineRequirement(group) }}
                </p>
                <ol v-if="shouldUseNumberedRequirements(group.name)" class="req-list numbered">
                  <li v-for="(item, itemIndex) in group.items" :key="`${selectedQuotation._id || 'quotation'}-group-${groupIndex}-item-${itemIndex}`">
                    {{ item }}
                  </li>
                </ol>
                <ul v-else-if="!isSingleLineRequirementCategory(group.name)" class="req-list normal">
                  <li v-for="(item, itemIndex) in group.items" :key="`${selectedQuotation._id || 'quotation'}-group-${groupIndex}-item-${itemIndex}`">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div v-if="selectedQuotation.adminNotes" class="details-category provider-notes">
            <div class="section-title">
              <span class="section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 11.5C21 16.19 16.97 20 12 20C10.73 20 9.52 19.75 8.43 19.29L3 21L4.81 16.04C4.29 14.7 4 13.2 4 11.5C4 6.81 8.03 3 13 3C17.97 3 21 6.81 21 11.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
              </span>
              Provider Notes
            </div>
            <p>{{ selectedQuotation.adminNotes }}</p>
          </div>
        </div>

        <div class="details-modal-footer">
          <button @click="closeDetailsModal" class="btn-close-details">Close</button>
          <template v-if="selectedQuotation.status === 'quoted'">
            <button @click="rejectQuotation(selectedQuotation)" class="btn-reject-full">Reject</button>
            <button @click="acceptQuotation(selectedQuotation)" class="btn-accept-full">Accept Quote & Checkout</button>
          </template>
          <button v-if="selectedQuotation.status === 'accepted'" @click="proceedToOrder(selectedQuotation)" class="btn-proceed-full">Proceed to Checkout</button>
        </div>
      </div>
    </div>

    <!-- Quotation Request Modal -->
    <div v-if="showRequestModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>📝 Request Quotation</h3>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        
        <form @submit.prevent="submitQuotationRequest" class="quotation-form">
          <div class="form-row">
            <div class="form-group">
              <label>Customer Name *</label>
              <input v-model="quotationForm.customerName" type="text" required>
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input v-model="quotationForm.email" type="email" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Phone Number *</label>
              <input v-model="quotationForm.phoneNumber" type="tel" required>
            </div>
            <div class="form-group">
              <label>Number of Guests *</label>
              <input v-model.number="quotationForm.numberOfGuests" type="number" min="1" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Event Date *</label>
              <input v-model="quotationForm.eventDate" type="date" :min="minDate" required>
            </div>
            <div class="form-group">
              <label>Event Time</label>
              <input v-model="quotationForm.eventTime" type="time">
            </div>
          </div>

          <div class="form-group">
            <label>Event Location *</label>
            <input v-model="quotationForm.location" type="text" required>
          </div>

          <div class="form-group">
            <label>Event Type</label>
            <select v-model="quotationForm.eventType">
              <option value="">Select event type</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday</option>
              <option value="corporate">Corporate Event</option>
              <option value="conference">Conference</option>
              <option value="seminar">Seminar</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label>Additional Requirements</label>
            <textarea v-model="quotationForm.additionalRequests" rows="4" 
                      placeholder="Please specify any dietary restrictions, special requests, or preferences..."></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-submit" :disabled="submitting">
              {{ submitting ? 'Submitting...' : 'Submit Request' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useQuotationsStore } from '@/stores/quotations'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  data() {
    return {
      activeTab: 'all',
      showRequestModal: false,
      showDetailsModal: false,
      submitting: false,
      selectedQuotation: null,
      quotationForm: {
        customerName: '',
        email: '',
        phoneNumber: '',
        eventDate: '',
        eventTime: '',
        location: '',
        numberOfGuests: 1,
        eventType: '',
        additionalRequests: ''
      }
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    },
    quotationsStore() {
      return useQuotationsStore()
    },
    allQuotations() {
      return this.quotationsStore.quotations || []
    },
    minDate() {
      const today = new Date()
      today.setDate(today.getDate() + 1) // Minimum 1 day ahead
      return today.toISOString().split('T')[0]
    },
    filteredQuotations() {
      if (this.activeTab === 'all') return this.allQuotations
      return this.allQuotations.filter(q => q.status === this.activeTab)
    },
    pendingCount() {
      return this.allQuotations.filter(q => q.status === 'pending').length
    },
    quotedCount() {
      return this.allQuotations.filter(q => q.status === 'quoted').length
    },
    acceptedCount() {
      return this.allQuotations.filter(q => q.status === 'accepted').length
    }
  },
  methods: {
    openDetailsModal(quotation) {
      this.selectedQuotation = quotation
      this.showDetailsModal = true
    },
    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedQuotation = null
    },
    closeModal() {
      this.showRequestModal = false
      this.resetForm()
    },
    resetForm() {
      this.quotationForm = {
        customerName: this.authStore.user?.fullName || '',
        email: this.authStore.user?.email || '',
        phoneNumber: this.authStore.user?.phone || '',
        eventDate: '',
        eventTime: '',
        location: '',
        numberOfGuests: 1,
        eventType: '',
        additionalRequests: ''
      }
    },
    async submitQuotationRequest() {
      try {
        this.submitting = true
        await this.quotationsStore.submitQuotation(this.quotationForm)
        alert('✓ Quotation request submitted successfully! We will review and respond soon.')
        this.closeModal()
        await this.quotationsStore.fetchMyQuotations()
      } catch (error) {
        console.error('Error submitting quotation:', error)
        alert('Failed to submit quotation request. Please try again.')
      } finally {
        this.submitting = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    getProviderName(quotation) {
      return quotation?.providerId?.businessName || quotation?.providerId?.username || 'Catering Provider'
    },
    getPackageName(quotation) {
      return quotation?.packageId?.name || quotation?.packageName || 'Custom Package'
    },
    getQuotedPerPax(quotation) {
      const quotedAmount = Number(quotation?.quotedAmount || 0)
      const pax = Number(quotation?.numberOfGuests || 0)
      if (!quotedAmount || !pax) return 0
      return quotedAmount / pax
    },
    resolveUploadUrl(filePath) {
      if (!filePath) return ''
      if (filePath.startsWith('http') || filePath.startsWith('data:')) {
        return filePath
      }
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const hostBase = apiUrl.replace(/\/api\/?$/, '')
      let normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`
      if (normalizedPath.startsWith('/uploads/')) {
        normalizedPath = `/api${normalizedPath}`
      }
      return `${hostBase}${normalizedPath}`
    },
    downloadQuotationPdf(quotation) {
      const pdfUrl = this.resolveUploadUrl(quotation?.quotationPdfUrl)
      if (!pdfUrl) {
        alert('No quotation PDF available for this quote yet.')
        return
      }
      window.open(pdfUrl, '_blank', 'noopener,noreferrer')
    },
    getRequirementsList(quotation) {
      const content = quotation?.additionalRequests || ''
      if (!content.trim()) return []
      return content
        .split(/\r?\n|;|,/)
        .map(item => item.trim())
        .filter(Boolean)
    },
    getCategorizedRequirements(quotation) {
      const rawText = String(quotation?.additionalRequests || '').trim()
      if (!rawText) return []

      const groups = {}
      const normalizedLines = rawText
        .split(/\r?\n|;/)
        .map(line => line.trim())
        .filter(Boolean)

      const isBoilerplateLine = (line) => {
        const cleaned = String(line || '').trim()
        if (!cleaned) return true
        if (/^[━\-_=]{3,}$/.test(cleaned)) return true

        const upper = cleaned.toUpperCase()
        const ignoredHeaders = [
          'QUOTATION REQUEST',
          'SELECTED ITEMS',
          'BASED ON PACKAGE',
          'STANDARD PRICE'
        ]
        return ignoredHeaders.some(header => upper.includes(header))
      }

      const addGroupItem = (name, item) => {
        const categoryName = this.normalizeRequirementCategory(name)
        if (!groups[categoryName]) {
          groups[categoryName] = []
        }
        if (item && item.trim()) {
          const cleanedItem = item.trim()

          if (this.isSingleLineRequirementCategory(categoryName)) {
            if (groups[categoryName].length === 0) {
              groups[categoryName].push(cleanedItem)
            } else {
              groups[categoryName][0] = `${groups[categoryName][0]} ${cleanedItem}`.replace(/\s+/g, ' ').trim()
            }
            return
          }

          groups[categoryName].push(cleanedItem)
        }
      }

      let currentCategory = 'General'

      normalizedLines.forEach((line) => {
        const upperLine = line.toUpperCase()
        if (upperLine.startsWith('CUSTOMER REMARKS')) {
          currentCategory = 'Customer remarks'
          if (!groups[currentCategory]) {
            groups[currentCategory] = []
          }
          return
        }

        if (isBoilerplateLine(line)) {
          return
        }

        const headingOnlyMatch = line.match(/^([^:]{2,40})\s*:\s*$/)
        if (headingOnlyMatch) {
          currentCategory = this.normalizeRequirementCategory(headingOnlyMatch[1])
          if (!groups[currentCategory]) {
            groups[currentCategory] = []
          }
          return
        }

        const categoryMatch = line.match(/^([^:]{2,40})\s*:\s*(.+)$/)

        if (categoryMatch) {
          const category = this.normalizeRequirementCategory(categoryMatch[1])
          const body = categoryMatch[2].trim()

          currentCategory = category

          const numberedItemMatches = body.match(/\d+[)\-]\s+[^\d].*?(?=(?:\s\d+[)\-]\s+)|$)|\d+\.(?!\d)\s+.*?(?=(?:\s\d+\.(?!\d)\s+)|$)/g)

          if (Array.isArray(numberedItemMatches) && numberedItemMatches.length > 0) {
            numberedItemMatches
              .map(item => item.replace(/^\d+\s*[)\.-]\s*/, '').trim())
              .filter(Boolean)
              .forEach(item => addGroupItem(category, item))
            return
          }

          body
            .split(/,/) 
            .map(part => part.trim())
            .filter(Boolean)
            .forEach(item => addGroupItem(category, item))
          return
        }

        const cleanedItem = line
          .replace(/^[-•]\s*/, '')
          .replace(/^\d+\s*[\.)-]\s*/, '')
          .trim()

        if (cleanedItem) {
          addGroupItem(currentCategory, cleanedItem)
        }
      })

      return Object.entries(groups)
        .map(([name, items]) => ({ name, items }))
        .filter(group => group.items.length > 0)
    },
    normalizeRequirementCategory(categoryName) {
      const normalizedCategory = String(categoryName || '')
        .toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim()

      const categoryMap = {
        rice: 'Rice',
        'main dish': 'Main dish',
        'main dishes': 'Main dish',
        'side dish': 'Side dish',
        sides: 'Side dish',
        drinks: 'Beverage',
        drink: 'Beverage',
        beverage: 'Beverage',
        beverages: 'Beverage',
        dessert: 'Dessert',
        desserts: 'Dessert',
        'waiter service': 'Waiter service',
        venue: 'Venue',
        'customer remarks': 'Customer remarks',
        note: 'Note',
        notes: 'Note',
        general: 'General'
      }

      if (!normalizedCategory) return 'General'
      return categoryMap[normalizedCategory] || this.toTitleCase(normalizedCategory)
    },
    toTitleCase(text) {
      return String(text || '')
        .split(' ')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
    shouldUseNumberedRequirements(categoryName) {
      const normalizedCategory = this.normalizeRequirementCategory(categoryName).toLowerCase()

      const numberedCategories = new Set([
        'rice',
        'main dish',
        'side dish',
        'beverage',
        'dessert'
      ])

      return numberedCategories.has(normalizedCategory)
    },
    isSingleLineRequirementCategory(categoryName) {
      const normalizedCategory = this.normalizeRequirementCategory(categoryName).toLowerCase()
      return normalizedCategory === 'waiter service' || normalizedCategory === 'venue'
    },
    getSingleLineRequirement(group) {
      if (!group || !Array.isArray(group.items) || group.items.length === 0) {
        return '-'
      }
      return group.items.join(' ').replace(/\s+/g, ' ').trim()
    },
    async acceptQuotation(quotation) {
      if (confirm('Accept this quotation and add to cart for checkout?')) {
        try {
          await this.quotationsStore.acceptQuotation(quotation._id || quotation.id)
          
          // Automatically add to cart
          this.addQuotationToCart(quotation)
          
          alert('Quotation accepted and added to cart! Redirecting to checkout...')
          
          // Redirect to checkout after 1 second
          setTimeout(() => {
            this.$router.push('/checkout')
          }, 1000)
        } catch (error) {
          alert('Failed to accept quotation. Please try again.')
        }
      }
    },
    async rejectQuotation(quotation) {
      if (confirm('Are you sure you want to reject this quotation?')) {
        try {
          await this.quotationsStore.rejectQuotation(quotation._id || quotation.id)
          alert('Quotation rejected.')
        } catch (error) {
          alert('Failed to reject quotation. Please try again.')
        }
      }
    },
    proceedToOrder(quotation) {
      this.addQuotationToCart(quotation)
      this.$router.push('/checkout')
    },
    addQuotationToCart(quotation) {
      const cartStore = useCartStore()
      
      // Clear existing cart items to avoid conflicts
      cartStore.clearCart()
      
      // Create cart item from quotation
      const cartItem = {
        id: `quotation-${quotation._id}`,
        packageId: quotation.packageId || quotation._id,
        providerId: quotation.providerId?._id || quotation.providerId,
        name: `Custom Quotation ${quotation.quotationId || ''}`,
        price: quotation.quotedAmount / quotation.numberOfGuests, // Price per pax
        quantity: quotation.numberOfGuests,
        category: 'quotation',
        quotationId: quotation._id,
        foods: quotation.selectedFoods || [],
        drinks: quotation.selectedDrinks || [],
        cakes: quotation.selectedCakes || [],
        eventDate: quotation.eventDate,
        eventTime: quotation.eventTime || '12:00',
        location: quotation.location,
        specialRequirements: quotation.additionalRequests
      }
      
      cartStore.addToCart(cartItem)
      
      // Store quotation reference
      sessionStorage.setItem('quotationOrder', JSON.stringify({
        quotationId: quotation._id,
        quotationNumber: quotation.quotationId,
        quotedAmount: quotation.quotedAmount,
        numberOfGuests: quotation.numberOfGuests,
        eventDate: quotation.eventDate,
        providerId: quotation.providerId?._id || quotation.providerId,
        packageId: quotation.packageId,
        eventTime: quotation.eventTime,
        location: quotation.location
      }))
    }
  },
  async mounted() {
    // Pre-fill form with user data
    if (this.authStore.user) {
      this.quotationForm.customerName = this.authStore.user.fullName || ''
      this.quotationForm.email = this.authStore.user.email || ''
      this.quotationForm.phoneNumber = this.authStore.user.phone || ''
    }
    
    // Fetch quotations
    await this.quotationsStore.fetchMyQuotations()
  }
}
</script>

<style scoped>
/* Main Layout */
.quotations-page {
  display: flex; /* Changed to flex to align with sidebar */
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.quotations-container {
  flex: 1;
  margin-left: 260px; /* Offset for the fixed Navbar */
  width: calc(100% - 260px);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Hero Section - Matching Home.vue & Menu.vue */
.hero-section {
  position: relative;
  background-color: #1e293b;
  color: white;
  padding: 50px 20px;
  text-align: center;
  overflow: hidden;
  margin-bottom: 0;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 20%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(to right, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 24px;
  line-height: 1.6;
}

.btn-hero-action {
  background: #2563eb;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
}

.btn-hero-action:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
}

.btn-hero-action span {
  font-size: 1.2rem;
  line-height: 1;
}


/* Tabs */
.tabs-wrapper {
  margin-top: -24px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
}

.tabs {
  background: white;
  padding: 4px;
  border-radius: 16px;
  display: inline-flex;
  gap: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  flex-wrap: wrap;
  justify-content: center;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabs button.active {
  background: #f1f5f9;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.count-badge {
  background: #e2e8f0;
  color: #64748b;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 10px;
  transition: all 0.2s;
}

.tabs button.active .count-badge {
  background: #0f172a;
  color: white;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  margin: 40px auto;
  border: 1px dashed #cbd5e1;
}

.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: #94a3b8;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 24px;
}

.btn-primary {
  background: #0f172a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #1e293b;
  transform: translateY(-1px);
}

/* Quotations Grid */
.quotations-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}

.quotation-card {
  width: 100%;
  max-width: 380px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.quotation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

/* Status Bar Logic */
.card-status-bar {
  height: 4px;
  width: 100%;
}
.card-status-bar.pending { background: #f59e0b; }
.card-status-bar.quoted { background: #3b82f6; }
.card-status-bar.accepted { background: #10b981; }
.card-status-bar.rejected { background: #ef4444; }

.card-header {
  padding: 20px;
  border-bottom: 1px solid #f8fafc;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.id-badge {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.75rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
}

.status-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.02em;
}

.status-badge.pending { background: #fffbeb; color: #b45309; }
.status-badge.quoted { background: #eff6ff; color: #1d4ed8; }
.status-badge.accepted { background: #f0fdf4; color: #15803d; }
.status-badge.rejected { background: #fef2f2; color: #b91c1c; }

.event-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
  text-transform: capitalize;
}

.event-date {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.9rem;
}

.card-body {
  padding: 20px;
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.info-point {
  display: flex;
  flex-direction: column;
}

.info-point .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 4px;
}

.info-point .value {
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
}

.value.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quote-preview {
  margin-top: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
}

.quote-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quote-amount .amount {
  color: #0f172a;
  font-weight: 700;
  font-size: 1.1rem;
}

.card-footer {
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-main-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-details {
  background: transparent;
  border: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
}

.btn-details:hover {
  text-decoration: underline;
  color: #334155;
}

.btn-view-pdf {
  background: #e2e8f0;
  color: #0f172a;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view-pdf:hover {
  background: #cbd5e1;
}

.btn-xs-accept {
  background: #2563eb;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-download-pdf {
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn-download-pdf:hover {
  background: #1e293b;
}

.details-modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.details-modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f8fafc;
}

.details-modal-header h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.2rem;
  font-weight: 700;
}

.details-subtitle {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.88rem;
}

.details-modal-body {
  padding: 20px;
  overflow-y: auto;
  background: #f8fafc;
}

.details-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

.btn-close-details {
  background: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.grouped-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.details-category {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
}

.details-list {
  display: grid;
  gap: 8px;
}

.detail-row {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 10px;
}

.detail-key {
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.detail-val {
  color: #0f172a;
  font-size: 0.92rem;
  line-height: 1.45;
  word-break: break-word;
}

.detail-strong {
  font-weight: 700;
}

.requirements-grouped {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.req-category {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  background: #f8fafc;
}

.req-cat-title {
  font-size: 0.86rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.req-list {
  margin: 0;
  color: #334155;
  font-size: 0.9rem;
  line-height: 1.5;
}

.req-list.numbered {
  padding-left: 20px;
  list-style-type: decimal;
}

.req-list.normal {
  padding-left: 16px;
  list-style-type: disc;
}

.req-list li {
  margin-bottom: 4px;
}

.req-list li:last-child {
  margin-bottom: 0;
}

.req-single-line {
  margin: 0;
  color: #334155;
  font-size: 0.9rem;
  line-height: 1.5;
}

.requirements-empty {
  text-align: left;
  color: #64748b;
  font-size: 0.9rem;
}

.section-title {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.section-icon {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.section-icon svg {
  width: 16px;
  height: 16px;
}

.section-title:first-child {
  margin-top: 0;
}

.req-text {
  color: #475569;
  line-height: 1.6;
  white-space: pre-line;
}

.provider-notes {
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
  padding: 12px;
  margin: 0;
  border-radius: 0 4px 4px 0;
}

.expanded-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-accept-full, .btn-proceed-full {
  flex: 1;
  background: #16a34a;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-accept-full:hover, .btn-proceed-full:hover {
  background: #15803d;
}

.btn-reject-full {
  flex: 1;
  background: white;
  color: #ef4444;
  border: 1px solid #fee2e2;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reject-full:hover {
  background: #fef2f2;
  border-color: #fecaca;
}

/* Modal Styling - Keeping coherent with Home.vue */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h3 {
  margin: 0;
  color: #0f172a;
  font-size: 1.25rem;
  font-weight: 700;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  line-height: 1;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.quotation-form {
  padding: 24px;
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

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  color: #1e293b;
  background: #fff;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  border: 1px solid #cbd5e1;
  background: white;
  color: #64748b;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit {
  flex: 2;
  padding: 12px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}

.btn-submit:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .quotations-grid {
    grid-template-columns: 1fr;
  }

  .details-modal-content {
    max-width: 100%;
    max-height: 95vh;
  }

  .details-modal-footer {
    flex-wrap: wrap;
  }

  .btn-close-details,
  .btn-reject-full,
  .btn-accept-full,
  .btn-proceed-full {
    width: 100%;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}
</style>