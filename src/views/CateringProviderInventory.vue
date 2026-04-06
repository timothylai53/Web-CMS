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
          <button @click="showAddItemModal = true" class="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>Add New Item</span>
          </button>
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
                    <td>RM {{ (item.quantity * item.costPerUnit).toFixed(2) }}</td>
                    <td>
                      <div class="expiry-cell">
                        <span>{{ item.expirationDate ? formatDate(item.expirationDate) : '-' }}</span>
                        <span v-if="isExpiringSoon(item)" class="badge-warning-xs">Expiring Soon</span>
                      </div>
                    </td>
                    <td>
                      <span :class="['status-pill', getStatusClass(item.status)]">
                        {{ formatStatus(item.status) }}
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
                          className="form-input-sm"
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
            
            <div v-else class="alerts-grid">
              <div v-for="item in lowStockItems" :key="item._id" class="alert-card low-stock">
                <div class="alert-header">
                  <div class="alert-icon-wrapper warning">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div class="alert-content">
                     <h4>{{ item.itemName }}</h4>
                     <p>{{ item.category }}</p>
                  </div>
                </div>
                
                <div class="alert-body">
                  <div class="alert-row">
                    <span>Current Stock</span>
                    <span class="text-warning font-bold">{{ item.quantity }} {{ item.unit }}</span>
                  </div>
                  <div class="alert-row">
                     <span>Reorder Level</span>
                     <span>{{ item.reorderPoint || 'N/A' }}</span>
                  </div>
                  <div v-if="item.supplier?.name" class="alert-row">
                     <span>Supplier</span>
                     <span>{{ item.supplier.name }}</span>
                  </div>
                </div>
                
                <div class="alert-footer">
                   <button @click="adjustStock(item)" class="btn-sm btn-primary full-width">Restock Now</button>
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
                   <circle cx="12" cy="12" r="10"/>
                   <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>Fresh Inventory</h3>
              <p>No items expiring soon.</p>
            </div>
            
            <div v-else class="alerts-grid">
               <div v-for="item in expiringItems" :key="item._id" class="alert-card expiring">
                <div class="alert-header">
                  <div class="alert-icon-wrapper danger">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <div class="alert-content">
                     <h4>{{ item.itemName }}</h4>
                     <p>{{ item.category }}</p>
                  </div>
                </div>
                
                <div class="alert-body">
                  <div class="alert-row">
                    <span>Expiration Date</span>
                    <span class="text-danger font-bold">{{ formatDate(item.expirationDate) }}</span>
                  </div>
                  <div class="alert-row">
                     <span>Days Remaining</span>
                     <span class="text-danger">{{ daysUntilExpiry(item.expirationDate) }} days</span>
                  </div>
                  <div class="alert-row">
                     <span>Stock</span>
                     <span>{{ item.quantity }} {{ item.unit }}</span>
                  </div>
                  <div class="alert-row">
                     <span>Value at Risk</span>
                     <span>RM {{ (item.quantity * item.costPerUnit).toFixed(2) }}</span>
                  </div>
                </div>
                
                <div class="alert-footer">
                   <button @click="editItem(item)" class="btn-sm btn-outline-danger full-width">Update / Dispose</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>

    <!-- Modal for Add/Edit -->
    <div v-if="showAddItemModal || editingItem" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ editingItem ? 'Edit Item' : 'New Inventory Item' }}</h3>
          <button @click="closeModal" class="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
           <div class="form-group" v-if="!editingItem">
             <label ref="typeLabel">Item Type</label>
             <div class="type-selector">
                <label class="radio-card" :class="{ active: itemForm.itemType === 'consumable' }">
                  <input type="radio" v-model="itemForm.itemType" value="consumable">
                  <span class="radio-label">Raw Material</span>
                  <span class="radio-desc">Consumables like ingredients</span>
                </label>
                <label class="radio-card" :class="{ active: itemForm.itemType === 'equipment' }">
                  <input type="radio" v-model="itemForm.itemType" value="equipment">
                  <span class="radio-label">Equipment</span>
                  <span class="radio-desc">Reusable tools & assets</span>
                </label>
             </div>
           </div>

           <div class="form-row">
             <div class="form-group">
               <label>Item Name *</label>
               <input v-model="itemForm.itemName" type="text" class="form-input" placeholder="e.g. Basmati Rice">
             </div>
             <div class="form-group">
               <label>Category *</label>
               <select v-model="itemForm.category" class="form-select">
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
           </div>

           <!-- Consumable Specifics -->
           <template v-if="itemForm.itemType === 'consumable'">
             <div class="form-row three-col">
               <div class="form-group">
                 <label>Quantity *</label>
                 <input v-model.number="itemForm.quantity" type="number" min="0" step="0.01" class="form-input">
               </div>
               <div class="form-group">
                 <label>Unit *</label>
                 <select v-model="itemForm.unit" class="form-select">
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="liter">L</option>
                    <option value="ml">ml</option>
                    <option value="pieces">pcs</option>
                    <option value="boxes">box</option>
                    <option value="bags">bag</option>
                 </select>
               </div>
               <div class="form-group">
                 <label>Total Price (RM)</label>
                 <input v-model.number="itemForm.totalPrice" type="number" step="0.01" class="form-input">
               </div>
             </div>
             
             <div class="form-row">
               <div class="form-group">
                 <label>Expiration Date</label>
                 <input v-model="itemForm.expirationDate" type="date" class="form-input">
               </div>
               <div class="form-group">
                 <label>Alert Days Before</label>
                 <input v-model.number="itemForm.daysBeforeExpiryAlert" type="number" class="form-input" placeholder="7">
               </div>
             </div>
           </template>

           <!-- Equipment Specifics -->
           <template v-else>
              <div class="form-row">
                 <div class="form-group">
                   <label>Total Quantity *</label>
                   <input v-model.number="itemForm.totalQuantity" type="number" min="1" class="form-input">
                 </div>
              </div>
           </template>
           
           <div class="form-group">
              <label>Description</label>
              <textarea v-model="itemForm.description" rows="2" class="form-textarea"></textarea>
           </div>
           
           <div class="modal-section-title">Supplier Info</div>
           <div class="form-row">
              <div class="form-group">
                 <label>Supplier Name</label>
                 <input v-model="itemForm.supplier.name" type="text" class="form-input" placeholder="Optional">
              </div>
              <div class="form-group">
                 <label>Storage Location</label>
                 <input v-model="itemForm.storageLocation" type="text" class="form-input" placeholder="e.g. Shelf A">
              </div>
           </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="btn-ghost">Cancel</button>
          <button @click="saveItem" class="btn-primary" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Item' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stock Adjustment Modal -->
    <div v-if="adjustingItem" class="modal-backdrop" @click.self="adjustingItem = null">
      <div class="modal-card">
        <div class="modal-header">
           <h3>Adjust Stock: {{ adjustingItem.itemName }}</h3>
           <button @click="adjustingItem = null" class="btn-icon">&times;</button>
        </div>
        <div class="modal-body">
           <div class="stock-summary-card">
              <div class="current-stat">
                 <span class="label">Current Level</span>
                 <span class="value">{{ adjustingItem.quantity }} {{ adjustingItem.unit }}</span>
              </div>
              <div class="arrow">→</div>
              <div class="new-stat">
                 <span class="label">New Level</span>
                 <span class="value text-primary">{{ calculateNewStock() }} {{ adjustingItem.unit }}</span>
              </div>
           </div>

           <div class="form-group">
             <label>Adjustment Action</label>
             <select v-model="stockAdjustment.type" class="form-select">
               <option value="add">Add Stock (Restock)</option>
               <option value="subtract">Subtract Stock (Used/Wasted)</option>
               <option value="set">Set Exact Quantity (Audit)</option>
             </select>
           </div>
           
           <div class="form-group">
             <label>{{ stockAdjustment.type === 'set' ? 'Actual Quantity' : 'Quantity Change' }}</label>
             <input v-model.number="stockAdjustment.quantity" type="number" min="0" step="0.01" class="form-input" autofocus>
           </div>

           <div class="form-group">
              <label>Reason</label>
              <textarea v-model="stockAdjustment.reason" rows="2" class="form-textarea" placeholder="Why is this changing?"></textarea>
           </div>
        </div>
        <div class="modal-footer">
           <button @click="adjustingItem = null" class="btn-ghost">Cancel</button>
           <button @click="confirmStockAdjustment" class="btn-primary" :disabled="saving">Confirm Adjustment</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';

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
    
    const itemForm = ref({
      itemType: 'consumable',
      itemName: '',
      category: '',
      description: '',
      quantity: 0,
      unit: 'kg',
      reorderPoint: 0,
      reorderQuantity: 0,
      costPerUnit: 0,
      expirationDate: '',
      daysBeforeExpiryAlert: 7,
      totalQuantity: 0,
      supplier: {
        name: '',
        contact: '',
        email: ''
      },
      storageLocation: '',
      notes: ''
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
        const response = await axios.get('http://localhost:5000/api/inventory/statistics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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
          itemType: activeTab.value === 'equipment' ? 'equipment' : 'consumable',
          search: searchQuery.value,
          category: filterCategory.value
        };
        
        const response = await axios.get('http://localhost:5000/api/inventory/items', {
          params,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        items.value = response.data;
      } catch (error) {
        console.error('Error loading items:', error);
      } finally {
        loading.value = false;
      }
    };
    
    const loadLowStockAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/inventory/alerts/low-stock', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        lowStockItems.value = response.data;
      } catch (error) {
        console.error('Error loading low stock alerts:', error);
      }
    };
    
    const loadExpiringItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/inventory/alerts/expiring', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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
        
        // Set default values for reorder fields (since we removed them)
        if (itemData.itemType === 'consumable') {
          itemData.reorderPoint = 0;
          itemData.reorderQuantity = 0;
        }
        
        if (editingItem.value) {
          await axios.put(
            `http://localhost:5000/api/inventory/items/${editingItem.value._id}`,
            itemData,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          alert('Item updated successfully');
        } else {
          await axios.post(
            'http://localhost:5000/api/inventory/items',
            itemData,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );
          alert('Item added successfully');
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
              unit: row.unit || 'kg',  // Ensure unit has a default value
              costPerUnit: costPerUnit,
              reorderPoint: 0,
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
              'http://localhost:5000/api/inventory/items',
              item,
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
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
    const editItem = (item) => {
      editingItem.value = item;
      itemForm.value = { ...item };
      if (!itemForm.value.supplier) {
        itemForm.value.supplier = { name: '', contact: '', email: '' };
      }
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
          `http://localhost:5000/api/inventory/items/${adjustingItem.value._id}/adjust-stock`,
          {
            adjustment,
            reason: stockAdjustment.value.reason
          },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
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
          `http://localhost:5000/api/inventory/items/${item._id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        alert('Item deleted successfully');
        await loadItems();
        await loadStatistics();
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
        reorderPoint: 0,
        reorderQuantity: 0,
        costPerUnit: 0,
        expirationDate: '',
        daysBeforeExpiryAlert: 7,
        totalQuantity: 0,
        supplier: { name: '', contact: '', email: '' },
        storageLocation: '',
        notes: ''
      };
    };
    
    const formatDate = (date) => {
      if (!date) return '-';
      return new Date(date).toLocaleDateString();
    };
    
    const formatNumber = (num) => {
      return num.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    
    const formatStatus = (status) => {
      return status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
      isExpiringSoon,
      daysUntilExpiry
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

.status-pill.good { background: #ecfdf5; color: #10b981; }
.status-pill.low { background: #fffbeb; color: #d97706; }
.status-pill.out { background: #fef2f2; color: #ef4444; }

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
</style>