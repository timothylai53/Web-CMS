<template>
  <div class="admin-container">
    <Navbar />
    
    <div class="main-content">
      <header class="page-header">
        <div class="header-content">
          <h1>Provider Applications</h1>
          <p>Review credentials and manage catering verification status.</p>
        </div>
      </header>

      <!-- Tabs -->
      <div class="tabs-container">
        <div class="tabs-list">
          <button 
            :class="['tab-btn', { active: activeTab === 'pending' }]" 
            @click="activeTab = 'pending'"
          >
            Pending Review
            <span class="count-badge" v-if="pendingProviders.length">{{ pendingProviders.length }}</span>
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'approved' }]" 
            @click="activeTab = 'approved'"
          >
            Approved
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'rejected' }]" 
            @click="activeTab = 'rejected'"
          >
            Rejected
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="applications-container">
        <!-- Pending State -->
        <div v-if="activeTab === 'pending'">
          <div v-if="pendingProviders.length === 0" class="empty-state">
            <div class="empty-icon">✅</div>
            <h3>All Caught Up</h3>
            <p>There are no pending applications to review at the moment.</p>
          </div>
          
          <div v-else class="cards-grid">
            <div v-for="provider in pendingProviders" :key="provider._id" class="provider-card">
              <div class="card-header">
                <div class="provider-identity">
                  <div class="avatar">{{ (provider.businessName || provider.username || 'U').charAt(0).toUpperCase() }}</div>
                  <div>
                    <h3>{{ provider.businessName || 'Business Name Missing' }}</h3>
                    <span class="timestamp">Applied {{ formatDate(provider.createdAt) }}</span>
                  </div>
                </div>
                <span class="status-chip pending">Pending</span>
              </div>
              
              <div class="card-body">
                <div class="info-group">
                  <label>Contact Person</label>
                  <p>{{ provider.fullName || provider.username }}</p>
                </div>
                <div class="info-group">
                  <label>Contact Details</label>
                  <p class="contact-link">{{ provider.email }}</p>
                  <p>{{ provider.phone }}</p>
                </div>
                <div class="info-group full-width">
                  <label>Business Address</label>
                  <p>{{ provider.address || 'No address provided' }}</p>
                </div>
              </div>

              <div class="documents-area">
                <label>Verified Documents</label>
                <div class="doc-tags">
                  <button v-if="provider.businessRegistration" @click="viewDocument(provider, 'businessRegistration')" class="doc-chip">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    SSM Cert
                  </button>
                  <button v-if="provider.foodLicense" @click="viewDocument(provider, 'foodLicense')" class="doc-chip">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Food License
                  </button>
                  <button v-if="provider.licenseDocument" @click="viewDocument(provider, 'licenseDocument')" class="doc-chip">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    License Doc
                  </button>
                  <span v-if="!provider.businessRegistration && !provider.foodLicense && !provider.licenseDocument" class="no-docs">No documents uploaded</span>
                </div>
              </div>

              <div class="card-actions">
                <button @click="showRejectModal(provider)" class="btn-reject">Reject</button>
                <button @click="approveProvider(provider)" class="btn-approve">Approve Application</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Approved State -->
        <div v-if="activeTab === 'approved'">
          <div class="cards-grid">
            <div v-for="provider in approvedProviders" :key="provider._id" class="provider-card">
              <div class="card-header">
                <div class="provider-identity">
                  <div class="avatar approved">✓</div>
                  <div>
                    <h3>{{ provider.businessName }}</h3>
                    <span class="timestamp">Approved User</span>
                  </div>
                </div>
                <span class="status-chip approved">Active</span>
              </div>
              <div class="card-body">
                <div class="info-group">
                  <label>Email</label>
                  <p>{{ provider.email }}</p>
                </div>
                 <div class="info-group">
                  <label>Phone</label>
                  <p>{{ provider.phone }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

         <!-- Rejected State -->
        <div v-if="activeTab === 'rejected'">
          <div class="cards-grid">
            <div v-for="provider in rejectedProviders" :key="provider._id" class="provider-card faded">
               <div class="card-header">
                <div class="provider-identity">
                  <div class="avatar rejected">✕</div>
                  <div>
                    <h3>{{ provider.businessName }}</h3>
                    <span class="timestamp">Rejected</span>
                  </div>
                </div>
                <span class="status-chip rejected">Denied</span>
              </div>
               <div class="card-body">
                <div class="info-group full-width">
                  <label>Reason for Rejection</label>
                  <p class="rejection-reason">{{ provider.rejectionReason || 'No reason provided' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Viewer Modal -->
    <div v-if="showLicenseModal" class="modal-overlay" @click="showLicenseModal = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>{{ currentDocumentType }}</h3>
          <button class="close-btn" @click="showLicenseModal = false">×</button>
        </div>
        <div class="document-viewer">
          <iframe v-if="currentLicense && currentLicense.includes('application/pdf')" :src="currentLicense" class="pdf-viewer"></iframe>
          <img v-else-if="currentLicense" :src="currentLicense" class="img-viewer" alt="Document">
          <p v-else class="no-preview">Document format not supported for preview</p>
        </div>
      </div>
    </div>

    <!-- Reject Reason Modal -->
    <div v-if="showReject" class="modal-overlay">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Reject Application</h3>
        </div>
        <div class="modal-body">
          <p>Please provide a reason for rejecting <strong>{{ selectedProvider?.businessName }}</strong>.</p>
          <textarea 
            v-model="rejectionReason" 
            placeholder="e.g. Invalid SSM certificate, blurry documents..."
            rows="4"
          ></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showReject = false">Cancel</button>
          <button class="btn-confirm-reject" @click="submitRejection">Confirm Rejection</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'SuperAdminProviderApproval',
  components: {
    Navbar
  },
  data() {
    return {
      activeTab: 'pending',
      pendingProviders: [],
      approvedProviders: [],
      rejectedProviders: [],
      
      // Modals
      showLicenseModal: false,
      currentLicense: '',
      currentDocumentType: '',
      
      showReject: false,
      selectedProvider: null,
      rejectionReason: ''
    }
  },
  async mounted() {
    await this.loadProviders()
  },
  methods: {
    async loadProviders() {
      try {
        const response = await api.get('/admin/providers')
        // Assume API returns array of all providers
        // Or if your API is segregated, you might need to adjust logic
        // As per previous file, it fetched all providers
        const providers = response.data

        this.pendingProviders = providers.filter(p => !p.approvalStatus || p.approvalStatus === 'pending')
        this.approvedProviders = providers.filter(p => p.approvalStatus === 'approved')
        this.rejectedProviders = providers.filter(p => p.approvalStatus === 'rejected')
      } catch (error) {
        console.error('Error loading providers:', error)
      }
    },
    async approveProvider(provider) {
      if (!confirm(`Approve ${provider.businessName}? They will gain immediate access.`)) return;

      try {
        await api.put(`/admin/providers/${provider._id}/approve`)
        // Optimistic update
        this.pendingProviders = this.pendingProviders.filter(p => p._id !== provider._id)
        this.approvedProviders.push({ ...provider, approvalStatus: 'approved' })
      } catch (error) {
        console.error('Error approving provider:', error)
        alert('Failed to approve provider')
      }
    },
    showRejectModal(provider) {
      this.selectedProvider = provider
      this.rejectionReason = ''
      this.showReject = true
    },
    async submitRejection() {
      if (!this.rejectionReason.trim()) {
        alert('Please provide a reason')
        return
      }

      try {
        await api.put(`/admin/providers/${this.selectedProvider._id}/reject`, {
          reason: this.rejectionReason
        })
        
        // Optimistic update
        const provider = this.selectedProvider
        this.pendingProviders = this.pendingProviders.filter(p => p._id !== provider._id)
        this.rejectedProviders.push({ ...provider, approvalStatus: 'rejected', rejectionReason: this.rejectionReason })
        
        this.showReject = false
      } catch (error) {
        console.error('Error rejecting provider:', error)
        alert('Failed to reject provider')
      }
    },
    viewDocument(provider, docType) {
      this.currentLicense = provider[docType]
      const docLabels = {
        businessRegistration: 'Business Registration / SSM',
        foodLicense: 'Food License',
        licenseDocument: 'F&B License',
        bankStatement: 'Bank Statement',
        halalCertificate: 'Halal Certificate'
      }
      this.currentDocumentType = docLabels[docType] || 'Document'
      this.showLicenseModal = true
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
/* Layout */
.admin-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
}

.main-content {
  flex: 1;
  margin-left: 260px; /* Matching sidebar width */
  padding: 32px 40px;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.header-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.header-content p {
  color: #64748b;
  font-size: 15px;
}

/* Tabs */
.tabs-container {
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 32px;
}

.tabs-list {
  display: flex;
  gap: 24px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 4px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #0f172a;
}

.tab-btn.active {
  color: #0f172a;
  font-weight: 600;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #3b82f6;
}

.count-badge {
  background: #ef4444;
  color: white;
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 10px;
  font-weight: 700;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.provider-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
}

.provider-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.provider-card.faded {
  opacity: 0.7;
}

/* Card Header */
.card-header {
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.provider-identity {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 48px;
  height: 48px;
  background: #0f172a;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.avatar.approved { background: #dcfce7; color: #15803d; }
.avatar.rejected { background: #fee2e2; color: #b91c1c; }

.provider-identity h3 {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 2px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.timestamp {
  font-size: 12px;
  color: #94a3b8;
}

.status-chip {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-chip.pending { background: #fff7ed; color: #c2410c; }
.status-chip.approved { background: #f0fdf4; color: #15803d; }
.status-chip.rejected { background: #fef2f2; color: #b91c1c; }

/* Card Body */
.card-body {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  flex: 1;
}

.info-group label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.info-group p {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
  margin: 0;
  word-break: break-all;
}

.info-group.full-width {
  grid-column: 1 / -1;
}

.contact-link {
  color: #3b82f6;
  text-decoration: none;
}

.rejection-reason {
  color: #b91c1c !important;
  background: #fef2f2;
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
  margin-top: 4px;
}

/* Documents Area */
.documents-area {
  padding: 0 20px 20px;
}

.documents-area label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.doc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.doc-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.doc-chip:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.no-docs {
  font-size: 12px;
  color: #94a3b8;
  font-style: italic;
}

/* Actions */
.card-actions {
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-reject, .btn-approve {
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  width: 100%;
}

.btn-reject {
  background: white;
  border-color: #e2e8f0;
  color: #ef4444;
}

.btn-reject:hover {
  background: #fef2f2;
  border-color: #fee2e2;
}

.btn-approve {
  background: #0f172a;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.2);
}

.btn-approve:hover {
  background: #1e293b;
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 16px;
  border: 1px dashed #cbd5e1;
  max-width: 400px;
  margin: 40px auto;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  color: #0f172a;
  margin-bottom: 8px;
}

.empty-state p {
  color: #64748b;
  font-size: 14px;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalPop 0.2s ease-out;
}

.modal-content.large {
  max-width: 900px;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

@keyframes modalPop {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
  line-height: 1;
}

.modal-body p {
  color: #475569;
  font-size: 14px;
  margin-bottom: 16px;
}

.modal-body textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-actions button {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
}

.btn-confirm-reject {
  background: #ef4444;
  color: white;
}

.document-viewer {
  flex: 1;
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  border: none;
}

.img-viewer {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.no-preview {
  color: #94a3b8;
  font-weight: 500;
}

@media (max-width: 768px) {
  .main-content { margin-left: 0; padding: 20px; }
  .cards-grid { grid-template-columns: 1fr; }
  .modal-content.large { height: 60vh; }
}
</style>