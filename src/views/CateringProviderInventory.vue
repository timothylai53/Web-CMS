<template>
  <div class="admin-container">
    <Navbar />
    
    <main class="admin-content">
      <!-- Header -->
      <header class="page-header">
        <div class="header-content">
          <h1>Kitchen Inventory</h1>
          <p class="subtitle">Track raw materials, equipment, and stock levels</p>
        </div>
        <div class="header-actions">
        </div>
      </header>

      <!-- Statistics Cards -->
      <section class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <path d="M9 22V12h6v10"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Raw Materials</span>
            <span class="stat-value">{{ statistics.consumablesCount || 0 }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Equipment</span>
            <span class="stat-value">{{ statistics.equipmentCount || 0 }}</span>
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
            <span class="stat-label">Low Stock Alerts</span>
            <span class="stat-value">{{ statistics.lowStockCount || 0 }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Value</span>
            <span class="stat-value">RM {{ formatNumber(statistics.totalValue || 0) }}</span>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="dashboard-section">
        <!-- Tabs -->
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
            <span v-if="tab.badge" class="badge-count">{{ tab.badge }}</span>
          </button>
        </div>

        <div class="tab-content">
          <!-- Raw Materials Tab -->
          <div v-if="activeTab === 'raw-materials'" class="tab-pane">
            
            <!-- Quick Add Section -->
            <div class="bulk-entry-card">
              <div class="card-header">
                <h3>Quick Add Materials</h3>
                <div class="header-actions-inline">
                  <button @click="addBulkRow('consumable')" class="btn-text">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Add Row
                  </button>
                  <button @click="saveBulkItems('consumable')" class="btn-sm btn-primary" :disabled="saving || bulkConsumables.length === 0">
                    {{ saving ? 'Saving...' : `Save ${bulkConsumables.length} Items` }}
                  </button>
                </div>
              </div>

              <div class="bulk-table-container">
                <table class="data-table bulk-table">
                  <thead>
                    <tr>
                      <th style="width: 40px">#</th>
                      <th>Item Name *</th>
                      <th>Category *</th>
                      <th>Quantity *</th>
                      <th>Unit *</th>
                      <th>Total (RM)</th>
                      <th>Expiration</th>
                      <th style="width: 50px"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="bulkConsumables.length === 0">
                      <td colspan="8" class="empty-cell">
                        Click "Add Row" to start adding items quickly
                      </td>
                    </tr>
                    <tr v-for="(row, index) in bulkConsumables" :key="'cons-' + index" :class="{ 'error-row': row.hasError }">
                      <td class="row-index">{{ index + 1 }}</td>
                      <td>
                        <input 
                          v-model="row.itemName" 
                          type="text" 
                          placeholder="Item Name"
                          class="form-input-sm"
                          :class="{ 'error': row.errors?.itemName }"
                        />
                      </td>
                      <td>
                        <select v-model="row.category" class="form-select-sm" :class="{ 'error': row.errors?.category }">
                          <option value="">Select...</option>
                          <option value="Dry Goods">Dry Goods</option>
                          <option value="Chilled">Chilled</option>
                          <option value="Frozen">Frozen</option>
                          <option value="Fresh Produce">Fresh Produce</option>
                          <option value="Spices & Condiments">Spices & Condiments</option>
                          <option value="Beverages">Beverages</option>
                        </select>
                      </td>
                      <td>
                        <input 
                          v-model.number="row.quantity" 
                          type="number" 
                          min="0" 
                          step="0.01"
                          class="form-input-sm"
                          :class="{ 'error': row.errors?.quantity }"
                        />
                      </td>
                      <td>
                        <select v-model="row.unit" class="form-select-sm" :class="{ 'error': row.errors?.unit }">
                          <option value="">Unit</option>
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="liter">L</option>
                          <option value="ml">ml</option>
                          <option value="pieces">pcs</option>
                          <option value="boxes">box</option>
                          <option value="bags">bag</option>
                        </select>
                      </td>
                      <td>
                        <input v-model.number="row.totalPrice" type="number" min="0" step="0.01" placeholder="0.00" class="form-input-sm" />
                      </td>
                      <td>
                        <input v-model="row.expirationDate" type="date" class="form-input-sm" />
                      </td>
                      <td>
                        <button @click="removeBulkRow('consumable', index)" class="btn-icon-danger square">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Inventory List -->
            <div class="content-header">
              <h3>Current Inventory</h3>
              
              <div class="table-actions">
                <div class="search-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Search materials..."
                    @input="loadItems"
                  />
                </div>
                <select v-model="filterCategory" @change="loadItems" class="filter-select">
                  <option value="">All Categories</option>
                  <option value="Dry Goods">Dry Goods</option>
                  <option value="Chilled">Chilled</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Spices & Condiments">Spices & Condiments</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>
            </div>

            <div v-if="loading" class="loading-state">
              <div class="spinner"></div>
              <p>Loading inventory...</p>
            </div>
            
            <div v-else-if="filteredConsumables.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <path d="M20 12V8H6a2 2 0 01-2-2 2 2 0 012-2h12v4"/>
                  <path d="M4 6v12a2 2 0 002 2h14v-4"/>
                  <path d="M18 12a2 2 0 000 4h4v-4h-4z"/>
                </svg>
              </div>
              <h3>No materials found</h3>
              <p>Try adjusting your search or filters</p>
            </div>

            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Total Value</th>
                    <th>Expiration</th>
                    <th>Status</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in filteredConsumables" :key="item._id">
                    <td>
                      <div class="item-cell">
                        <span class="item-name">{{ item.itemName }}</span>
                        <span class="item-sub">{{ item.description }}</span>
                      </div>
                    </td>
                    <td><span class="category-pill">{{ item.category }}</span></td>
                    <td>
                      <span class="font-medium">{{ item.quantity }} {{ item.unit }}</span>
                    </td>
                    <td>RM {{ (item.quantity * (item.costPerUnit || 0)).toFixed(2) }}</td>
                    <td>
                      <div class="expiry-cell">
                        <span>{{ item.expirationDate ? formatDate(item.expirationDate) : '-' }}</span>
                        <span v-if="isExpiringSoon(item)" class="badge-warning-xs">Expiring Soon</span>
                      </div>
                    </td>
                    <td>
                      <span :class="['status-pill', getStatusClass(getItemStatus(item))]">
                        {{ formatStatus(getItemStatus(item)) }}
                      </span>
                    </td>
                    <td class="text-right">
                      <div class="action-buttons">
                        <button @click="adjustStock(item)" class="btn-icon" title="Adjust Stock">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                             <path d="M12 5v14M5 12h14"/>
                          </svg>
                        </button>
                        <button @click="editItem(item)" class="btn-icon" title="Edit">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button @click="deleteItem(item)" class="btn-icon delete" title="Delete">
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
          </div>

          <!-- Equipment Tab -->
          <div v-if="activeTab === 'equipment'" class="tab-pane">
            <!-- Quick Add Equipment -->
            <div class="bulk-entry-card">
              <div class="card-header">
                <h3>Quick Add Equipment</h3>
                <div class="header-actions-inline">
                  <button @click="addBulkRow('equipment')" class="btn-text">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Add Row
                  </button>
                  <button @click="saveBulkItems('equipment')" class="btn-sm btn-primary" :disabled="saving || bulkEquipment.length === 0">
                    {{ saving ? 'Saving...' : `Save ${bulkEquipment.length} Items` }}
                  </button>
                </div>
              </div>

              <div class="bulk-table-container">
                <table class="data-table bulk-table">
                  <thead>
                    <tr>
                      <th style="width: 40px;">#</th>
                      <th>Item Name *</th>
                      <th>Category *</th>
                      <th style="width: 100px;">Total Qty *</th>
                      <th style="width: 100px;">Available</th>
                      <th>Description</th>
                      <th style="width: 50px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="bulkEquipment.length === 0">
                      <td colspan="7" class="empty-cell">
                        Click "Add Row" to start adding equipment
                      </td>
                    </tr>
                    <tr v-for="(row, index) in bulkEquipment" :key="'equip-' + index">
                      <td class="row-index">{{ index + 1 }}</td>
                      <td>
                        <input 
                          v-model="row.itemName" 
                          type="text" 
                          class="form-input-sm"
                          placeholder="Equipment name" 
                          :class="{ 'error': row.errors?.itemName }"
                        />
                      </td>
                      <td>
                        <select v-model="row.category" class="form-select-sm" :class="{ 'error': row.errors?.category }">
                          <option value="">Select...</option>
                          <option value="Cooking Equipment">Cooking Equipment</option>
                          <option value="Serving Ware">Serving Ware</option>
                          <option value="Dining Sets">Dining Sets</option>
                          <option value="Linens">Linens</option>
                          <option value="Transport Equipment">Transport Equipment</option>
                          <option value="Other Equipment">Other Equipment</option>
                        </select>
                      </td>
                      <td>
                       <input 
  v-model.number="row.totalQuantity" 
  type="number" 
  min="0" 
  step="1" 
  class="form-input-sm"
  placeholder="0"
  :class="{ 'error': row.errors?.totalQuantity }"
/>
                      </td>
                      <td>
                        <input v-model.number="row.availableQuantity" class="form-input-sm" type="number" min="0" step="1" placeholder="0" />
                      </td>
                      <td>
                        <input v-model="row.description" class="form-input-sm" type="text" placeholder="Description" />
                      </td>
                      <td>
                        <button @click="removeBulkRow('equipment', index)" class="btn-icon-danger square">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Equipment List -->
            <div class="content-header">
              <h3>Current Equipment</h3>
              <div class="table-actions">
                <div class="search-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Search equipment..."
                    @input="loadItems"
                  />
                </div>
                <select v-model="filterCategory" @change="loadItems" class="filter-select">
                  <option value="">All Categories</option>
                  <option value="Cooking Equipment">Cooking Equipment</option>
                  <option value="Serving Ware">Serving Ware</option>
                  <option value="Dining Sets">Dining Sets</option>
                  <option value="Linens">Linens</option>
                  <option value="Transport Equipment">Transport Equipment</option>
                  <option value="Other Equipment">Other Equipment</option>
                </select>
              </div>
            </div>

            <div v-if="loading" class="loading-state">
              <div class="spinner"></div>
              <p>Loading equipment...</p>
            </div>
            
            <div v-else-if="filteredEquipment.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
                </svg>
              </div>
              <h3>No equipment found</h3>
              <p>Add equipment using the form above</p>
            </div>

            <div v-else class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Total</th>
                    <th>Available</th>
                    <th>In Use</th>
                    <th>Damaged</th>
                    <th>Status</th>
                    <th class="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in filteredEquipment" :key="item._id">
                    <td>
                      <div class="item-cell">
                        <span class="item-name">{{ item.itemName }}</span>
                        <span class="item-sub">{{ item.description }}</span>
                      </div>
                    </td>
                    <td><span class="category-pill">{{ item.category }}</span></td>
                    <td class="font-bold">{{ item.totalQuantity }}</td>
                    <td class="text-success font-medium">{{ item.availableQuantity }}</td>
                    <td class="text-blue font-medium">{{ item.inUseQuantity }}</td>
                    <td class="text-warning font-medium">{{ item.damagedQuantity }}</td>
                    <td>
                      <span :class="['status-pill', getStatusClass(item.status)]">
                        {{ formatStatus(item.status) }}
                      </span>
                    </td>
                    <td class="text-right">
                      <div class="action-buttons">
                        <button @click="editItem(item)" class="btn-icon" title="Edit">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button @click="deleteItem(item)" class="btn-icon delete" title="Delete">
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
          </div>

          <!-- Low Stock Alerts Tab -->
         <div v-if="activeTab === 'low-stock'" class="tab-pane">
                <div v-if="loading" class="loading-state">
                   <div class="spinner"></div>
                   <p>Checking stock levels...</p>
                </div>
                
                <div v-else-if="lowStockItems.length === 0" class="empty-state">
                  <div class="empty-icon text-success">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <path d="M22 4L12 14.01l-3-3"/>
                    </svg>
                  </div>
                  <h3>All good!</h3>
                  <p>No low stock alerts at the moment.</p>
                </div>

                <div v-else class="alerts-container-grid">
                  <div class="modern-alert-card amber" v-for="item in lowStockItems" :key="item._id">
                    <div class="alert-indicator"></div>
                    <div class="alert-content-wrapper">
                      <div class="alert-main-info">
                        <div class="alert-title-row">
                          <span class="item-name">{{ item.itemName }}</span>
                          <span class="category-tag">{{ item.category }}</span>
                        </div>
                        <div class="alert-metrics-grid">
                          <div class="metric-item">
                            <span class="m-label">Current Stock</span>
                            <span class="m-value critical-amber">
                              {{ item.itemType === 'consumable' ? item.quantity : item.availableQuantity }} {{ item.unit || 'pcs' }}
                            </span>
                          </div>
                          <div class="metric-item">
                            <span class="m-label">Alert At</span>
                            <span class="m-value">≤ {{ item.lowStockThreshold || item.reorderPoint || (item.itemType === 'consumable' ? 10 : 5) }}</span>
                          </div>
                        </div>
                      </div>
                     <button v-if="item.itemType === 'consumable'" class="btn-alert-action restock" @click="adjustStock(item)">
  Restock
</button>
<button v-else class="btn-alert-action restock" @click="editItem(item)">
  Manage Stock
</button>
                    </div>
                  </div>
                </div>
                </div>

          <!-- Expiring Items Tab -->
          <div v-if="activeTab === 'expiring'" class="tab-pane">
                <div v-if="loading" class="loading-state">
                   <div class="spinner"></div>
                   <p>Checking expiration dates...</p>
                </div>
                
                <div v-else-if="expiringItems.length === 0" class="empty-state">
                  <div class="empty-icon text-success">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <path d="M22 4L12 14.01l-3-3"/>
                    </svg>
                  </div>
                  <h3>All good!</h3>
                  <p>No items are expiring soon.</p>
                </div>

                <div v-else class="alerts-container-grid">
                  <div class="modern-alert-card red" v-for="item in expiringItems" :key="item._id">
                    <div class="alert-indicator"></div>
                    <div class="alert-content-wrapper">
                      <div class="alert-main-info">
                        <div class="alert-title-row">
                          <span class="item-name">{{ item.itemName }}</span>
                          <span class="category-tag">{{ item.category }}</span>
                        </div>
                        <div class="alert-metrics-grid">
                          <div class="metric-item">
                            <span class="m-label">Expires Date</span>
                            <span class="m-value critical-red">
                              {{ new Date(item.expirationDate).toLocaleDateString() }}
                            </span>
                          </div>
                          <div class="metric-item">
                            <span class="m-label">Value at Risk</span>
                            <span class="m-value">RM {{ (item.quantity * (item.costPerUnit || 0)).toFixed(2) }}</span>
                          </div>
                        </div>
                      </div>
                      <button class="btn-alert-action dispose" @click="adjustStock(item)">
  Manage
</button>
                    </div>
                  </div>
                </div>
            </div>

        </div>
      </section>
    </main>

    <!-- Modal for Add/Edit -->
    <div v-if="showAddItemModal || editingItem" class="modal-overlay" @click.self="closeModal">
      <div class="modal-window">
        <div class="modal-header">
          <div class="header-title">
            <h3>{{ editingItem ? '📝 Edit Inventory Item' : '✨ New Inventory Item' }}</h3>
            <p>Fill in the details to update your kitchen stock.</p>
          </div>
          <button @click="closeModal" class="btn-close-x">&times;</button>
        </div>
        
        <div class="modal-body-scroll">
           <div class="form-section-title">Item Classification</div>
           <div class="type-selection-grid" v-if="!editingItem">
              <label class="type-card" :class="{ active: itemForm.itemType === 'consumable' }">
                <input type="radio" v-model="itemForm.itemType" value="consumable">
                <div class="type-icon">🥫</div>
                <div class="type-info">
                  <strong>Raw Material</strong>
                  <span>Ingredients & Consumables</span>
                </div>
              </label>
              <label class="type-card" :class="{ active: itemForm.itemType === 'equipment' }">
                <input type="radio" v-model="itemForm.itemType" value="equipment">
                <div class="type-icon">🍳</div>
                <div class="type-info">
                  <strong>Equipment</strong>
                  <span>Kitchen Tools & Reusables</span>
                </div>
              </label>
           </div>

           <div class="form-grid">
             <div class="form-group full">
               <label>Item Name *</label>
               <input v-model="itemForm.itemName" type="text" class="form-input-modern" placeholder="e.g. Premium Basmati Rice">
             </div>
             
             <div class="form-group">
               <label>Category *</label>
               <select v-model="itemForm.category" class="form-select-modern">
                  <template v-if="itemForm.itemType === 'consumable'">
                    <option value="Dry Goods">Dry Goods</option>
                    <option value="Chilled">Chilled</option>
                    <option value="Frozen">Frozen</option>
                    <option value="Fresh Produce">Fresh Produce</option>
                    <option value="Spices & Condiments">Spices & Condiments</option>
                    <option value="Beverages">Beverages</option>
                  </template>
                  <template v-else>
                    <option value="Cooking Equipment">Cooking Equipment</option>
                    <option value="Serving Ware">Serving Ware</option>
                    <option value="Dining Sets">Dining Sets</option>
                    <option value="Linens">Linens</option>
                    <option value="Transport Equipment">Transport Equipment</option>
                    <option value="Other Equipment">Other Equipment</option>
                  </template>
               </select>
             </div>

             <template v-if="itemForm.itemType === 'consumable'">
               <div class="form-group">
                 <label>Unit Type</label>
                 <select v-model="itemForm.unit" class="form-select-modern">
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="liter">Liter (L)</option>
                    <option value="ml">Milliliter (ml)</option>
                    <option value="pieces">Pieces (pcs)</option>
                 </select>
               </div>
               <div class="form-group">
                 <label>Current Quantity</label>
                 <input v-model.number="itemForm.quantity" type="number" step="0.01" class="form-input-modern">
               </div>
               
               <div class="form-group">
                 <label>Low Stock Alert At ({{ itemForm.unit }})</label>
                 <input v-model.number="itemForm.lowStockThreshold" type="number" class="form-input-modern" placeholder="e.g. 10">
                 <small class="text-sm">Alerts you when stock falls below this level.</small>
               </div>

               <div class="form-group">
                 <label>Total Value (RM)</label>
                 <input v-model.number="itemForm.totalPrice" type="number" step="0.01" class="form-input-modern">
               </div>
               <div class="form-group">
                 <label>Expiration Date</label>
                 <input v-model="itemForm.expirationDate" type="date" class="form-input-modern">
               </div>
               <div class="form-group">
                 <label>Alert (Days Before)</label>
                 <input v-model.number="itemForm.daysBeforeExpiryAlert" type="number" class="form-input-modern" placeholder="7">
               </div>
             </template>

             <template v-if="itemForm.itemType === 'equipment'">
               <div class="form-group">
                 <label>Total Quantity Owned</label>
                 <input v-model.number="itemForm.totalQuantity" type="number" class="form-input-modern">
               </div>
               <div class="form-group">
                 <label>Currently Available (Auto-calculated)</label>
                 <input v-model.number="itemForm.availableQuantity" type="number" class="form-input-modern" disabled style="background-color: #e2e8f0; cursor: not-allowed; color: #64748b;">
               </div>
               
               <div class="form-group">
                 <label>Min Available Equipment Alert</label>
                 <input v-model.number="itemForm.lowStockThreshold" type="number" class="form-input-modern" placeholder="e.g. 5">
                 <small class="text-sm">Alerts you when available items fall below this level.</small>
               </div>
             </template>
           </div>
           
           <div class="form-group full">
              <label>Description / Internal Notes</label>
              <textarea v-model="itemForm.description" rows="2" class="form-textarea-modern" placeholder="Any special storage instructions..."></textarea>
           </div>
          </div>
        
        <div class="modal-footer-modern">
          <button @click="closeModal" class="btn-cancel">Cancel</button>
          <button @click="saveItem" class="btn-save" :disabled="saving">
            {{ saving ? 'Processing...' : (editingItem ? 'Update Item' : 'Add to Inventory') }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="adjustingItem" class="modal-overlay" @click.self="adjustingItem = null">
      <div class="modal-window mini">
        <div class="modal-header">
           <div class="header-title">
             <h3>📦 Adjust Stock Level</h3>
             <p>{{ adjustingItem.itemName }}</p>
           </div>
           <button @click="adjustingItem = null" class="btn-close-x">&times;</button>
        </div>
        <div class="modal-body">
           <div class="adjustment-preview-card">
              <div class="preview-side">
                 <span class="preview-label">Current</span>
                 <span class="preview-value">{{ adjustingItem.quantity }}</span>
              </div>
              <div class="preview-arrow">➡️</div>
              <div class="preview-side">
                 <span class="preview-label">Projected</span>
                 <span class="preview-value highlight">{{ calculateNewStock() }}</span>
              </div>
              <div class="preview-unit">{{ adjustingItem.unit }}</div>
           </div>

           <div class="form-group">
             <label>Action Type</label>
             <div class="action-toggle-group">
               <button @click="stockAdjustment.type = 'add'" :class="{ active: stockAdjustment.type === 'add' }">Restock (+)</button>
               <button @click="stockAdjustment.type = 'subtract'" :class="{ active: stockAdjustment.type === 'subtract' }">Used/Wasted (-)</button>
               <button @click="stockAdjustment.type = 'set'" :class="{ active: stockAdjustment.type === 'set' }">Audit (Set)</button>
             </div>
           </div>
           
           <div class="form-group">
             <label>{{ stockAdjustment.type === 'set' ? 'Physical Count Quantity' : 'Change Amount' }}</label>
             <div class="input-with-badge">
               <input v-model.number="stockAdjustment.quantity" type="number" class="form-input-modern large-font" autofocus>
               <span class="input-unit-badge">{{ adjustingItem.unit }}</span>
             </div>
           </div>

           <div class="form-group">
              <label>Reason for Adjustment</label>
              <textarea v-model="stockAdjustment.reason" rows="2" class="form-textarea-modern" placeholder="e.g. Weekly restock from vendor"></textarea>
           </div>
        </div>
        <div class="modal-footer-modern">
           <button @click="adjustingItem = null" class="btn-cancel">Cancel</button>
           <button @click="confirmStockAdjustment" class="btn-save" :disabled="saving">Confirm Changes</button>
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
  name: 'CateringProviderInventory',
  components: {
    Navbar
  },
  setup() {
    const activeTab = ref('raw-materials');
    const loading = ref(false);
    const saving = ref(false);
    const searchQuery = ref('');
    const filterCategory = ref('');
    
    const items = ref([]);
    const lowStockItems = ref([]);
    const expiringItems = ref([]);
    const statistics = ref({});
    
    const showAddItemModal = ref(false);
    const editingItem = ref(null);
    const adjustingItem = ref(null);
    
    // Bulk Add - Inline tables (always visible)
    const bulkConsumables = ref([]);
    const bulkEquipment = ref([]);
    
    // Keep modal for backward compatibility (if needed)
    const showBulkAddModal = ref(false);
    const bulkItemType = ref('consumable');
    const bulkItems = ref([]);

    const getAuthHeaders = () => {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    };
    
    const itemForm = ref({
      itemType: 'consumable',
      itemName: '',
      category: '',
      description: '',
      quantity: 0,
      unit: 'kg',
      totalPrice: 0, // 👈 修复这里：原本是 costPerUnit
      lowStockThreshold: 10,
      expirationDate: '',
      daysBeforeExpiryAlert: 7,
      totalQuantity: 0,
      availableQuantity: 0
    });
    
    const stockAdjustment = ref({
      type: 'add',
      quantity: 0,
      reason: ''
    });
    
    const tabs = computed(() => [
      { id: 'raw-materials', label: 'Raw Materials', badge: null },
      { id: 'equipment', label: 'Equipment', badge: null },
      { id: 'low-stock', label: 'Low Stock', badge: statistics.value.lowStockCount || 0 },
      { id: 'expiring', label: 'Expiring Soon', badge: statistics.value.expiringSoonCount || 0 }
    ]);
    
    const filteredConsumables = computed(() => {
      let result = items.value.filter(item => item.itemType === 'consumable');
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(item => 
          item.itemName.toLowerCase().includes(query) || 
          item.category.toLowerCase().includes(query)
        );
      }
      
      if (filterCategory.value) {
        result = result.filter(item => item.category === filterCategory.value);
      }
      
      return result;
    });
    
    const filteredEquipment = computed(() => {
      let result = items.value.filter(item => item.itemType === 'equipment');
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(item => 
          item.itemName.toLowerCase().includes(query) || 
          item.category.toLowerCase().includes(query)
        );
      }
      
      if (filterCategory.value) {
        result = result.filter(item => item.category === filterCategory.value);
      }
      
      return result;
    });
    
    const loadStatistics = async () => {
      try {
        const response = await axios.get(API_URL + '/inventory/statistics', {
          headers: getAuthHeaders()
        });
        statistics.value = response.data;
      } catch (error) {
        console.error('Error loading statistics:', error);
      }
    };
    
  const loadItems = async () => {
      loading.value = true;
      try {
        const params = {
          // 💡 移除 itemType 参数，直接拉取所有类型的数据
          search: searchQuery.value,
          category: filterCategory.value
        };
        
        const response = await axios.get(API_URL + '/inventory/items', {
          params,
          headers: getAuthHeaders()
        });
        
        // 💡 前端的 computed property (filteredConsumables 和 filteredEquipment) 会自动把它们分开
        items.value = response.data;
      } catch (error) {
        console.error('Error loading items:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const loadLowStockAlerts = async () => {
      try {
        const response = await axios.get(API_URL + '/inventory/alerts/low-stock', {
          headers: getAuthHeaders()
        });
        lowStockItems.value = response.data;
      } catch (error) {
        console.error('Error loading low stock alerts:', error);
      }
    };
    
    const loadExpiringItems = async () => {
      try {
        const response = await axios.get(API_URL + '/inventory/alerts/expiring', {
          headers: getAuthHeaders()
        });
        expiringItems.value = response.data;
      } catch (error) {
        console.error('Error loading expiring items:', error);
      }
    };
    
    const saveItem = async () => {
      saving.value = true;
      try {
        // Prepare the data to send
        const itemData = { ...itemForm.value };
        
        // If it's a consumable and has totalPrice, calculate costPerUnit
        if (itemData.itemType === 'consumable' && itemData.totalPrice !== undefined) {
          itemData.costPerUnit = itemData.quantity > 0 ? itemData.totalPrice / itemData.quantity : 0;
          delete itemData.totalPrice;
        }
        
        // Map the new UI threshold to the backend's expected reorder field
        if (itemData.itemType === 'consumable') {
          itemData.reorderPoint = itemData.lowStockThreshold || 10;
          itemData.reorderQuantity = 0;
        } else if (itemData.itemType === 'equipment') {
          itemData.reorderPoint = itemData.lowStockThreshold || 5;
        }
        
     if (editingItem.value) {
          // Update
          const response = await axios.put(API_URL + `/inventory/items/${editingItem.value._id}`, itemData, { headers: getAuthHeaders() });
          
         const index = items.value.findIndex(i => i._id === editingItem.value._id);
          if (index !== -1) {
             items.value.splice(index, 1, response.data);
          }
          alert('Item updated successfully');
        } else {
          // Create
          await axios.post(API_URL + '/inventory/items', itemData, { headers: getAuthHeaders() });
          alert('Item added to inventory');
        }
        
        closeModal();
        await loadItems();
        await loadStatistics();
        await loadLowStockAlerts();
        await loadExpiringItems();
      } catch (error) {
        console.error('Error saving item:', error);
        alert('Failed to save item');
      } finally {
        saving.value = false;
      }
    };

    
    // Bulk Add Methods
    const addBulkRow = (type = 'consumable') => {
      const newRow = {
        itemType: type,
        itemName: '',
        category: '',
        description: '',
        supplier: '',
        storageLocation: '',
        errors: {}
      };
      
      if (type === 'consumable') {
        Object.assign(newRow, {
          quantity: 0,
          unit: 'kg',
          totalPrice: 0,
          expirationDate: '',
          daysBeforeExpiryAlert: 7
        });
        bulkConsumables.value.push(newRow);
      } else {
        Object.assign(newRow, {
          totalQuantity: 1,
          availableQuantity: 1
        });
        bulkEquipment.value.push(newRow);
      }
    };
    
    const removeBulkRow = (type, index) => {
      const targetArray = type === 'consumable' ? bulkConsumables : bulkEquipment;
      targetArray.value.splice(index, 1);
    };
    
    const validateBulkRow = (row) => {
      const errors = {};
      
      if (!row.itemName || row.itemName.trim() === '') {
        errors.itemName = 'Item name is required';
      }
      
      if (!row.category) {
        errors.category = 'Category is required';
      }
      
      if (row.itemType === 'consumable') {
        if (!row.quantity || row.quantity <= 0) {
          errors.quantity = 'Quantity must be greater than 0';
        }
        if (!row.unit) {
          errors.unit = 'Unit is required';
        }
      } else {
        if (!row.totalQuantity || row.totalQuantity < 1) {
          errors.totalQuantity = 'Total quantity must be at least 1';
        }
      }
      
      return errors;
    };
    
    const saveBulkItems = async (type) => {
      const targetArray = type === 'consumable' ? bulkConsumables : bulkEquipment;
      
      // Validate all rows
      let hasErrors = false;
      targetArray.value.forEach(row => {
        row.errors = validateBulkRow(row);
        if (Object.keys(row.errors).length > 0) {
          row.hasError = true;
          hasErrors = true;
        } else {
          row.hasError = false;
        }
      });
      
      if (hasErrors) {
        alert('Please fix the errors in the highlighted rows before saving.');
        return;
      }
      
      if (targetArray.value.length === 0) {
        alert('Please add at least one item.');
        return;
      }
      
      saving.value = true;
      try {
        // Prepare items for submission
        const itemsToSave = targetArray.value.map(row => {
          const item = {
            itemType: row.itemType,
            itemName: row.itemName.trim(),
            category: row.category,
            description: row.description || '',
            storageLocation: row.storageLocation || '',
            notes: '',
            supplier: {
              name: row.supplier || '',
              contact: '',
              email: ''
            }
          };
          
        if (row.itemType === 'consumable') {
            // Calculate costPerUnit from totalPrice and quantity
            const costPerUnit = row.quantity > 0 ? (row.totalPrice || 0) / row.quantity : 0;
            Object.assign(item, {
              quantity: row.quantity || 0,
              unit: row.unit || 'kg', 
              costPerUnit: costPerUnit,
              reorderPoint: 10,             // 👈 给一个默认的低库存触发值 (比如 10)
              reorderQuantity: 0,
              expirationDate: row.expirationDate || null,
              daysBeforeExpiryAlert: row.daysBeforeExpiryAlert || 7
            });
          } else {
            Object.assign(item, {
              totalQuantity: row.totalQuantity || 1,
              availableQuantity: row.availableQuantity || row.totalQuantity || 1
            });
          }
          
          return item;
        });
        
        // Save all items
        let successCount = 0;
        let failCount = 0;
        
        for (const item of itemsToSave) {
          try {
            console.log('Sending item to backend:', JSON.stringify(item, null, 2));
            await axios.post(
              API_URL + '/inventory/items',
              item,
              { headers: getAuthHeaders() }
            );
            successCount++;
          } catch (error) {
            console.error('Error saving item:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error details:', error.response?.data?.error || error.message);
            failCount++;
          }
        }
        
        if (successCount > 0) {
          alert(`Successfully added ${successCount} item${successCount !== 1 ? 's' : ''}${failCount > 0 ? `. ${failCount} item${failCount !== 1 ? 's' : ''} failed.` : ''}`);
          // Clear the inline table
          targetArray.value = [];
          await loadItems();
          await loadStatistics();
          await loadLowStockAlerts();
          await loadExpiringItems();
        } else {
          alert('Failed to add items. Please check the data and try again.');
        }
      } catch (error) {
        console.error('Error in bulk save:', error);
        alert('Failed to save items');
      } finally {
        saving.value = false;
      }
    };
    
    // Existing helper methods
    // Replace the existing editItem function with this:
    const editItem = (item) => {
      editingItem.value = item;
      itemForm.value = { ...item };

      itemForm.value.lowStockThreshold = item.lowStockThreshold || item.reorderPoint || (item.itemType === 'consumable' ? 10 : 5);
      
      // 1. Calculate totalPrice for the frontend form
      if (item.itemType === 'consumable') {
        itemForm.value.totalPrice = (item.quantity || 0) * (item.costPerUnit || 0);
      }
      
      // 2. Format the date properly so the HTML input can read it
      if (item.expirationDate) {
        itemForm.value.expirationDate = new Date(item.expirationDate).toISOString().split('T')[0];
      }

      if (!itemForm.value.supplier) {
        itemForm.value.supplier = { name: '', contact: '', email: '' };
      }
      
      // Ensure the modal actually opens
      showAddItemModal.value = true; 
    };
    
    const adjustStock = (item) => {
      adjustingItem.value = item;
      stockAdjustment.value = {
        type: 'add',
        quantity: 0,
        reason: ''
      };
    };
    
    const calculateNewStock = () => {
      if (!adjustingItem.value) return 0;
      
      const current = adjustingItem.value.quantity;
      const adj = stockAdjustment.value.quantity || 0;
      
      switch (stockAdjustment.value.type) {
        case 'add':
          return current + adj;
        case 'subtract':
          return Math.max(0, current - adj);
        case 'set':
          return adj;
        default:
          return current;
      }
    };
    
    const confirmStockAdjustment = async () => {
      saving.value = true;
      try {
        let adjustment = 0;
        
        switch (stockAdjustment.value.type) {
          case 'add':
            adjustment = stockAdjustment.value.quantity;
            break;
          case 'subtract':
            adjustment = -stockAdjustment.value.quantity;
            break;
          case 'set':
            adjustment = stockAdjustment.value.quantity - adjustingItem.value.quantity;
            break;
        }
        
        await axios.post(
          `${API_URL}/inventory/items/${adjustingItem.value._id}/adjust-stock`,
          {
            adjustment,
            reason: stockAdjustment.value.reason
          },
          { headers: getAuthHeaders() }
        );
        
        alert('Stock adjusted successfully');
        adjustingItem.value = null;
        await loadItems();
        await loadStatistics();
        await loadLowStockAlerts();
      } catch (error) {
        console.error('Error adjusting stock:', error);
        alert('Failed to adjust stock');
      } finally {
        saving.value = false;
      }
    };
    
    const deleteItem = async (item) => {
      if (!confirm(`Are you sure you want to delete "${item.itemName}"?`)) return;
      
      try {
        await axios.delete(
          `${API_URL}/inventory/items/${item._id}`,
          { headers: getAuthHeaders() }
        );
        alert('Item deleted successfully');
        await loadItems();
        await loadStatistics();
        // 👇 ADD THESE TWO LINES SO THE ALERT TABS REFRESH!
        await loadLowStockAlerts();
        await loadExpiringItems();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    };
    
  const closeModal = () => {
      showAddItemModal.value = false;
      editingItem.value = null;
      itemForm.value = {
        itemType: 'consumable',
        itemName: '',
        category: '',
        description: '',
        quantity: 0,
        unit: 'kg',
        totalPrice: 0, 
        lowStockThreshold: 10,
        expirationDate: '',
        daysBeforeExpiryAlert: 7,
        totalQuantity: 0,         // 👈 Ensure this is reset
        availableQuantity: 0      // 👈 Ensure this is reset
      };
    };
    
    const formatDate = (date) => {
      if (!date) return '-';
      return new Date(date).toLocaleDateString();
    };
    
    const formatNumber = (num) => {
      return num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    
    const getStatusClass = (status) => {
      const classMap = {
        'active': 'success',
        'low-stock': 'warning',
        'out-of-stock': 'danger',
        'expiring-soon': 'warning',
        'expired': 'danger'
      };
      return classMap[status] || 'secondary';
    };

    const getItemStatus = (item) => {
      if (item.itemType === 'consumable') {
        if (item.quantity <= 0) return 'out-of-stock';
        
        const threshold = item.lowStockThreshold || item.reorderPoint || 10;
        if (item.quantity <= threshold) return 'low-stock';
        
        if (item.expirationDate) {
          const now = new Date();
          const exp = new Date(item.expirationDate);
          if (exp < now) return 'expired';
          
          const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
          if (days > 0 && days <= (item.daysBeforeExpiryAlert || 7)) return 'expiring-soon';
        }
      } else {
        // Equipment
        if (item.availableQuantity <= 0) return 'out-of-stock';
        const threshold = item.lowStockThreshold || item.reorderPoint || 5;
        if (item.availableQuantity <= threshold) return 'low-stock';
      }
      return 'active'; // Default good status
    };

    // 2. Make sure your formatStatus function doesn't crash on empty values
    const formatStatus = (status) => {
      if (!status) return 'Active';
      return status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };
    
    const isExpiringSoon = (item) => {
      if (!item.expirationDate) return false;
      const days = daysUntilExpiry(item.expirationDate);
      return days > 0 && days <= (item.daysBeforeExpiryAlert || 7);
    };
    
    const daysUntilExpiry = (date) => {
      return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    };
    
    onMounted(async () => {
      console.log('CateringProviderInventory mounted');
      try {
        await loadStatistics();
        await loadItems();
        await loadLowStockAlerts();
        await loadExpiringItems();
      } catch (error) {
        console.error('Error loading inventory data:', error);
      }
    });
    
    return {
      activeTab,
      loading,
      saving,
      searchQuery,
      filterCategory,
      items,
      lowStockItems,
      expiringItems,
      statistics,
      showAddItemModal,
      editingItem,
      adjustingItem,
      showBulkAddModal,
      bulkItemType,
      bulkItems,
      bulkConsumables,
      bulkEquipment,
      itemForm,
      stockAdjustment,
      tabs,
      filteredConsumables,
      filteredEquipment,
      loadItems,
      saveItem,
      editItem,
      adjustStock,
      calculateNewStock,
      confirmStockAdjustment,
      deleteItem,
      closeModal,
      addBulkRow,
      removeBulkRow,
      saveBulkItems,
      formatDate,
      formatNumber,
      formatStatus,
      getStatusClass,
      getItemStatus,
      isExpiringSoon,
      daysUntilExpiry
    };
  }
};
</script>

<style scoped>

/* 🌟 高端弹窗核心样式 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px); /* 背景模糊，非常高级 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-window {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: modalPop 0.3s ease-out;
}

.modal-window.mini { max-width: 450px; }

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f8fafc;
}

.header-title h3 { font-size: 20px; font-weight: 800; color: #0f172a; margin: 0; }
.header-title p { font-size: 13px; color: #64748b; margin: 4px 0 0; }

.btn-close-x {
  background: #e2e8f0;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-close-x:hover { background: #fee2e2; color: #ef4444; }

.modal-body-scroll {
  padding: 32px;
  overflow-y: auto;
  flex: 1;
}

.modal-body { padding: 32px; }

/* 表单布局 */
.form-section-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  margin: 24px 0 16px;
}
.form-section-title:first-child { margin-top: 0; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group.full { grid-column: span 2; }

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

/* 输入框样式对齐 Add Package */
.form-input-modern, .form-select-modern, .form-textarea-modern {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  background: #f8fafc;
  transition: all 0.2s;
}
.form-input-modern:focus { border-color: #3b82f6; background: white; outline: none; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }

/* 类型选择器卡片样式 */
.type-selection-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.type-card {
  border: 2px solid #f1f5f9;
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
}
.type-card.active { border-color: #3b82f6; background: #eff6ff; }
.type-card input { display: none; }
.type-icon { font-size: 24px; }
.type-info strong { display: block; font-size: 14px; color: #1e293b; }
.type-info span { font-size: 11px; color: #64748b; }

/* 库存调整预览卡片 */
.adjustment-preview-card {
  background: #0f172a;
  color: white;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  position: relative;
}
.preview-side { display: flex; flex-direction: column; align-items: center; }
.preview-label { font-size: 10px; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
.preview-value { font-size: 28px; font-weight: 800; }
.preview-value.highlight { color: #3b82f6; }
.preview-arrow { font-size: 20px; opacity: 0.5; }
.preview-unit { position: absolute; bottom: 8px; right: 16px; font-size: 12px; color: #475569; }

/* 调整类型切换组 */
.action-toggle-group {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
}
.action-toggle-group button {
  flex: 1;
  padding: 8px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}
.action-toggle-group button.active { background: white; color: #3b82f6; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

/* 底部按钮 */
.modal-footer-modern {
  padding: 24px 32px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn-cancel { padding: 12px 24px; border: none; background: #e2e8f0; color: #475569; border-radius: 12px; font-weight: 600; cursor: pointer; }
.btn-save { padding: 12px 24px; border: none; background: #0f172a; color: white; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-save:hover { background: #1e293b; transform: translateY(-1px); }

.large-font { font-size: 24px; font-weight: 700; text-align: center; }
.input-with-badge { position: relative; }
.input-unit-badge { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-weight: 700; color: #94a3b8; }
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
}

.btn-icon:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.btn-icon.delete:hover {
  color: #ef4444;
  background: #fef2f2;
}

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
.stat-icon.emerald { background: #ecfdf5; color: #10b981; }
.stat-icon.amber { background: #fffbeb; color: #f59e0b; }
.stat-icon.purple { background: #f3e8ff; color: #a855f7; }

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

/* Tabs */
.tabs {
  display: flex;
  gap: 2px;
  background: #e2e8f0;
  padding: 4px;
  border-radius: 12px;
  width: fit-content;
  margin-bottom: 24px;
}

.tab-btn {
  padding: 10px 24px;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.badge-count {
  background: #eff6ff;
  color: #3b82f6;
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
}

.tab-btn.active .badge-count {
  background: #3b82f6;
  color: white;
}

/* Content Sections */
.bulk-entry-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
  border: 1px solid #e2e8f0;
}

.content-header, .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.content-header h3, .card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-actions-inline {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Tables */
.table-container, .bulk-table-container {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.bulk-table-container {
  max-height: 400px;
  overflow-y: auto;
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

.category-pill {
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
}

/* Green for Active */
.status-pill.success { background: #ecfdf5; color: #10b981; border: 1px solid #a7f3d0; }
/* Orange for Low Stock / Expiring */
.status-pill.warning { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
/* Red for Out of Stock / Expired */
.status-pill.danger { background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; }
/* Gray fallback */
.status-pill.secondary { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }

.badge-warning-xs {
  background: #fff7ed;
  color: #c2410c;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #ffedd5;
  margin-left: 8px;
}

/* Forms & Inputs */
.form-input-sm, .form-select-sm {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.2s;
}

.form-input-sm:focus, .form-select-sm:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input-sm.error, .form-select-sm.error {
  border-color: #ef4444;
  background: #fef2f2;
}

/* Search Filters */
.table-actions {
  display: flex;
  gap: 16px;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #475569;
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.form-group {
  margin-bottom: 20px;
}

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
}

.form-select:focus, .form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.text-sm { font-size: 12px; color: #64748b; margin-top: 4px; }

/* Stock Adjustment Modal */
.stock-info-card {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
}

.current-stock strong {
  display: block;
  font-size: 24px;
  color: #3b82f6;
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
}

/* 批量表格专用删除按钮 */
.btn-icon-danger.square {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.btn-icon-danger.square:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

/* ================= 🌟 智能警报看板专属高级样式 🌟 ================= */
.alerts-container-grid {
  display: grid;
  /* 自动响应式：屏幕大时并排多列，屏幕小时自动单列 */
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.modern-alert-card {
  display: flex;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.04);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-alert-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px -3px rgba(15, 23, 42, 0.08);
}

/* 侧边立体颜色条 (橙色和红色) */
.modern-alert-card.amber .alert-indicator {
  width: 6px;
  background: linear-gradient(to bottom, #f59e0b, #d97706);
}
.modern-alert-card.red .alert-indicator {
  width: 6px;
  background: linear-gradient(to bottom, #ef4444, #dc2626);
}

.alert-content-wrapper {
  display: flex;
  flex: 1;
  padding: 16px 20px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.alert-main-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.alert-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.item-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.category-tag {
  font-size: 11px;
  font-weight: 600;
  background: #f1f5f9;
  color: #64748b;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.alert-metrics-grid {
  display: flex;
  gap: 28px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.m-label {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.m-value {
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}

/* 核心数字颜色高亮 */
.m-value.critical-amber { color: #d97706; }
.m-value.critical-red { color: #ef4444; }

/* 快捷操作现代化胶囊按钮 */
.btn-alert-action {
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

/* Restock 按钮样式 (浅橙底，深橙字) */
.btn-alert-action.restock {
  background: #fef3c7;
  color: #b45309;
}
.btn-alert-action.restock:hover {
  background: #b45309;
  color: #ffffff;
}

/* Manage/Dispose 按钮样式 (浅红底，深红字) */
.btn-alert-action.dispose {
  background: #fee2e2;
  color: #b91c1c;
}
.btn-alert-action.dispose:hover {
  background: #b91c1c;
  color: #ffffff;
}
</style>