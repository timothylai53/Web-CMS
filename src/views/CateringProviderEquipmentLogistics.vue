<template>
  <div class="admin-container">
    <Navbar />
    
    <main class="admin-content">
      <!-- Header -->
      <header class="page-header">
        <div class="header-content">
          <h1>Equipment Logistics</h1>
          <p class="subtitle">Track equipment movements, pack lists, and damage reports</p>
        </div>
        <div class="header-actions">
          <button @click="showCreatePackListModal = true" class="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>Create Pack List</span>
          </button>
        </div>
      </header>

      <!-- Stats Grid -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Active Pack Lists</span>
            <span class="stat-value">{{ activePackLists }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Checked Out</span>
            <span class="stat-value">{{ checkedOutCount }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Pending Returns</span>
            <span class="stat-value">{{ pendingReturnsCount }}</span>
          </div>
        </div>
      </section>

      <!-- Pack Lists Section -->
      <section class="content-section">
        <div class="section-header-row">
          <h3>Pack Lists</h3>
          <div class="table-actions">
            <select v-model="filterStatus" @change="loadPackLists" class="filter-select">
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="ready-to-pack">Ready to Pack</option>
              <option value="packed">Packed</option>
              <option value="checked-out">Checked Out</option>
              <option value="on-site">On Site</option>
              <option value="checked-in">Checked In</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading pack lists...</p>
        </div>
        
        <div v-else-if="packLists.length === 0" class="empty-state">
          <div class="empty-icon">
             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
             </svg>
          </div>
          <h3>No pack lists found</h3>
          <p>Create a new pack list to get started</p>
        </div>

        <div v-else class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Event Details</th>
                <th>Date & Location</th>
                <th>Equipment</th>
                <th>Status</th>
                <th>Timeline</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="packList in packLists" :key="packList._id">
                <td>
                  <div class="item-cell">
                    <span class="item-name">{{ packList.eventName }}</span>
                    <span class="item-sub">{{ packList.guestCount }} guests</span>
                  </div>
                </td>
                <td>
                  <div class="item-cell">
                     <span class="font-medium">{{ formatDate(packList.eventDate) }}</span>
                     <span class="item-sub">{{ packList.eventLocation }}</span>
                  </div>
                </td>
                <td>
                  <span class="badge-neutral">{{ packList.equipment?.length || 0 }} items</span>
                </td>
                <td>
                  <span :class="['status-pill', getStatusClass(packList.status)]">
                    {{ formatStatus(packList.status) }}
                  </span>
                </td>
                <td>
                  <div class="timeline-cell">
                    <div v-if="packList.checkedOutAt" class="timeline-item">
                       <span class="timeline-label">Out:</span> {{ formatDateTime(packList.checkedOutAt) }}
                    </div>
                    <div v-if="packList.checkedInAt" class="timeline-item">
                       <span class="timeline-label">In:</span> {{ formatDateTime(packList.checkedInAt) }}
                    </div>
                    <div v-if="!packList.checkedOutAt && !packList.checkedInAt" class="text-muted">-</div>
                  </div>
                </td>
                <td class="text-right">
                  <div class="action-buttons">
                    <button @click="viewPackList(packList)" class="btn-icon" title="View Details">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button 
                      v-if="packList.status === 'packed' || packList.status === 'ready-to-pack'"
                      @click="checkOutEquipment(packList)" 
                      class="btn-icon text-blue" 
                      title="Check Out"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 11l3 3L22 4"/>
                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                      </svg>
                    </button>
                    <button 
                      v-if="packList.status === 'checked-out' || packList.status === 'on-site'"
                      @click="checkInEquipment(packList)" 
                      class="btn-icon text-green" 
                      title="Check In"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </button>
                    <button 
                      v-if="packList.status === 'draft'"
                      @click="editPackList(packList)" 
                      class="btn-icon" 
                      title="Edit"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      @click="deletePackList(packList)" 
                      class="btn-icon delete" 
                      title="Delete"
                      v-if="packList.status === 'draft' || packList.status === 'completed'"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Create Pack List Modal -->
    <div v-if="showCreatePackListModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>Create Pack List</h2>
          <button @click="closeModal" class="btn-close">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="modal-section-title">Event Information</div>
          <div class="form-row">
            <div class="form-group">
              <label>Event Name *</label>
              <input v-model="packListForm.eventName" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Event Date *</label>
              <input v-model="packListForm.eventDate" type="date" class="form-input" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Event Location *</label>
              <input v-model="packListForm.eventLocation" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Guest Count *</label>
              <input v-model.number="packListForm.guestCount" type="number" min="1" class="form-input" required />
            </div>
          </div>

          <div class="section-header-row mt-6">
             <div class="modal-section-title mb-0">Equipment Needed</div>
             <button @click="addEquipmentItem" type="button" class="btn-text">
                + Add Equipment
             </button>
          </div>
          
          <div class="equipment-list-container">
            <div v-if="packListForm.equipment.length === 0" class="empty-state-sm">
                No equipment added yet
            </div>
            <div v-for="(item, index) in packListForm.equipment" :key="index" class="equipment-row">
              <div class="form-group flex-grow">
                 <select v-model="item.equipmentId" class="form-select" required>
                    <option value="">Select equipment...</option>
                    <option v-for="eq in availableEquipment" :key="eq._id" :value="eq._id">
                      {{ eq.itemName }} (Available: {{ eq.availableQuantity }})
                    </option>
                  </select>
              </div>
              <div class="form-group width-100">
                  <input v-model.number="item.quantity" type="number" min="1" class="form-input" placeholder="Qty" required />
              </div>
              <button @click="removeEquipmentItem(index)" type="button" class="btn-icon delete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="modal-section-title mt-6">Timeline (Optional)</div>
          <div class="form-row">
            <div class="form-group">
              <label>Packing Deadline</label>
              <input v-model="packListForm.packingDeadline" type="datetime-local" class="form-input" />
            </div>
            <div class="form-group">
              <label>Transport Time</label>
              <input v-model="packListForm.transportTime" type="datetime-local" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label>Special Instructions</label>
            <textarea v-model="packListForm.specialInstructions" rows="3" class="form-textarea"></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn-secondary">Cancel</button>
          <button @click="savePackList" class="btn-primary" :disabled="saving">
            {{ saving ? 'Creating...' : 'Create Pack List' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Pack List Modal -->
    <div v-if="viewingPackList" class="modal-overlay" @click.self="viewingPackList = null">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>{{ viewingPackList.eventName }}</h2>
          <button @click="viewingPackList = null" class="btn-close">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="detail-grid-container">
            <div class="detail-section">
              <h3>Event Information</h3>
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="label">Date:</span> 
                  <span class="value">{{ formatDate(viewingPackList.eventDate) }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Location:</span> 
                  <span class="value">{{ viewingPackList.eventLocation }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Guests:</span> 
                  <span class="value">{{ viewingPackList.guestCount }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status:</span>
                  <span :class="['status-pill', getStatusClass(viewingPackList.status)]">
                    {{ formatStatus(viewingPackList.status) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="detail-section full-width">
              <h3>Equipment List</h3>
              <div class="table-container border-visible">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in viewingPackList.equipment" :key="item._id">
                    <td>{{ item.equipmentId?.itemName || 'N/A' }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>
                      <span :class="['status-pill', getEquipmentStatusClass(item.status || 'checked-out')]">
                        {{ item.status || 'Standard' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>

            <div v-if="viewingPackList.checkedOutBy" class="detail-section">
              <h3>Check-Out Details</h3>
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="label">Checked Out At:</span> 
                  <span class="value">{{ formatDateTime(viewingPackList.checkedOutAt) }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Checked Out By:</span> 
                  <span class="value">{{ viewingPackList.checkedOutBy.name }}</span>
                </div>
                <div v-if="viewingPackList.checkoutNotes" class="detail-block">
                  <span class="label">Notes:</span> 
                  <p class="value-block">{{ viewingPackList.checkoutNotes }}</p>
                </div>
              </div>
            </div>

            <div v-if="viewingPackList.checkedInBy" class="detail-section">
              <h3>Check-In Details</h3>
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="label">Checked In At:</span> 
                  <span class="value">{{ formatDateTime(viewingPackList.checkedInAt) }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Checked In By:</span> 
                  <span class="value">{{ viewingPackList.checkedInBy.name }}</span>
                </div>
                <div v-if="viewingPackList.checkinNotes" class="detail-block">
                   <span class="label">Notes:</span> 
                   <p class="value-block">{{ viewingPackList.checkinNotes }}</p>
                </div>
              </div>
            </div>

            <div v-if="viewingPackList.damageReport && viewingPackList.damageReport.hasDamage" class="detail-section full-width damage-section">
              <h3>Damage/Loss Report</h3>
              <div v-for="(item, index) in viewingPackList.damageReport.items" :key="index" class="damage-item-card">
                <div class="damage-header">
                  <strong>{{ item.equipmentName }}</strong>
                  <span :class="['status-pill', item.issueType === 'lost' ? 'out' : 'low']">
                    {{ item.issueType }}
                  </span>
                </div>
                <div class="damage-details">
                   <p>Quantity: {{ item.quantity }}</p>
                   <p>Cost: RM {{ item.estimatedCost?.toFixed(2) || '0.00' }}</p>
                </div>
                <p class="damage-desc">"{{ item.description }}"</p>
              </div>
              <div class="damage-summary">
                <div class="summary-line"><span>Damage Charges:</span> <span>RM {{ viewingPackList.damageCharges?.toFixed(2) || '0.00' }}</span></div>
                <div class="summary-line"><span>Loss Charges:</span> <span>RM {{ viewingPackList.lossCharges?.toFixed(2) || '0.00' }}</span></div>
                <div class="summary-line total"><span>Grand Total:</span> <span>RM {{ ((viewingPackList.damageCharges || 0) + (viewingPackList.lossCharges || 0)).toFixed(2) }}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="viewingPackList = null" class="btn-secondary">Close</button>
        </div>
      </div>
    </div>

    <!-- Check Out Modal -->
    <div v-if="checkingOutPackList" class="modal-overlay" @click.self="checkingOutPackList = null">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Check Out Equipment</h2>
          <button @click="checkingOutPackList = null" class="btn-close">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="info-alert mb-6">
             <strong>Event:</strong> {{ checkingOutPackList.eventName }}<br>
             <strong>Equipment Count:</strong> {{ checkingOutPackList.equipment?.length || 0 }} items
          </div>

          <div class="form-group">
            <label>Checked Out By (Name) *</label>
            <input v-model="checkoutForm.checkedOutBy.name" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label>Notes</label>
            <textarea v-model="checkoutForm.checkoutNotes" rows="3" class="form-textarea" 
              placeholder="Any special notes for this check-out..."></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="checkingOutPackList = null" class="btn-secondary">Cancel</button>
          <button @click="confirmCheckOut" class="btn-primary" :disabled="saving">
            {{ saving ? 'Processing...' : 'Confirm Check-Out' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Check In Modal -->
    <div v-if="checkingInPackList" class="modal-overlay" @click.self="checkingInPackList = null">
      <div class="modal-content large">
        <div class="modal-header">
          <h2>Check In Equipment</h2>
          <button @click="checkingInPackList = null" class="btn-close">&times;</button>
        </div>
        
        <div class="modal-body">
           <div class="info-alert mb-6">
            <strong>Event:</strong> {{ checkingInPackList.eventName }}<br>
            <strong>Checked Out:</strong> {{ formatDateTime(checkingInPackList.checkedOutAt) }}
          </div>

          <div class="modal-section-title">Check-In Details</div>
          <div class="form-group">
            <label>Checked In By (Name) *</label>
            <input v-model="checkinForm.checkedInBy.name" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label>Notes</label>
            <textarea v-model="checkinForm.checkinNotes" rows="3" class="form-textarea"
              placeholder="Condition of returned equipment..."></textarea>
          </div>

          <div class="modal-section-title mt-6">Damage/Loss Report</div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="checkinForm.damageReport.hasDamage" />
              <span>Report damaged or lost equipment</span>
            </label>
          </div>

          <div v-if="checkinForm.damageReport.hasDamage" class="damage-form-container">
            <button @click="addDamageItem" type="button" class="btn-text mb-4">
              + Add Damage/Loss Item
            </button>

            <div v-for="(item, index) in checkinForm.damageReport.items" :key="index" class="damage-form-row">
               <div class="row-header">
                 <span>Item #{{ index + 1 }}</span>
                 <button @click="removeDamageItem(index)" type="button" class="btn-text text-danger">Remove</button>
               </div>
              <div class="form-row">
                <div class="form-group flex-grow">
                  <label>Equipment *</label>
                  <select v-model="item.equipmentId" @change="updateEquipmentName(item)" class="form-select" required>
                    <option value="">Select equipment...</option>
                    <option v-for="eq in checkingInPackList.equipment" :key="eq.equipmentId._id" :value="eq.equipmentId._id">
                      {{ eq.equipmentId.itemName }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Issue Type *</label>
                  <select v-model="item.issueType" class="form-select" required>
                    <option value="damaged">Damaged</option>
                    <option value="broken">Broken</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                <div class="form-group width-100">
                  <label>Qty *</label>
                  <input v-model.number="item.quantity" type="number" min="1" class="form-input" required />
                </div>
              </div>

              <div class="form-group">
                <label>Description *</label>
                <textarea v-model="item.description" rows="2" class="form-textarea" required
                  placeholder="Describe the damage or circumstances of loss..."></textarea>
              </div>

              <div class="form-group">
                <label>Estimated Replacement Cost (RM) *</label>
                <input v-model.number="item.estimatedCost" type="number" min="0" step="0.01" class="form-input" required />
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="checkingInPackList = null" class="btn-secondary">Cancel</button>
          <button @click="confirmCheckIn" class="btn-primary" :disabled="saving">
            {{ saving ? 'Processing...' : 'Confirm Check-In' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default {
  name: 'CateringProviderEquipmentLogistics',
  components: {
    Navbar
  },
  setup() {
    const loading = ref(false);
    const saving = ref(false);
    const filterStatus = ref('');
    
    const packLists = ref([]);
    const availableEquipment = ref([]);
    
    const showCreatePackListModal = ref(false);
    const viewingPackList = ref(null);
    const checkingOutPackList = ref(null);
    const checkingInPackList = ref(null);
    
    const packListForm = ref({
      eventName: '',
      eventDate: '',
      eventLocation: '',
      guestCount: 1,
      equipment: [],
      packingDeadline: '',
      transportTime: '',
      specialInstructions: ''
    });
    
    const checkoutForm = ref({
      checkedOutBy: { name: '' },
      checkoutNotes: ''
    });
    
    const checkinForm = ref({
      checkedInBy: { name: '' },
      checkinNotes: '',
      damageReport: {
        hasDamage: false,
        items: []
      }
    });
    
    const activePackLists = computed(() => {
      return packLists.value.filter(p => 
        ['ready-to-pack', 'packed', 'checked-out', 'on-site'].includes(p.status)
      ).length;
    });
    
    const checkedOutCount = computed(() => {
      return packLists.value.filter(p => 
        ['checked-out', 'on-site'].includes(p.status)
      ).length;
    });
    
    const pendingReturnsCount = computed(() => {
      const now = new Date();
      return packLists.value.filter(p => {
        if (p.status === 'checked-out' || p.status === 'on-site') {
          const eventDate = new Date(p.eventDate);
          // Consider pending if event was more than 1 day ago
          return (now - eventDate) > (24 * 60 * 60 * 1000);
        }
        return false;
      }).length;
    });
    
    const loadPackLists = async () => {
      loading.value = true;
      try {
        const params = {};
        if (filterStatus.value) params.status = filterStatus.value;
        
        const response = await axios.get(API_URL + '/inventory/pack-lists', {
          params,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        packLists.value = response.data;
      } catch (error) {
        console.error('Error loading pack lists:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const loadAvailableEquipment = async () => {
      try {
        const response = await axios.get(API_URL + '/inventory/items', {
          params: { itemType: 'equipment' },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        availableEquipment.value = response.data.filter(eq => eq.availableQuantity > 0);
      } catch (error) {
        console.error('Error loading equipment:', error);
      }
    };
    
    const addEquipmentItem = () => {
      packListForm.value.equipment.push({
        equipmentId: '',
        quantity: 1
      });
    };
    
    const removeEquipmentItem = (index) => {
      packListForm.value.equipment.splice(index, 1);
    };
    
    const savePackList = async () => {
      if (!packListForm.value.eventName || !packListForm.value.eventDate || 
          !packListForm.value.eventLocation || packListForm.value.equipment.length === 0) {
        alert('Please fill in all required fields and add at least one equipment item');
        return;
      }
      
      saving.value = true;
      try {
        await axios.post(
          API_URL + '/inventory/pack-lists',
          packListForm.value,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        alert('Pack list created successfully');
        closeModal();
        await loadPackLists();
      } catch (error) {
        console.error('Error creating pack list:', error);
        alert('Failed to create pack list');
      } finally {
        saving.value = false;
      }
    };
    
    const viewPackList = (packList) => {
      viewingPackList.value = packList;
    };
    
    const checkOutEquipment = (packList) => {
      checkingOutPackList.value = packList;
      checkoutForm.value = {
        checkedOutBy: { name: '' },
        checkoutNotes: ''
      };
    };
    
    const confirmCheckOut = async () => {
      if (!checkoutForm.value.checkedOutBy.name) {
        alert('Please enter the name of the person checking out');
        return;
      }
      
      saving.value = true;
      try {
        await axios.post(
          `${API_URL}/inventory/pack-lists/${checkingOutPackList.value._id}/check-out`,
          checkoutForm.value,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        alert('Equipment checked out successfully');
        checkingOutPackList.value = null;
        await loadPackLists();
      } catch (error) {
        console.error('Error checking out:', error);
        alert('Failed to check out equipment');
      } finally {
        saving.value = false;
      }
    };
    
    const checkInEquipment = (packList) => {
      checkingInPackList.value = packList;
      checkinForm.value = {
        checkedInBy: { name: '' },
        checkinNotes: '',
        damageReport: {
          hasDamage: false,
          items: []
        }
      };
    };
    
    const addDamageItem = () => {
      checkinForm.value.damageReport.items.push({
        equipmentId: '',
        equipmentName: '',
        quantity: 1,
        issueType: 'damaged',
        description: '',
        estimatedCost: 0,
        reportedBy: checkinForm.value.checkedInBy.name,
        reportedAt: new Date()
      });
    };
    
    const removeDamageItem = (index) => {
      checkinForm.value.damageReport.items.splice(index, 1);
    };
    
    const updateEquipmentName = (item) => {
      const equipment = checkingInPackList.value.equipment.find(
        eq => eq.equipmentId._id === item.equipmentId
      );
      if (equipment) {
        item.equipmentName = equipment.equipmentId.itemName;
      }
    };
    
    const confirmCheckIn = async () => {
      if (!checkinForm.value.checkedInBy.name) {
        alert('Please enter the name of the person checking in');
        return;
      }
      
      // Validate damage report if present
      if (checkinForm.value.damageReport.hasDamage) {
        if (checkinForm.value.damageReport.items.length === 0) {
          alert('Please add at least one damage/loss item or uncheck the damage report option');
          return;
        }
        
        for (const item of checkinForm.value.damageReport.items) {
          if (!item.equipmentId || !item.description || !item.estimatedCost) {
            alert('Please fill in all damage/loss item details');
            return;
          }
        }
      }
      
      saving.value = true;
      try {
        await axios.post(
          `${API_URL}/inventory/pack-lists/${checkingInPackList.value._id}/check-in`,
          checkinForm.value,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        alert('Equipment checked in successfully');
        checkingInPackList.value = null;
        await loadPackLists();
      } catch (error) {
        console.error('Error checking in:', error);
        alert('Failed to check in equipment');
      } finally {
        saving.value = false;
      }
    };
    
    const deletePackList = async (packList) => {
      if (!confirm(`Are you sure you want to delete the pack list for "${packList.eventName}"?`)) return;
      
      try {
        await axios.delete(
          `${API_URL}/inventory/pack-lists/${packList._id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        alert('Pack list deleted successfully');
        await loadPackLists();
      } catch (error) {
        console.error('Error deleting pack list:', error);
        alert('Failed to delete pack list');
      }
    };
    
    const editPackList = (packList) => {
      // TODO: Implement edit functionality
      alert('Edit functionality coming soon');
    };
    
    const closeModal = () => {
      showCreatePackListModal.value = false;
      packListForm.value = {
        eventName: '',
        eventDate: '',
        eventLocation: '',
        guestCount: 1,
        equipment: [],
        packingDeadline: '',
        transportTime: '',
        specialInstructions: ''
      };
    };
    
    const formatDate = (date) => {
      if (!date) return '-';
      return new Date(date).toLocaleDateString();
    };
    
    const formatDateTime = (date) => {
      if (!date) return '-';
      return new Date(date).toLocaleString();
    };
    
    const formatStatus = (status) => {
      return status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };
    
    const getStatusClass = (status) => {
      // Returns CSS class suffix for status-pill
      return status; 
    };
    
    const getEquipmentStatusClass = (status) => {
       // Returns CSS class suffix for status-pill
       return status || 'default';
    };
    
    onMounted(async () => {
      await loadPackLists();
      await loadAvailableEquipment();
    });
    
    return {
      loading,
      saving,
      filterStatus,
      packLists,
      availableEquipment,
      showCreatePackListModal,
      viewingPackList,
      checkingOutPackList,
      checkingInPackList,
      packListForm,
      checkoutForm,
      checkinForm,
      activePackLists,
      checkedOutCount,
      pendingReturnsCount,
      loadPackLists,
      addEquipmentItem,
      removeEquipmentItem,
      savePackList,
      viewPackList,
      checkOutEquipment,
      confirmCheckOut,
      checkInEquipment,
      addDamageItem,
      removeDamageItem,
      updateEquipmentName,
      confirmCheckIn,
      deletePackList,
      editPackList,
      closeModal,
      formatDate,
      formatDateTime,
      formatStatus,
      getStatusClass,
      getEquipmentStatusClass
    };
  }
};
</script>

<style scoped>
/* Admin Container */
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
  overflow-y: auto;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748b;
  font-size: 15px;
}

/* Base Buttons */
.btn-primary, .btn-secondary, .btn-danger, .btn-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 6px 8px -1px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #1e293b;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-text {
  background: transparent;
  color: #3b82f6;
  padding: 8px 12px;
}

.btn-text:hover {
  background: #eff6ff;
}

.btn-icon {
  background: transparent;
  border: none;
  color: #64748b;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.btn-icon.delete:hover {
  color: #ef4444;
  background: #fef2f2;
}

.btn-icon.text-blue:hover { color: #2563eb; background: #eff6ff; }
.btn-icon.text-green:hover { color: #16a34a; background: #f0fdf4; }

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.blue { background: #eff6ff; color: #3b82f6; }
.stat-icon.purple { background: #f3e8ff; color: #a855f7; }
.stat-icon.amber { background: #fffbeb; color: #f59e0b; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-value {
  color: #1e293b;
  font-size: 24px;
  font-weight: 700;
}

/* Content Sections */
.content-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header-row h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Tables */
.table-container {
  overflow-x: auto;
}

.table-container.border-visible {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f8fafc;
  padding: 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #334155;
  vertical-align: middle;
}

.data-table tr:hover {
  background: #f8fafc;
}

.item-cell {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: 600;
  color: #1e293b;
}

.item-sub {
  font-size: 12px;
  color: #94a3b8;
}

.timeline-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}

.timeline-label {
    color: #94a3b8;
    margin-right: 4px;
}

.badge-neutral {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
}

.status-pill {
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  text-transform: capitalize;
}

.status-pill.success, .status-pill.completed, .status-pill.packed, .status-pill.checked-in { background: #ecfdf5; color: #10b981; }
.status-pill.warning, .status-pill.ready-to-pack { background: #fffbeb; color: #d97706; }
.status-pill.danger, .status-pill.lost, .status-pill.broken, .status-pill.damaged { background: #fef2f2; color: #ef4444; }
.status-pill.info, .status-pill.checked-out, .status-pill.on-site { background: #eff6ff; color: #3b82f6; }
.status-pill.default, .status-pill.draft { background: #f1f5f9; color: #64748b; }

.text-right { text-align: right; }
.text-muted { color: #94a3b8; }
.font-medium { font-weight: 500; }

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Filters */
.filter-select {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #475569;
  background-color: white;
  min-width: 150px;
}

/* Empty & Loading States */
.empty-state {
  text-align: center;
  padding: 64px;
  color: #64748b;
}

.empty-icon {
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-state-sm {
    text-align: center;
    padding: 20px;
    color: #94a3b8;
    font-style: italic;
    background: #f8fafc;
    border-radius: 8px;
    margin-bottom: 16px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px;
  color: #64748b;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-content.large {
  max-width: 800px;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
}

.btn-close {
    background: transparent;
    border: none;
    font-size: 24px;
    color: #94a3b8;
    cursor: pointer;
    line-height: 1;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f8fafc;
}

.modal-section-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.detail-section {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f1f5f9;
}

.detail-section:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
}

.detail-section h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 16px;
}

.detail-rows {
    display: grid;
    gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.detail-row .label {
    color: #64748b;
}

.detail-row .value {
    font-weight: 500;
    color: #1e293b;
    text-align: right;
}

.detail-block {
    margin-top: 8px;
}
.detail-block .value-block {
    background: #f8fafc;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    color: #334155;
    margin-top: 4px;
}

/* Forms */
.form-group {
  margin-bottom: 20px;
}

.form-group.flex-grow { flex: 1; }
.form-group.width-100 { width: 100px; }

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
}

.form-select, .form-input, .form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-select:focus, .form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-row {
  display: flex;
  gap: 16px;
}

.equipment-list-container {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 4px;
}

.equipment-row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 12px;
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
}

.mb-0 { margin-bottom: 0; }
.mb-4 { margin-bottom: 16px; }
.mb-6 { margin-bottom: 24px; }
.mt-6 { margin-top: 24px; }

.info-alert {
    background: #eff6ff;
    border: 1px solid #dbeafe;
    padding: 16px;
    border-radius: 8px;
    color: #1e40af;
    font-size: 14px;
    line-height: 1.6;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
}

.checkbox-label input {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

/* Damage Section */
.damage-form-container {
    border-top: 1px solid #e2e8f0;
    padding-top: 16px;
}

.damage-form-row {
    background: #fff1f2;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #fecaca;
    margin-bottom: 16px;
}

.row-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 12px;
    font-weight: 600;
    color: #9f1239;
    text-transform: uppercase;
}

.damage-item-card {
    background: #fff1f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
}

.damage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.damage-details {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #881337;
    margin-bottom: 8px;
}

.damage-desc {
    font-style: italic;
    color: #4c0519;
    font-size: 14px;
}

.damage-summary {
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    margin-top: 16px;
}

.summary-line {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    color: #64748b;
    font-size: 14px;
}

.summary-line.total {
    border-top: 1px solid #e2e8f0;
    margin-top: 8px;
    padding-top: 12px;
    font-weight: 700;
    color: #1e293b;
    font-size: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .admin-content { margin-left: 0; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
  .header-actions { display: none; }
  .form-row { flex-direction: column; gap: 0; }
  .form-group.width-100 { width: 100%; }
}
</style>
