<template>
  <div class="admin-container">
    <Navbar />
    
    <div class="admin-content">
      <!-- Modern Hero -->
      <div class="dashboard-hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="hero-text">
            <h2>Quotation Management</h2>
            <p>Review requests, send quotes, and manage customer inquiries.</p>
          </div>
          <div class="stats-summary">
            <div class="stat-pill blue">
              <span class="label">Total</span>
              <span class="value">{{ allQuotations.length }}</span>
            </div>
            <div class="stat-pill yellow">
              <span class="label">Pending</span>
              <span class="value">{{ pendingCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="dashboard-section">
        <div class="filters-bar">
          <button @click="filterStatus = 'all'" :class="['filter-btn', { active: filterStatus === 'all' }]">
            All Requests
          </button>
          <button @click="filterStatus = 'pending'" :class="['filter-btn', { active: filterStatus === 'pending' }]">
            Pending <span v-if="pendingCount" class="badge-count">{{ pendingCount }}</span>
          </button>
          <button @click="filterStatus = 'quoted'" :class="['filter-btn', { active: filterStatus === 'quoted' }]">
            Quoted <span v-if="quotedCount" class="badge-count">{{ quotedCount }}</span>
          </button>
          <button @click="filterStatus = 'accepted'" :class="['filter-btn', { active: filterStatus === 'accepted' }]">
            Accepted <span v-if="acceptedCount" class="badge-count">{{ acceptedCount }}</span>
          </button>
           <button @click="filterStatus = 'rejected'" :class="['filter-btn', { active: filterStatus === 'rejected' }]">
            Rejected <span v-if="rejectedCount" class="badge-count">{{ rejectedCount }}</span>
          </button>
        </div>
      </div>

      <!-- Quotations Table -->
      <div class="dashboard-section">
        <div class="recent-orders-card">
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Quotation ID</th>
                  <th>Customer Details</th>
                  <th>Event Info</th>
                  <th>Package</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredQuotations.length === 0">
                  <td colspan="7" class="empty-cell">
                    <div class="empty-state">
                      <div class="empty-icon">📂</div>
                      <p>No quotations found matching your filter.</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="quotation in filteredQuotations" :key="quotation._id">
                  <td class="order-id">
                    #{{ (quotation.quotationNumber || quotation._id || '').slice(-6).toUpperCase() }}
                  </td>
                  <td>
                    <div class="customer-info">
                      <div class="avatar-placeholder">{{ (quotation.customerName || 'U').charAt(0) }}</div>
                      <div>
                        <div class="customer-name">{{ quotation.customerName || 'Unknown' }}</div>
                        <div class="customer-contact">{{ quotation.contactEmail || 'No Email' }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="event-info">
                      <div class="event-date">📅 {{ formatDate(quotation.eventDate) }}</div>
                      <div class="event-guests">👥 {{ quotation.numberOfGuests }} Guests</div>
                      <div class="event-location">📍 {{ truncateText(quotation.eventLocation || 'TBA', 20) }}</div>
                    </div>
                  </td>
                  <td class="package-name">{{ quotation.packageName || 'Custom Package' }}</td>
                  <td>
                    <span :class="['status-badge', quotation.status]">
                      {{ quotation.status }}
                    </span>
                  </td>
                  <td class="timestamp">{{ formatDate(quotation.createdAt) }}</td>
                  <td>
                     <button 
                      v-if="quotation.status === 'pending'" 
                      @click="openQuoteModal(quotation)" 
                      class="btn-primary-action"
                    >
                      Wait for Quote
                    </button>
                    <button 
                      v-else
                      @click="viewQuotation(quotation)" 
                      class="btn-view-details"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Send Quote Modal -->
      <div v-if="showQuoteModal" class="modal-overlay" @click="closeQuoteModal">
        <div class="modal-card" @click.stop>
          <div class="modal-header">
            <div>
              <h3>Publish Quotation</h3>
              <p class="order-date">For Request #{{ (selectedQuotation.quotationNumber || selectedQuotation._id || '').slice(-6).toUpperCase() }}</p>
            </div>
            <button class="modal-close-btn" @click="closeQuoteModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div class="modal-content-scroll">
            <div class="modal-grid">
              <!-- Request Summary -->
              <div class="info-card">
                <h4>Request Summary</h4>
                <div class="info-row">
                  <span class="label">Customer</span>
                  <span class="value">{{ selectedQuotation.customerName }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Event Date</span>
                  <span class="value">{{ formatDate(selectedQuotation.eventDate) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Guests</span>
                  <span class="value">{{ selectedQuotation.numberOfGuests }} Pax</span>
                </div>
                <div class="info-row">
                  <span class="label">Package</span>
                  <span class="value">{{ selectedQuotation.packageName }}</span>
                </div>
                
                 <div v-if="selectedQuotation.specialRequirements" class="notes-box">
                  <strong>Requirements:</strong> {{ selectedQuotation.specialRequirements }}
                </div>
              </div>

              <!-- Quote Form -->
              <div class="form-card">
                <h4>Your Offer</h4>
                <form @submit.prevent="sendQuotation" id="quoteForm">
                  <div class="form-group">
                    <label>Total Price (RM) *</label>
                    <div class="input-wrapper">
                      <span class="currency-prefix">RM</span>
                      <input 
                        type="number" 
                        v-model.number="quoteForm.price" 
                        step="0.01" 
                        required
                        class="form-input"
                        placeholder="0.00"
                      >
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Message to Customer *</label>
                    <textarea 
                      v-model="quoteForm.message" 
                      rows="4" 
                      required
                      class="form-textarea"
                      placeholder="Describe your offer, menus included, and terms..."
                    ></textarea>
                  </div>

                  <div class="form-group">
                    <label>Internal Notes (Optional)</label>
                    <textarea 
                      v-model="quoteForm.notes" 
                      rows="2"
                      class="form-textarea"
                      placeholder="Notes for your team..."
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="closeQuoteModal" class="btn-close">Cancel</button>
            <button type="submit" form="quoteForm" class="btn-submit">Submit Quotation</button>
          </div>
        </div>
      </div>

       <!-- View Details Modal -->
      <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
        <div class="modal-card" @click.stop>
          <div class="modal-header">
            <div>
              <h3>Quotation Details</h3>
              <p class="order-date">#{{ (selectedQuotation.quotationNumber || selectedQuotation._id || '').slice(-6).toUpperCase() }}</p>
            </div>
            <button class="modal-close-btn" @click="closeDetailsModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div class="modal-content-scroll">
            <div class="modal-grid">
               <!-- Customer & Event Card -->
              <div class="info-card">
                <h4>Customer & Event</h4>
                <div class="info-row">
                  <span class="label">Name</span>
                  <span class="value">{{ selectedQuotation.customerName || 'N/A' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Contact</span>
                  <span class="value">{{ selectedQuotation.contactPhone || 'N/A' }}</span>
                </div>
                 <div class="info-row">
                  <span class="label">Email</span>
                  <span class="value">{{ selectedQuotation.contactEmail || 'N/A' }}</span>
                </div>
                <div class="divider"></div>
                <div class="info-row">
                  <span class="label">Date</span>
                  <span class="value">{{ formatDate(selectedQuotation.eventDate) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Time</span>
                  <span class="value">{{ selectedQuotation.eventTime || 'Not Set' }}</span>
                </div>
                 <div class="info-row">
                  <span class="label">Guests</span>
                  <span class="value">{{ selectedQuotation.numberOfGuests }} Pax</span>
                </div>
                <div class="info-row">
                  <span class="label">Loc</span>
                  <span class="value">{{ selectedQuotation.eventLocation || 'Not Specified' }}</span>
                </div>
              </div>

              <!-- Status & Response Card -->
              <div class="info-card">
                <h4>Quotation Status</h4>
                <div class="info-row">
                  <span class="label">Current Status</span>
                  <span :class="['status-badge', selectedQuotation.status]">{{ selectedQuotation.status }}</span>
                </div>
                 <div class="info-row">
                  <span class="label">Submitted On</span>
                  <span class="value">{{ formatDate(selectedQuotation.createdAt) }}</span>
                </div>
                
                <div v-if="selectedQuotation.status !== 'pending'" class="quote-result-box">
                  <div class="quote-price-large">RM {{ selectedQuotation.quotedPrice?.toFixed(2) }}</div>
                  <div class="quote-date">Quoted on {{ formatDate(selectedQuotation.quotedAt) }}</div>
                  <div class="divider"></div>
                  <p class="quote-message">{{ selectedQuotation.adminResponse }}</p>
                </div>
              </div>
            </div>
            
            <div v-if="selectedQuotation.specialRequirements" class="notes-section">
              <h4>Special Requirements</h4>
              <p>{{ selectedQuotation.specialRequirements }}</p>
            </div>
          </div>
          
          <div class="modal-footer">
            <button @click="closeDetailsModal" class="btn-close">Close</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { useQuotationsStore } from '@/stores/quotations'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  data() {
    return {
      filterStatus: 'all',
      showQuoteModal: false,
      showDetailsModal: false,
      selectedQuotation: null,
      quoteForm: {
        price: null,
        message: '',
        notes: ''
      }
    }
  },
  computed: {
    quotationsStore() {
      return useQuotationsStore()
    },
    allQuotations() {
      return this.quotationsStore.allQuotations
    },
    filteredQuotations() {
      let quotes = this.allQuotations
      if (this.filterStatus !== 'all') {
        quotes = this.allQuotations.filter(q => q.status === this.filterStatus)
      }
      // Sort newest first
      return [...quotes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },
    pendingCount() {
      return this.allQuotations.filter(q => q.status === 'pending').length
    },
    quotedCount() {
      return this.allQuotations.filter(q => q.status === 'quoted').length
    },
    acceptedCount() {
      return this.allQuotations.filter(q => q.status === 'accepted').length
    },
    rejectedCount() {
      return this.allQuotations.filter(q => q.status === 'rejected').length
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-MY', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },
    truncateText(text, length) {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    },
    openQuoteModal(quotation) {
      this.selectedQuotation = quotation
      this.showQuoteModal = true
      // Pre-fill with estimated price
      const estimatedPrice = quotation.numberOfGuests * 25 // Example calculation
      this.quoteForm.price = estimatedPrice
      this.quoteForm.message = `Dear ${quotation.customerName},\n\nThank you for your inquiry. We are pleased to offer our ${quotation.packageName} package for your event.\n\nIncludes:\n- Full buffet setup\n- Service staff\n- Clean up\n\nLooking forward to serving you.`
    },
    closeQuoteModal() {
      this.showQuoteModal = false
      this.selectedQuotation = null
      this.quoteForm = { price: null, message: '', notes: '' }
    },
    async sendQuotation() {
      try {
        await this.quotationsStore.updateQuotationStatus(
          this.selectedQuotation._id || this.selectedQuotation.id,
          'quoted',
          this.quoteForm.message,
          this.quoteForm.price
        )
        // Store notes if separate API field exists, otherwise append or ignore
        
        // No alert needed, UI update is enough usually, but let's keep it clean
        this.closeQuoteModal()
      } catch (error) {
        console.error(error)
        alert('Failed to send quotation. Please try again.')
      }
    },
    viewQuotation(quotation) {
      this.selectedQuotation = quotation
      this.showDetailsModal = true
    },
    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedQuotation = null
    }
  },
  mounted() {
    this.quotationsStore.loadFromStorage()
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
  margin-left: 260px;
  padding: 32px;
  width: calc(100% - 260px);
}

/* Hero */
.dashboard-hero {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
}

.hero-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent 70%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-text h2 {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.hero-text p {
  color: #64748b;
  font-size: 16px;
}

.stats-summary {
  display: flex;
  gap: 16px;
}

.stat-pill {
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  border-radius: 12px;
  min-width: 100px;
  text-align: center;
}

.stat-pill.blue { background: #eff6ff; border: 1px solid #dbeafe; }
.stat-pill.yellow { background: #fefce8; border: 1px solid #fef9c3; }

.stat-pill .label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
}

.stat-pill .value {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
}

/* Filters */
.dashboard-section { margin-bottom: 24px; }

.filters-bar {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.filter-btn {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.filter-btn.active {
  background: #0f172a;
  color: white;
  border-color: #0f172a;
}

.badge-count {
  background: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
}

.filter-btn:not(.active) .badge-count {
  background: #e2e8f0;
  color: #475569;
}

/* Table */
.recent-orders-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  overflow: hidden;
}

.table-responsive { overflow-x: auto; }

table { width: 100%; border-collapse: collapse; }

th {
  text-align: left;
  padding: 16px 24px;
  background: #f8fafc;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}

td {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 14px;
  vertical-align: middle;
}

.order-id {
  font-family: monospace;
  font-weight: 600;
  color: #3b82f6;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-placeholder {
  width: 36px;
  height: 36px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #64748b;
}

.customer-name {
  font-weight: 600;
  color: #0f172a;
}

.customer-contact {
  font-size: 12px;
  color: #64748b;
}

.event-info div {
  font-size: 13px;
  color: #475569;
  margin-bottom: 2px;
}

.status-badge {
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.pending { background: #fffbeb; color: #b45309; }
.status-badge.quoted { background: #eff6ff; color: #1d4ed8; }
.status-badge.accepted { background: #f0fdf4; color: #15803d; }
.status-badge.rejected { background: #fef2f2; color: #b91c1c; }

.btn-primary-action, .btn-submit {
  background: #0f172a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-view-details, .btn-close {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  cursor: pointer;
}

.btn-view-details:hover {
  background: #f8fafc;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.empty-icon { font-size: 40px; margin-bottom: 10px; }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  width: 90%;
  max-width: 800px;
  height: 85vh;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.order-date { font-size: 13px; color: #64748b; }

.modal-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px;
}

.modal-content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f8fafc;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.info-card, .form-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.info-card h4, .form-card h4, .notes-section h4 {
  font-size: 14px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 16px;
  letter-spacing: 0.05em;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-row .label { color: #64748b; }
.info-row .value { color: #0f172a; font-weight: 500; text-align: right; }

.divider { height: 1px; background: #f1f5f9; margin: 12px 0; }

.notes-box {
  background: #fefce8;
  border: 1px solid #fef9c3;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #854d0e;
  margin-top: 16px;
}

/* Forms */
.form-group { margin-bottom: 20px; }

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  font-family: inherit;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-prefix {
  position: absolute;
  left: 12px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.input-wrapper input { padding-left: 40px; }

.modal-footer {
  padding: 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Quote Results */
.quote-result-box {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  border: 1px solid #e2e8f0;
}

.quote-price-large {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
}

.quote-date { font-size: 12px; color: #64748b; }
.quote-message { font-size: 14px; color: #475569; line-height: 1.5; font-style: italic; }

.notes-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .admin-content { margin-left: 0; width: 100%; padding: 16px; padding-bottom: 80px; }
  .modal-grid { grid-template-columns: 1fr; }
  .modal-card { width: 100%; height: 100%; border-radius: 0; }
  th, td { padding: 12px 16px; }
  .customer-info { flex-direction: column; align-items: flex-start; gap: 4px; }
  .avatar-placeholder { display: none; }
}
</style>