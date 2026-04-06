<template>
  <div class="admin-container">
    <Navbar />
    
    <div class="admin-content">
      <!-- Modern Hero -->
      <div class="dashboard-hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="hero-text">
            <h2>Menu Management</h2>
            <p>Create packages and manage your food inventory.</p>
          </div>
          <div class="stats-summary">
            <div class="stat-pill blue">
              <span class="label">Packages</span>
              <span class="value">{{ packages.length }}</span>
            </div>
            <div class="stat-pill purple">
              <span class="label">Foods</span>
              <span class="value">{{ foods.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="dashboard-section">
        <div class="tabs-bar">
          <button @click="activeTab = 'packages'" :class="['tab-btn', { active: activeTab === 'packages' }]">
            Packages
          </button>
          <button @click="activeTab = 'foods'" :class="['tab-btn', { active: activeTab === 'foods' }]">
            Food Items
          </button>
        </div>
      </div>

      <!-- Packages Section -->
      <div v-if="activeTab === 'packages'" class="dashboard-section">
        <div class="section-header">
          <h3>Your Packages</h3>
          <button @click="openPackageModal()" class="btn-primary-action">+ New Package</button>
        </div>

        <div v-if="packages.length === 0" class="empty-state">
          <div class="empty-icon">📦</div>
          <p>You haven't created any packages yet.</p>
          <button @click="openPackageModal()" class="btn-secondary-action">Create First Package</button>
        </div>

        <div class="packages-grid">
          <div v-for="pkg in packages" :key="pkg.id || pkg._id" class="package-card">
            <div class="pkg-header">
              <h4>{{ pkg.name }}</h4>
              <span class="pkg-category-badge">{{ pkg.category }}</span>
            </div>
            
            <div class="pkg-price-row">
              <span class="currency">RM</span>
              <span class="amount">{{ pkg.price?.toFixed(2) }}</span>
              <span class="per-pax">/ pax</span>
            </div>
            
            <p class="pkg-desc">{{ pkg.description || 'No description provided.' }}</p>
            
            <div class="pkg-meta">
              <div class="meta-item">
                <span class="label">Max Pax</span>
                <span class="value">{{ pkg.maxPax }}</span>
              </div>
            </div>

            <div class="pkg-actions">
              <button @click="editPackage(pkg)" class="btn-icon-edit" title="Edit">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button @click="deletePackage(pkg._id || pkg.id)" class="btn-icon-delete" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Foods Section -->
      <div v-if="activeTab === 'foods'" class="dashboard-section">
        <div class="section-header">
          <h3>Food Items</h3>
        </div>

        <!-- Inline Filter/Add Bar -->
        <div class="filter-controls-card">
          <div class="control-group">
            <label>Manage items for package:</label>
            <select v-model="selectedPackageForAdd" class="form-select">
              <option value="">Select a package to view items...</option>
              <option v-for="pkg in packages" :key="pkg._id || pkg.id" :value="pkg._id || pkg.id">
                {{ pkg.name }}
              </option>
            </select>
          </div>
          
          <div v-if="selectedPackageForAdd" class="quick-add-container">
            <div class="quick-add-row">
              <div class="input-wrapper">
                <input 
                  type="text" 
                  v-model="newFood.name" 
                  placeholder="New food name..." 
                  class="form-input-compact"
                />
              </div>
              <div class="select-wrapper">
                <select v-model="newFood.category" class="form-select-compact">
                  <option value="" disabled selected>Category</option>
                  <option value="rice">Rice</option>
                  <option value="main">Main Dish</option>
                  <option value="side">Side Dish</option>
                  <option value="drink">Drink</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
              <button 
                @click="saveNewFood" 
                class="btn-quick-add"
                :disabled="!newFood.name || !newFood.category"
              >
                + Add Item
              </button>
            </div>
          </div>
        </div>

        <div class="table-card">
          <div class="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!selectedPackageForAdd">
                  <td colspan="4" class="empty-cell">
                    <div class="empty-state-small">
                      Please select a package above to manage its food items.
                    </div>
                  </td>
                </tr>
                <tr v-else-if="filteredFoods.length === 0">
                  <td colspan="4" class="empty-cell">
                     <div class="empty-state-small">
                      No items found in this package. Add one above!
                    </div>
                  </td>
                </tr>
                <tr v-for="food in filteredFoods" :key="food._id || food.id">
                  <td>
                    <div class="food-info">
                      <div class="food-icon-placeholder">{{ getFoodIcon(food.category) }}</div>
                      <span class="food-name">{{ food.name }}</span>
                    </div>
                  </td>
                  <td>
                    <span :class="['category-pill', food.category]">{{ food.category }}</span>
                  </td>
                  <td>
                    <label class="toggle-switch">
                      <input 
                        type="checkbox" 
                        :checked="food.available"
                        @change="toggleAvailability(food._id || food.id, $event.target.checked)"
                      />
                      <span class="slider"></span>
                    </label>
                  </td>
                  <td>
                    <button @click="openEditFoodModal(food)" class="btn-icon-edit-small">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button @click="deleteFood(food)" class="btn-icon-delete-small">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <!-- Add/Edit Package Modal -->
      <div v-if="showAddPackage || editingPackage" class="modal-overlay" @click="closePackageModal">
        <div class="modal-card" @click.stop>
          <div class="modal-header">
            <h3>{{ editingPackage ? 'Edit Package' : 'New Package' }}</h3>
            <button class="modal-close-btn" @click="closePackageModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div class="modal-content-scroll">
            <form @submit.prevent="savePackage" id="packageForm">
              <div class="form-group">
                <label>Package Name</label>
                <input v-model="packageForm.name" type="text" required class="form-input" placeholder="e.g. Wedding Deluxe" />
              </div>
              
              <div class="form-row">
                <div class="form-group half">
                  <label>Price per Pax (RM)</label>
                  <input v-model.number="packageForm.price" type="number" step="0.01" required class="form-input" />
                </div>
                <div class="form-group half">
                  <label>Max Pax</label>
                  <input v-model.number="packageForm.maxPax" type="number" class="form-input" />
                </div>
              </div>

              <div class="form-group">
                <label>Category</label>
                <select v-model="packageForm.category" class="form-input">
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="deluxe">Deluxe</option>
                </select>
              </div>

              <div class="form-group">
                <label>Description</label>
                <textarea v-model="packageForm.description" rows="3" class="form-textarea" placeholder="Describe the offerings..."></textarea>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button type="button" @click="closePackageModal" class="btn-close">Cancel</button>
            <button type="submit" form="packageForm" class="btn-submit">Save Package</button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Food Modal -->
      <div v-if="showAddFood || editingFood" class="modal-overlay" @click="closeFoodModal">
        <div class="modal-card" @click.stop>
          <div class="modal-header">
            <h3>{{ editingFood ? 'Edit Food Item' : 'New Food Item' }}</h3>
            <button class="modal-close-btn" @click="closeFoodModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div class="modal-content-scroll">
            <form @submit.prevent="saveFood" id="foodForm">
              <div class="form-group">
                <label>Food Name</label>
                <input v-model="foodForm.name" type="text" required class="form-input" placeholder="e.g. Chicken Rice" />
              </div>

              <div class="form-group">
                <label>Category</label>
                <select v-model="foodForm.category" class="form-input">
                  <option value="rice">Rice</option>
                  <option value="main">Main Dish</option>
                  <option value="side">Side Dish</option>
                  <option value="drink">Drink</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>

              <div class="form-group">
                <label>Available in Packages</label>
                <div class="checkbox-group">
                  <label v-for="pkg in packages" :key="pkg._id || pkg.id" class="checkbox-label">
                    <input type="checkbox" :value="pkg._id || pkg.id" v-model="foodForm.packageIds">
                    <span>{{ pkg.name }}</span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button type="button" @click="closeFoodModal" class="btn-close">Cancel</button>
            <button type="submit" form="foodForm" class="btn-submit">Save Food Item</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { useMenuStore } from '@/stores/menu'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  data() {
    return {
      activeTab: 'packages',
      showAddPackage: false,
      showAddFood: false,
      editingPackage: null,
      editingFood: null,
      packageForm: {
        name: '',
        price: 0,
        description: '',
        maxPax: 100,
        category: 'basic'
      },
      foodForm: {
        name: '',
        category: 'main',
        packageIds: []
      },
      // Using only quick add for foods now for cleaner UI
      selectedPackageForAdd: '', 
      newFood: {
        name: '',
        category: '',
        available: true
      }
    }
  },
  computed: {
    packages() {
      const menuStore = useMenuStore()
      return menuStore.allPackages
    },
    foods() {
      const menuStore = useMenuStore()
      return menuStore.foods
    },
    filteredFoods() {
      if (!this.selectedPackageForAdd) {
        return []
      }
      return this.foods.filter(food => 
        food.packageIds && food.packageIds.includes(this.selectedPackageForAdd)
      )
    }
  },
  methods: {
    getFoodIcon(category) {
      const icons = {
        rice: '🍚',
        main: '🍖',
        side: '🥗',
        drink: '🥤',
        dessert: '🍰'
      }
      return icons[category] || '🍽️'
    },
    openPackageModal() {
      this.editingPackage = null
      this.packageForm = { name: '', price: 0, description: '', maxPax: 100, category: 'basic' }
      this.showAddPackage = true
    },
    editPackage(pkg) {
      this.editingPackage = pkg
      this.packageForm = { ...pkg }
      this.showAddPackage = true
    },
    async deletePackage(id) {
      if (confirm('Delete this package? This cannot be undone.')) {
        const menuStore = useMenuStore()
        try {
          await menuStore.deletePackage(id)
        } catch (error) {
          alert('Failed to delete package.')
        }
      }
    },
    async savePackage() {
      const menuStore = useMenuStore()
      const authStore = useAuthStore()
      try {
        if (this.editingPackage) {
          await menuStore.updatePackage(this.editingPackage._id || this.editingPackage.id, this.packageForm)
        } else {
          await menuStore.addPackage({ ...this.packageForm, providerId: authStore.user.id })
        }
        this.closePackageModal()
      } catch (error) {
        alert('Failed to save package.')
      }
    },
    closePackageModal() {
      this.showAddPackage = false
      this.editingPackage = null
    },
    openEditFoodModal(food) {
        this.editingFood = food
        this.foodForm = { 
            name: food.name,
            category: food.category,
            packageIds: food.packageIds ? [...food.packageIds] : []
        }
        this.showAddFood = true
    },
    closeFoodModal() {
        this.showAddFood = false
        this.editingFood = null
        this.foodForm = { name: '', category: 'main', packageIds: [] }
    },
    async saveFood() {
        const menuStore = useMenuStore()
        try {
            if (this.editingFood) {
                await menuStore.updateFoodItem(this.editingFood._id || this.editingFood.id, this.foodForm)
            }
            this.closeFoodModal()
        } catch (error) {
            alert('Failed to save food.')
        }
    },
    async toggleAvailability(id, available) {
      const menuStore = useMenuStore()
      try {
        await menuStore.updateFoodAvailability(id, available)
      } catch (error) {
        console.error(error)
      }
    },
    async deleteFood(food) {
      if (!confirm(`Remove "${food.name}"?`)) return
      const menuStore = useMenuStore()
      try {
        await menuStore.deleteFoodItem(food._id || food.id)
      } catch (error) {
        alert('Failed to delete food item.')
      }
    },
    async saveNewFood() {
      if (!this.newFood.name || !this.newFood.category || !this.selectedPackageForAdd) return

      const menuStore = useMenuStore()
      const authStore = useAuthStore()
      
      try {
        await menuStore.addFoodItem({
          ...this.newFood,
          packageIds: [this.selectedPackageForAdd],
          providerId: authStore.user.id
        })
        
        // Reset form
        this.newFood = { name: '', category: '', available: true }
      } catch (error) {
        alert('Failed to add food item.')
      }
    }
  },
  async mounted() {
    const menuStore = useMenuStore()
    const authStore = useAuthStore()
    // Ensure we have latest data for the current provider
    if (authStore.user?.id) {
      await menuStore.fetchPackages(authStore.user.id)
      await menuStore.fetchFoods(authStore.user.id)
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
  background: radial-gradient(circle at top right, rgba(249, 115, 22, 0.1), transparent 70%);
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
.stat-pill.purple { background: #f3e8ff; border: 1px solid #e9d5ff; }

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

.dashboard-section { margin-bottom: 32px; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

/* Tabs */
.tabs-bar {
  display: flex;
  gap: 2px;
  background: #e2e8f0;
  padding: 4px;
  border-radius: 12px;
  width: fit-content;
}

.tab-btn {
  padding: 8px 24px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: white;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Packages Grid */
.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.package-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s;
}

.package-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.pkg-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.pkg-header h4 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.pkg-category-badge {
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 600;
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 4px;
}

.pkg-price-row {
  margin-bottom: 16px;
  color: #0f172a;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.currency { font-size: 14px; font-weight: 600; color: #64748b; }
.amount { font-size: 24px; font-weight: 800; }
.per-pax { font-size: 13px; color: #94a3b8; }

.pkg-desc {
  font-size: 14px;
  color: #475569;
  margin-bottom: 20px;
  line-height: 1.5;
  height: 42px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.pkg-meta {
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.meta-item .label { color: #94a3b8; }
.meta-item .value { font-weight: 600; color: #334155; }

.pkg-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-icon-edit, .btn-icon-delete {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon-edit:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
.btn-icon-delete:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

/* Filter Controls Card */
.filter-controls-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.control-group {
  margin-bottom: 16px;
}

.control-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
}

.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
}

.quick-add-container {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}

.quick-add-row {
  display: flex;
  gap: 12px;
}

.input-wrapper { flex: 2; }
.select-wrapper { flex: 1; min-width: 120px; }

.form-input-compact, .form-select-compact {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
}

.btn-quick-add {
  background: #0f172a;
  color: white;
  border: none;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.btn-quick-add:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* Table */
.table-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
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
  vertical-align: middle;
  font-size: 14px;
}

.food-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.food-icon-placeholder {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.category-pill {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.category-pill.rice { background: #fff7ed; color: #c2410c; }
.category-pill.main { background: #fee2e2; color: #b91c1c; }
.category-pill.side { background: #dcfce7; color: #15803d; }
.category-pill.drink { background: #dbeafe; color: #1d4ed8; }
.category-pill.dessert { background: #fae8ff; color: #a21caf; }

/* Toggle */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}

.toggle-switch input { opacity: 0; width: 0; height: 0; }

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider { background-color: #10b981; }
input:checked + .slider:before { transform: translateX(16px); }

.btn-icon-delete-small {
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.btn-icon-edit-small {
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-right: 8px;
}

.btn-icon-edit-small:hover { color: #3b82f6; }
.btn-icon-delete-small:hover { color: #ef4444; }

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.btn-primary-action {
  background: #0f172a;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.btn-secondary-action {
  background:white;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 16px;
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
  max-width: 500px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-height: 90vh;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }

.modal-content-scroll { padding: 24px; overflow-y: auto; }

.form-group { margin-bottom: 16px; }
.form-row { display: flex; gap: 16px; }
.form-group.half { flex: 1; }

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
}

.form-input:focus, .form-textarea:focus { outline: none; border-color: #0f172a; }

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-close, .btn-submit {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-close { background: white; border: 1px solid #e2e8f0; color: #64748b; }
.btn-submit { background: #0f172a; border: none; color: white; }

.empty-state { text-align: center; padding: 40px; color: #94a3b8; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-state-small { padding: 32px; text-align: center; color: #94a3b8; font-size: 14px; }

@media (max-width: 768px) {
  .admin-content { margin-left: 0; width: 100%; padding: 16px; padding-bottom: 80px; }
  .packages-grid { grid-template-columns: 1fr; }
  .quick-add-row { flex-direction: column; }
  .btn-quick-add { width: 100%; }
}
</style>
