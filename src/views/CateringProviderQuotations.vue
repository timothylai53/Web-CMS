<template>
  <div class="admin-container">
    <Navbar />
    
    <div class="admin-content">
      <template v-if="!isQuoteEditor">
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
                  <th>Quoted Amount</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredQuotations.length === 0">
                  <td colspan="8" class="empty-cell">
                    <div class="empty-state">
                      <div class="empty-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"></path></svg>
                      </div>
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
                        <div class="customer-contact">{{ getCustomerEmail(quotation) }}</div>
                        <div class="customer-contact">{{ getCustomerPhone(quotation) }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="event-info-cell">
                    <div class="event-info">
                      <div class="event-row event-date">
                        <svg class="event-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span class="event-text">{{ formatDate(quotation.eventDate) }}</span>
                      </div>
                      <div class="event-row event-guests">
                        <svg class="event-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span class="event-text">{{ quotation.numberOfGuests }} Guests</span>
                      </div>
                      <div class="event-row event-guests">
                        <svg class="event-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"></path><path d="m18 20-6-6-6 6"></path><path d="M12 4v2"></path></svg>
                        <span class="event-text">{{ quotation.eventType || 'General Event' }}</span>
                      </div>
                      <div class="event-row event-location">
                        <svg class="event-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span class="event-text">{{ getEventLocation(quotation) }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="package-name">{{ getPackageName(quotation) }}</td>
                  <td>
                    <span v-if="quotation.quotedAmount !== null && quotation.quotedAmount !== undefined" class="quote-amount-cell">RM {{ Number(quotation.quotedAmount).toFixed(2) }}</span>
                    <span v-else class="quote-amount-cell pending">Not quoted</span>
                  </td>
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
                      Send Quote
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

      </template>

      <div v-else class="quote-editor-page">
        <div class="quote-editor-header">
          <button class="btn-back" @click="closeQuoteModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Manage Quotations
          </button>
          <div class="quote-editor-title">
            <h3>Publish Quotation</h3>
            <p v-if="selectedQuotation" class="order-date">For Request #{{ (selectedQuotation.quotationNumber || selectedQuotation._id || '').slice(-6).toUpperCase() }}</p>
          </div>
        </div>

        <div class="quote-editor-content">
          <div class="modal-grid">
            <div class="info-card">
              <h4>Request Summary</h4>
              <div class="info-row">
                <span class="label">Customer</span>
                <span class="value">{{ selectedQuotation.customerName }}</span>
              </div>
              <div class="info-row">
                <span class="label">Email</span>
                <span class="value">{{ getCustomerEmail(selectedQuotation) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Phone</span>
                <span class="value">{{ getCustomerPhone(selectedQuotation) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Event Date</span>
                <span class="value">{{ formatDate(selectedQuotation.eventDate) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Event Time</span>
                <span class="value">{{ selectedQuotation.eventTime || 'Not specified' }}</span>
              </div>
              <div class="info-row">
                <span class="label">Guests</span>
                <span class="value">{{ selectedQuotation.numberOfGuests }} Pax</span>
              </div>
              <div class="info-row">
                <span class="label">Package</span>
                <span class="value">{{ getPackageName(selectedQuotation) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Location</span>
                <span class="value">{{ getEventLocation(selectedQuotation) }}</span>
              </div>
              <div class="info-row">
                <span class="label">Selected Items</span>
                <span class="value">{{ getSelectedItemsCount(selectedQuotation) }} selections</span>
              </div>

              <div class="requirements-clean-block">
                <h4>Requirements (Grouped)</h4>
                <div v-if="getCategorizedRequirements(selectedQuotation).length === 0" class="requirements-empty">
                  No special requirements submitted.
                </div>
                <div v-else class="requirements-grouped">
                  <div
                    v-for="(group, groupIndex) in getCategorizedRequirements(selectedQuotation)"
                    :key="`${selectedQuotation._id || 'quotation'}-group-${groupIndex}`"
                    class="req-category"
                  >
                    <div class="req-cat-title">{{ group.name }}</div>
                    <p v-if="isSingleLineRequirementCategory(group.name)" class="req-single-line">
                      {{ getSingleLineRequirement(group) }}
                    </p>
                    <ol v-else-if="shouldUseNumberedRequirements(group.name)" class="req-list numbered">
                      <li v-for="(item, itemIndex) in group.items" :key="`${selectedQuotation._id || 'quotation'}-group-${groupIndex}-item-${itemIndex}`">
                        {{ item }}
                      </li>
                    </ol>
                    <ul v-else class="req-list normal">
                      <li v-for="(item, itemIndex) in group.items" :key="`${selectedQuotation._id || 'quotation'}-group-${groupIndex}-item-${itemIndex}`">
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-card">
              <h4>Your Offer</h4>
              <div class="price-guidance-box">
                <div class="guidance-row">
                  <span>Package Reference</span>
                  <strong>{{ getPackagePriceReference(selectedQuotation) }}</strong>
                </div>
                <div class="guidance-row">
                  <span>Per Pax (Reference)</span>
                  <strong>RM {{ getPerPaxReference(selectedQuotation).toFixed(2) }}</strong>
                </div>
              </div>
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
                  <label>Quotation Message to Customer *</label>
                  <textarea
                    v-model="quoteForm.message"
                    rows="4"
                    required
                    class="form-textarea"
                    placeholder="Describe your offer, menus included, and terms..."
                  ></textarea>
                </div>

                <div class="form-group">
                  <label>Additional Items / Quantity Changes (Customer Visible)</label>
                  <div class="additional-items-wrapper">
                    <div class="additional-items-header-row">
                      <span>Item Name</span>
                      <span>Category</span>
                      <span>Quantity</span>
                      <span>Total (RM)</span>
                      <span>Action</span>
                    </div>

                    <div
                      v-for="(item, index) in quoteForm.additionalItems"
                      :key="`additional-item-${index}`"
                      class="additional-item-row"
                    >
                      <input
                        v-model="item.name"
                        type="text"
                        class="form-input"
                        placeholder="e.g. Extra Waiter"
                      >
                      <input
                        v-model="item.category"
                        type="text"
                        class="form-input"
                        placeholder="e.g. Service / Main Dish"
                      >
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        class="form-input"
                        placeholder="1"
                      >
                      <input
                        v-model.number="item.total"
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-input"
                        placeholder="0.00"
                      >
                      <button type="button" class="btn-remove-item" @click="removeAdditionalItem(index)">Remove</button>
                    </div>

                    <div class="additional-items-actions">
                      <button type="button" class="btn-add-item" @click="addAdditionalItem">+ Add Item</button>
                      <div class="additional-items-total">Additional Items Total: <strong>RM {{ additionalItemsTotal.toFixed(2) }}</strong></div>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label>Validity (Days) *</label>
                  <input
                    type="number"
                    v-model.number="quoteForm.validUntilDays"
                    min="1"
                    class="form-input"
                    required
                  >
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

                <div class="quote-preview-box">
                  <div class="preview-row"><span>Quoted Total</span><strong>RM {{ Number(quoteForm.price || 0).toFixed(2) }}</strong></div>
                  <div class="preview-row"><span>Per Pax</span><strong>RM {{ quotedPerPax.toFixed(2) }}</strong></div>
                  <div class="preview-row"><span>Valid Until</span><strong>{{ quoteValidUntilDate }}</strong></div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="quote-editor-footer">
          <button @click="closeQuoteModal" class="btn-close">Back</button>
          <button type="button" @click="previewQuotationPdf" class="btn-preview">Preview PDF</button>
          <button type="submit" form="quoteForm" class="btn-submit">Submit Quotation</button>
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
                  <span class="value">{{ getCustomerPhone(selectedQuotation) }}</span>
                </div>
                 <div class="info-row">
                  <span class="label">Email</span>
                  <span class="value">{{ getCustomerEmail(selectedQuotation) }}</span>
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
                  <span class="label">Type</span>
                  <span class="value">{{ selectedQuotation.eventType || 'General Event' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Location</span>
                  <span class="value">{{ getEventLocation(selectedQuotation) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Package</span>
                  <span class="value">{{ getPackageName(selectedQuotation) }}</span>
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
                  <div class="quote-price-large">RM {{ Number(selectedQuotation.quotedAmount || 0).toFixed(2) }}</div>
                  <div class="quote-date">Quoted on {{ formatDate(selectedQuotation.updatedAt) }}</div>
                  <div class="quote-date">Per Pax RM {{ getQuotedPerPax(selectedQuotation).toFixed(2) }}</div>
                  <div class="divider"></div>
                  <p class="quote-message">{{ selectedQuotation.adminNotes || 'No additional message from provider.' }}</p>
                </div>
              </div>
            </div>
            
            <div class="notes-section">
              <h4>Special Requirements (Grouped)</h4>
              <div v-if="getCategorizedRequirements(selectedQuotation).length === 0" class="requirements-empty">
                No special requirements submitted.
              </div>
              <div v-else class="requirements-grouped">
                <div
                  v-for="(group, groupIndex) in getCategorizedRequirements(selectedQuotation)"
                  :key="`${selectedQuotation._id || 'quotation'}-details-group-${groupIndex}`"
                  class="req-category"
                >
                  <div class="req-cat-title">{{ group.name }}</div>
                  <p v-if="isSingleLineRequirementCategory(group.name)" class="req-single-line">
                    {{ getSingleLineRequirement(group) }}
                  </p>
                  <ol v-else-if="shouldUseNumberedRequirements(group.name)" class="req-list numbered">
                    <li v-for="(item, itemIndex) in group.items" :key="`${selectedQuotation._id || 'quotation'}-details-group-${groupIndex}-item-${itemIndex}`">
                      {{ item }}
                    </li>
                  </ol>
                  <ul v-else class="req-list normal">
                    <li v-for="(item, itemIndex) in group.items" :key="`${selectedQuotation._id || 'quotation'}-details-group-${groupIndex}-item-${itemIndex}`">
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
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
import { useAuthStore } from '@/stores/auth'
import { quotationAPI } from '@/services/api'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  data() {
    return {
      filterStatus: 'all',
      isQuoteEditor: false,
      showDetailsModal: false,
      selectedQuotation: null,
      quoteForm: {
        price: null,
        message: '',
        additionalItems: [
          {
            name: '',
            category: '',
            quantity: 1,
            total: 0
          }
        ],
        notes: '',
        validUntilDays: 7
      }
    }
  },
  computed: {
    quotationsStore() {
      return useQuotationsStore()
    },
    authStore() {
      return useAuthStore()
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
    },
    quotedPerPax() {
      const guests = Number(this.selectedQuotation?.numberOfGuests || 0)
      if (!guests) return 0
      return Number(this.quoteForm.price || 0) / guests
    },
    quoteValidUntilDate() {
      const days = Math.max(1, Number(this.quoteForm.validUntilDays) || 1)
      const date = new Date()
      date.setDate(date.getDate() + days)
      return date.toLocaleDateString('en-MY', { month: 'short', day: 'numeric', year: 'numeric' })
    },
    additionalItemsTotal() {
      if (!Array.isArray(this.quoteForm.additionalItems)) return 0
      return this.quoteForm.additionalItems.reduce((sum, item) => {
        return sum + (Number(item?.total) || 0)
      }, 0)
    }
  },
  methods: {
    createEmptyAdditionalItem() {
      return {
        name: '',
        category: '',
        quantity: 1,
        total: 0
      }
    },
    addAdditionalItem() {
      this.quoteForm.additionalItems.push(this.createEmptyAdditionalItem())
    },
    removeAdditionalItem(index) {
      this.quoteForm.additionalItems.splice(index, 1)
      if (!this.quoteForm.additionalItems.length) {
        this.quoteForm.additionalItems.push(this.createEmptyAdditionalItem())
      }
    },
    getNormalizedAdditionalItems() {
      const rows = Array.isArray(this.quoteForm.additionalItems) ? this.quoteForm.additionalItems : []
      return rows
        .map(row => ({
          name: String(row?.name || '').trim(),
          category: String(row?.category || '').trim(),
          quantity: Math.max(1, Number(row?.quantity) || 1),
          total: Math.max(0, Number(row?.total) || 0)
        }))
        .filter(row => row.name)
    },
    getAdditionalItemsTextForMessage() {
      const items = this.getNormalizedAdditionalItems()
      if (!items.length) return ''
      return items
        .map((item, idx) => `${idx + 1}. ${item.name} | Category: ${item.category || '-'} | Qty: ${item.quantity} | Total: RM ${item.total.toFixed(2)}`)
        .join('\n')
    },
    getAdditionalItemsTextForPdf() {
      const items = this.getNormalizedAdditionalItems()
      if (!items.length) return 'No additional adjustments.'
      const lines = items.map((item, idx) => `${idx + 1}. ${item.name} (Category: ${item.category || '-'})  Qty: ${item.quantity}  Total: RM ${item.total.toFixed(2)}`)
      lines.push(`Total Additional Items: RM ${items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}`)
      return lines.join('\n')
    },
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
    getCustomerEmail(quotation) {
      return quotation?.contactEmail || quotation?.email || quotation?.userId?.email || 'No Email'
    },
    getCustomerPhone(quotation) {
      return quotation?.contactPhone || quotation?.phoneNumber || 'No Phone'
    },
    getEventLocation(quotation) {
      return quotation?.eventLocation || quotation?.location || 'Not specified'
    },
    getPackageName(quotation) {
      return quotation?.packageName || quotation?.packageId?.name || 'Custom Package'
    },
    getSpecialRequirements(quotation) {
      return quotation?.specialRequirements || quotation?.additionalRequests || ''
    },
    getCategorizedRequirements(quotation) {
      const rawText = String(quotation?.additionalRequests || quotation?.specialRequirements || '').trim()
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
    getSelectedItemsCount(quotation) {
      const foods = Array.isArray(quotation?.selectedFoods) ? quotation.selectedFoods.length : 0
      const drinks = Array.isArray(quotation?.selectedDrinks) ? quotation.selectedDrinks.length : 0
      const cakes = Array.isArray(quotation?.selectedCakes) ? quotation.selectedCakes.length : 0
      return foods + drinks + cakes
    },
    getPackagePriceReference(quotation) {
      const packagePrice = Number(quotation?.packageId?.price)
      const guests = Number(quotation?.numberOfGuests || 0)
      if (!packagePrice || !guests) return 'Not available'
      return `RM ${(packagePrice * guests).toFixed(2)}`
    },
    getPerPaxReference(quotation) {
      const packagePrice = Number(quotation?.packageId?.price)
      if (!packagePrice) return 0
      return packagePrice
    },
    getQuotedPerPax(quotation) {
      const quoted = Number(quotation?.quotedAmount || 0)
      const guests = Number(quotation?.numberOfGuests || 0)
      if (!quoted || !guests) return 0
      return quoted / guests
    },
    openQuoteModal(quotation) {
      this.selectedQuotation = quotation
      this.isQuoteEditor = true
      // Pre-fill with estimated price
      const basePerPax = Number(quotation?.packageId?.price || 25)
      const estimatedPrice = quotation.numberOfGuests * basePerPax
      this.quoteForm.price = estimatedPrice
      this.quoteForm.validUntilDays = 7
      this.quoteForm.additionalItems = [this.createEmptyAdditionalItem()]
      this.quoteForm.message = `Dear ${quotation.customerName},\n\nThank you for your inquiry. We are pleased to offer our ${this.getPackageName(quotation)} package for your event.\n\nThis quote includes menu preparation, event service coordination, and cleanup support.\n\nPlease review and confirm before the validity date.`
      this.quoteForm.notes = ''
    },
    closeQuoteModal() {
      this.isQuoteEditor = false
      this.selectedQuotation = null
      this.quoteForm = {
        price: null,
        message: '',
        additionalItems: [this.createEmptyAdditionalItem()],
        notes: '',
        validUntilDays: 7
      }
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
    getCustomerRequirementsText(quotation) {
      const groups = this.getCategorizedRequirements(quotation)
      if (!groups.length) {
        return 'No special requirements submitted.'
      }
      return groups
        .map(group => {
          const items = Array.isArray(group.items) ? group.items : []
          if (!items.length) return `${group.name}: -`
          return `${group.name}:\n${items.map(item => `• ${item}`).join('\n')}`
        })
        .join('\n\n')
    },
    buildQuotationPdfFileName(quotation) {
      const quoteId = quotation?.quotationId || (quotation?._id || 'quote').slice(-6)
      const customer = String(quotation?.customerName || 'customer').replace(/[^a-zA-Z0-9]+/g, '-')
      return `quotation-${quoteId}-${customer}.pdf`
    },
    async uploadQuotationPdfFile(pdfBlob, fileName) {
      const formData = new FormData()
      const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' })
      formData.append('pdf', pdfFile)
      const response = await quotationAPI.uploadQuotationPdf(formData)
      return {
        quotationPdfUrl: response?.data?.pdfPath || null,
        quotationPdfName: response?.data?.fileName || fileName
      }
    },
    async generateQuotationPdf(quotation, validUntilText) {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 14
      const contentWidth = pageWidth - (margin * 2)
      let y = 0

      const provider = this.authStore?.user || {}
      const providerName = provider.businessName || provider.fullName || 'Catering Provider'
      const providerPhone = provider.phone || '-'
      const providerEmail = provider.email || '-'
      const providerAddress = provider.address || '-'
      const quoteCode = (quotation?.quotationNumber || quotation?._id || '-').toString().slice(-8).toUpperCase()
      const todayText = new Date().toLocaleDateString('en-MY', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
      const guestsCount = Math.max(0, Number(quotation?.numberOfGuests) || 0)
      const quotedTotal = Math.max(0, Number(this.quoteForm.price) || 0)
      const additionalItems = this.getNormalizedAdditionalItems()
      const additionalTotal = additionalItems.reduce((sum, item) => sum + item.total, 0)
      const basePackageTotal = Math.max(0, quotedTotal - additionalTotal)
      const basePerPax = guestsCount > 0 ? (basePackageTotal / guestsCount) : basePackageTotal

      const formatCurrency = (value) => `RM ${Number(value || 0).toFixed(2)}`

      const drawHeader = (firstPage = false) => {
        doc.setFillColor(30, 58, 138)
        doc.rect(0, 0, pageWidth, 28, 'F')

        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(14)
        doc.text(providerName, margin, 11)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        const contactLine = `${providerPhone}  |  ${providerEmail}`
        const providerAddressLine = String(providerAddress || '-').replace(/\r?\n/g, ', ')
        doc.text(doc.splitTextToSize(contactLine, contentWidth * 0.52), margin, 17)
        doc.text(doc.splitTextToSize(providerAddressLine, contentWidth * 0.52), margin, 22)

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(19)
        doc.text('QUOTATION', pageWidth - margin, 12, { align: 'right' })

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        const subtitle = firstPage ? `Ref: ${quoteCode}` : `Quote Ref: ${quoteCode}`
        doc.text(subtitle, pageWidth - margin, 18, { align: 'right' })

        doc.setTextColor(0, 0, 0)
        return 34
      }

      const drawSectionTitle = (title, topY) => {
        doc.setFillColor(241, 245, 249)
        doc.rect(margin, topY, contentWidth, 7, 'F')
        doc.setDrawColor(203, 213, 225)
        doc.rect(margin, topY, contentWidth, 7)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.text(title, margin + 3, topY + 4.8)
      }

      const ensureSpace = (requiredHeight) => {
        if (y + requiredHeight > pageHeight - 16) {
          doc.addPage()
          y = drawHeader(false)
        }
      }

      const renderParagraphBlock = (title, text, minHeight = 24) => {
        const blockText = String(text || '-').trim() || '-'
        ensureSpace(minHeight + 12)
        drawSectionTitle(title, y)
        y += 9

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9.5)
        const wrapped = doc.splitTextToSize(blockText, contentWidth - 6)
        const textHeight = Math.max(minHeight, wrapped.length * 4.8)

        doc.setDrawColor(203, 213, 225)
        doc.rect(margin, y - 2, contentWidth, textHeight + 4)
        doc.text(wrapped, margin + 3, y + 2)
        y += textHeight + 6
      }

      y = drawHeader(true)

      autoTable(doc, {
        startY: y,
        theme: 'grid',
        margin: { left: margin, right: margin },
        head: [['Quotation Info', 'Details']],
        body: [
          ['Quotation Ref', quoteCode],
          ['Issue Date', todayText],
          ['Valid Until', validUntilText],
          ['Event Date', this.formatDate(quotation?.eventDate)],
          ['Guests', guestsCount > 0 ? `${guestsCount} Pax` : '-'],
          ['Package', this.getPackageName(quotation)]
        ],
        headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 9.5 },
        bodyStyles: { fontSize: 9, cellPadding: 2.6 },
        columnStyles: {
          0: { cellWidth: 45, fontStyle: 'bold' },
          1: { cellWidth: contentWidth - 45 }
        }
      })
      y = (doc.lastAutoTable?.finalY || y) + 6

      const providerBlock = [
        providerName,
        `Phone: ${providerPhone}`,
        `Email: ${providerEmail}`,
        `Address: ${String(providerAddress || '-').replace(/\r?\n/g, ', ')}`
      ].join('\n')

      const customerBlock = [
        `${quotation?.customerName || '-'}`,
        `Email: ${this.getCustomerEmail(quotation)}`,
        `Phone: ${this.getCustomerPhone(quotation)}`,
        `Location: ${this.getEventLocation(quotation)}`,
        `Event Time: ${quotation?.eventTime || 'Not specified'}`
      ].join('\n')

      autoTable(doc, {
        startY: y,
        theme: 'grid',
        margin: { left: margin, right: margin },
        head: [['Provider Details', 'Customer & Event Details']],
        body: [[providerBlock, customerBlock]],
        headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: 'bold', fontSize: 9.5 },
        bodyStyles: { fontSize: 9, cellPadding: 3, valign: 'top', lineColor: [203, 213, 225] },
        columnStyles: {
          0: { cellWidth: contentWidth / 2 },
          1: { cellWidth: contentWidth / 2 }
        }
      })
      y = (doc.lastAutoTable?.finalY || y) + 6

      const requirementsGroups = this.getCategorizedRequirements(quotation)
      const requirementsRows = requirementsGroups.length
        ? requirementsGroups.map((group) => {
          const items = Array.isArray(group?.items) ? group.items : []
          const details = items.length
            ? items.map((item, index) => `${index + 1}. ${item}`).join('\n')
            : '-'
          return [group.name, details]
        })
        : [['General', 'No special requirements submitted.']]

      autoTable(doc, {
        startY: y,
        theme: 'grid',
        margin: { left: margin, right: margin },
        head: [['Customer Requirements', 'Details']],
        body: requirementsRows,
        headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: 'bold', fontSize: 9.5 },
        bodyStyles: { fontSize: 8.8, cellPadding: 2.4, valign: 'top' },
        columnStyles: {
          0: { cellWidth: 48, fontStyle: 'bold' },
          1: { cellWidth: contentWidth - 48 }
        }
      })
      y = (doc.lastAutoTable?.finalY || y) + 6

      const itemRows = [
        [
          `Catering Package - ${this.getPackageName(quotation)}`,
          formatCurrency(basePerPax),
          guestsCount > 0 ? String(guestsCount) : '-',
          formatCurrency(basePackageTotal)
        ]
      ]

      additionalItems.forEach((item) => {
        const qty = Math.max(1, Number(item.quantity) || 1)
        const unitPrice = item.total / qty
        itemRows.push([
          item.name,
          formatCurrency(unitPrice),
          String(qty),
          formatCurrency(item.total)
        ])
      })

      autoTable(doc, {
        startY: y,
        theme: 'grid',
        margin: { left: margin, right: margin },
        head: [['Description', 'Unit Price', 'Qty', 'Amount']],
        body: itemRows,
        headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 9.5 },
        bodyStyles: { fontSize: 8.9, cellPadding: 2.4, valign: 'top' },
        columnStyles: {
          0: { cellWidth: contentWidth * 0.52 },
          1: { cellWidth: contentWidth * 0.16, halign: 'right' },
          2: { cellWidth: contentWidth * 0.12, halign: 'center' },
          3: { cellWidth: contentWidth * 0.20, halign: 'right', fontStyle: 'bold' }
        }
      })
      y = (doc.lastAutoTable?.finalY || y) + 6

      autoTable(doc, {
        startY: y,
        theme: 'grid',
        margin: { left: margin + (contentWidth * 0.42), right: margin },
        body: [
          ['Package Subtotal', formatCurrency(basePackageTotal)],
          ['Additional Items', formatCurrency(additionalTotal)],
          ['Total Quoted Amount', formatCurrency(quotedTotal)],
          ['Quoted Price Per Pax', formatCurrency(this.quotedPerPax)],
          ['Valid Until', validUntilText]
        ],
        bodyStyles: { fontSize: 9.1, cellPadding: 2.4 },
        columnStyles: {
          0: { cellWidth: contentWidth * 0.34, fontStyle: 'bold' },
          1: { cellWidth: contentWidth * 0.24, halign: 'right' }
        },
        didParseCell: (data) => {
          if (data.row.index === 2) {
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.fillColor = [239, 246, 255]
          }
        }
      })
      y = (doc.lastAutoTable?.finalY || y) + 6

      renderParagraphBlock('Message to Customer', this.quoteForm.message, 24)

      if (this.quoteForm.notes) {
        renderParagraphBlock('Internal Notes', this.quoteForm.notes, 16)
      }

      ensureSpace(22)
      drawSectionTitle('Terms & Notes', y)
      y += 9
      doc.setDrawColor(203, 213, 225)
      doc.rect(margin, y - 2, contentWidth, 18)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      const terms = [
        '1. This quotation remains valid until the stated validity date.',
        '2. Final booking is confirmed upon customer acceptance and payment terms.',
        '3. Additional changes requested after acceptance may affect final pricing.'
      ]
      doc.text(terms, margin + 3, y + 2.5)

      const footerY = pageHeight - 10
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(8.5)
      doc.setTextColor(71, 85, 105)
      doc.text('Generated by Catering Management System', margin, footerY)
      doc.text(`Page 1 of ${doc.getNumberOfPages()}`, pageWidth - margin, footerY, { align: 'right' })
      doc.setTextColor(0, 0, 0)

      const totalPages = doc.getNumberOfPages()
      for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page)
        const pageFooterY = pageHeight - 10
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(8.5)
        doc.setTextColor(71, 85, 105)
        doc.text('Generated by Catering Management System', margin, pageFooterY)
        doc.text(`Page ${page} of ${totalPages}`, pageWidth - margin, pageFooterY, { align: 'right' })
      }
      doc.setTextColor(0, 0, 0)

      return doc.output('blob')
    },
    async sendQuotation() {
      const normalizedPrice = Number(this.quoteForm.price)
      if (!normalizedPrice || normalizedPrice <= 0) {
        alert('Please enter a valid quotation amount greater than RM 0.')
        return
      }
      if (!this.quoteForm.message || this.quoteForm.message.trim().length < 20) {
        alert('Please provide a more detailed quotation message (at least 20 characters).')
        return
      }

      const validityDays = Math.max(1, Number(this.quoteForm.validUntilDays) || 1)
      const validUntil = new Date()
      validUntil.setDate(validUntil.getDate() + validityDays)
      const validUntilText = validUntil.toLocaleDateString('en-MY', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })

      const internalNotes = this.quoteForm.notes ? `\n\n[Internal Notes]\n${this.quoteForm.notes}` : ''
      const additionalItemsText = this.getAdditionalItemsTextForMessage()
      const adjustmentsText = additionalItemsText
        ? `\n\n[Additional Items / Quantity Changes]\n${additionalItemsText}`
        : ''

      const finalMessage = `${this.quoteForm.message}${adjustmentsText}\n\nQuote Valid Until: ${validUntilText}${internalNotes}`

      try {
        const pdfBlob = await this.generateQuotationPdf(this.selectedQuotation, validUntilText)
        const generatedPdfName = this.buildQuotationPdfFileName(this.selectedQuotation)
        const uploadedPdf = await this.uploadQuotationPdfFile(pdfBlob, generatedPdfName)

        await this.quotationsStore.updateQuotationStatus(
          this.selectedQuotation._id || this.selectedQuotation.id,
          'quoted',
          finalMessage,
          normalizedPrice
        )

        await this.quotationsStore.updateQuotation(
          this.selectedQuotation._id || this.selectedQuotation.id,
          {
            quotationPdfUrl: uploadedPdf.quotationPdfUrl,
            quotationPdfName: uploadedPdf.quotationPdfName
          }
        )
        // Store notes if separate API field exists, otherwise append or ignore
        
        // No alert needed, UI update is enough usually, but let's keep it clean
        this.closeQuoteModal()
      } catch (error) {
        console.error(error)
        alert('Failed to send quotation. Please try again.')
      }
    },
    async previewQuotationPdf() {
      if (!this.selectedQuotation) {
        alert('No quotation selected to preview.')
        return
      }

      const validityDays = Math.max(1, Number(this.quoteForm.validUntilDays) || 1)
      const validUntil = new Date()
      validUntil.setDate(validUntil.getDate() + validityDays)
      const validUntilText = validUntil.toLocaleDateString('en-MY', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })

      try {
        const pdfBlob = await this.generateQuotationPdf(this.selectedQuotation, validUntilText)
        const previewUrl = URL.createObjectURL(pdfBlob)
        window.open(previewUrl, '_blank', 'noopener,noreferrer')
        setTimeout(() => URL.revokeObjectURL(previewUrl), 30000)
      } catch (error) {
        console.error(error)
        alert('Failed to generate preview PDF. Please try again.')
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

.event-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event-info-cell {
  min-width: 230px;
}

.event-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.event-text {
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  line-height: 1.35;
}

.event-icon {
  color: #64748b;
  flex-shrink: 0;
  margin-top: 2px;
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

.quote-amount-cell {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.quote-amount-cell.pending {
  color: #64748b;
  font-weight: 500;
}

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

.btn-preview {
  background: #1d4ed8;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-preview:hover {
  background: #1e40af;
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

.empty-icon {
  margin-bottom: 10px;
  color: #94a3b8;
  display: flex;
  justify-content: center;
}

.quote-editor-page {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  overflow: hidden;
}

.quote-editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.quote-editor-title h3 {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.quote-editor-content {
  padding: 24px;
  background: #f8fafc;
}

.quote-editor-footer {
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-back {
  background: white;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-back:hover {
  background: #f1f5f9;
}

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

.requirements-clean-block {
  margin-top: 16px;
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
  text-transform: uppercase;
  letter-spacing: 0.03em;
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

.price-guidance-box {
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 14px;
}

.guidance-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #1e3a8a;
  margin-bottom: 6px;
}

.guidance-row:last-child {
  margin-bottom: 0;
}

.quote-preview-box {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  padding: 12px;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #334155;
  margin-bottom: 6px;
}

.preview-row:last-child {
  margin-bottom: 0;
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

.additional-items-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  padding: 12px;
}

.additional-items-header-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 0.9fr 1fr 0.8fr;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.additional-item-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 0.9fr 1fr 0.8fr;
  gap: 8px;
  margin-bottom: 8px;
}

.additional-items-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.btn-add-item {
  border: 1px solid #0f172a;
  background: white;
  color: #0f172a;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-add-item:hover {
  background: #f1f5f9;
}

.btn-remove-item {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-remove-item:hover {
  background: #fee2e2;
}

.additional-items-total {
  font-size: 13px;
  color: #334155;
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
  .quote-editor-header { flex-direction: column; align-items: flex-start; }
  .quote-editor-content { padding: 16px; }
  .quote-editor-footer { padding: 16px; }
  .additional-items-header-row { display: none; }
  .additional-item-row {
    grid-template-columns: 1fr;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px;
  }
  .additional-items-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  th, td { padding: 12px 16px; }
  .customer-info { flex-direction: column; align-items: flex-start; gap: 4px; }
  .avatar-placeholder { display: none; }
}
</style>