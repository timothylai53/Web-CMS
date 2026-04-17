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
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
          </div>
          <p>You haven't created any packages yet.</p>
          <button @click="openPackageModal()" class="btn-secondary-action">Create First Package</button>
        </div>

        <div class="packages-grid">
          <div v-for="pkg in packages" :key="pkg.id || pkg._id" class="package-card">
            <div class="pkg-image-wrap">
              <img v-if="pkg.image" :src="resolveImageUrl(pkg.image)" :alt="pkg.name" class="pkg-image" />
              <div v-else class="pkg-image-placeholder">No Image</div>
            </div>
            <div class="pkg-header">
              <h4>{{ pkg.name }}</h4>
              <span class="pkg-category-badge">{{ pkg.category }}</span>
            </div>
            
            <div class="pkg-price-row">
              <span class="currency">RM</span>
              <span class="amount">{{ pkg.price?.toFixed(2) }}</span>
              <span class="per-pax">/ pax</span>
            </div>
            <div
              v-if="pkg.discountEnabled && Number(pkg.discountMinPax) > 0 && Number(pkg.discountedPrice) >= 0"
              class="helper-text"
            >
              Discount: {{ Number(pkg.discountMinPax) }}+ pax at RM {{ Number(pkg.discountedPrice).toFixed(2) }} / pax
            </div>
            
            <p class="pkg-desc">{{ pkg.description || 'No description provided.' }}</p>
            
            <div class="pkg-meta">
              <div class="meta-item">
                <span class="label">Min Pax</span>
                <span class="value">{{ pkg.minPax || pkg.maxPax || 1 }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Waiters</span>
                <span class="value">{{ pkg.waitersAvailable ? `${pkg.waiterQuantity || 0} included` : 'Not available' }}</span>
              </div>
              <div class="meta-item" v-if="pkg.waitersAvailable">
                <span class="label">Waiter Fee</span>
                <span class="value">RM {{ Number(pkg.waiterFee || 0).toFixed(2) }} each</span>
              </div>
              <div class="meta-item">
                <span class="label">Venue</span>
                <span class="value">{{ pkg.venueAvailable ? `Included option (RM ${Number(pkg.venueFee || 0).toFixed(2)})` : 'Not available' }}</span>
              </div>
              <div class="meta-item">
                <span class="label">Food Limits</span>
                <span class="value">M {{ pkg.mainDishLimit || 8 }} • S {{ pkg.sideDishLimit || 5 }} • B {{ pkg.beverageLimit || 3 }} • D {{ pkg.dessertLimit || 3 }}</span>
              </div>
              <div class="meta-item" v-if="pkg.discountEnabled && Number(pkg.discountMinPax) > 0 && Number(pkg.discountedPrice) >= 0">
                <span class="label">Bulk Discount</span>
                <span class="value">{{ Number(pkg.discountMinPax) }}+ pax → RM {{ Number(pkg.discountedPrice).toFixed(2) }}/pax</span>
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

          <div v-if="selectedPackageForAdd" class="quick-search-row">
            <div class="search-wrapper">
              <input
                type="text"
                v-model="foodSearch"
                placeholder="Search by food name..."
                class="form-input-compact"
              />
            </div>
            <div class="select-wrapper">
              <select v-model="foodCategoryFilter" class="form-select-compact">
                <option value="all">All Categories</option>
                <option value="rice">Rice</option>
                <option value="main">Main Dish</option>
                <option value="side">Side Dish</option>
                <option value="drink">Drink</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>
            <div class="select-wrapper">
              <select v-model="foodAvailabilityFilter" class="form-select-compact">
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
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
              <div class="input-wrapper">
                <input type="file" accept="image/*" @change="onQuickFoodImageChange" class="form-input-compact" />
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
                  <th>No.</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!selectedPackageForAdd">
                  <td colspan="5" class="empty-cell">
                    <div class="empty-state-small">
                      Please select a package above to manage its food items.
                    </div>
                  </td>
                </tr>
                <tr v-else-if="filteredFoods.length === 0">
                  <td colspan="5" class="empty-cell">
                     <div class="empty-state-small">
                      No items found in this package. Add one above!
                    </div>
                  </td>
                </tr>
                <tr v-for="(food, index) in filteredFoods" :key="food._id || food.id">
                  <td>
                    <span class="item-number">{{ index + 1 }}</span>
                  </td>
                  <td>
                    <div class="food-info">
                      <img v-if="food.image" :src="resolveImageUrl(food.image)" alt="Food image" class="food-thumbnail" />
                      <div v-else class="food-icon-placeholder">
                        <svg v-if="food.category === 'rice'" class="food-category-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18"></path><path d="M5 12a7 7 0 0 0 14 0"></path></svg>
                        <svg v-else-if="food.category === 'main'" class="food-category-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18"></path><path d="M5 11V9a7 7 0 0 1 14 0v2"></path><path d="M7 11v2"></path><path d="M17 11v2"></path></svg>
                        <svg v-else-if="food.category === 'side'" class="food-category-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10h16"></path><path d="M6 10a6 6 0 0 0 12 0"></path><path d="M8 10v2"></path><path d="M12 10v3"></path><path d="M16 10v2"></path></svg>
                        <svg v-else-if="food.category === 'drink'" class="food-category-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8l-1 8a4 4 0 0 1-8 0L8 3z"></path><path d="M12 11v8"></path><path d="M9 19h6"></path></svg>
                        <svg v-else-if="food.category === 'dessert'" class="food-category-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16"></path><path d="M6 20l2-8h8l2 8"></path><path d="M9 12V9a3 3 0 0 1 6 0v3"></path></svg>
                        <svg v-else class="food-category-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18"></path><path d="M5 12a7 7 0 0 0 14 0"></path></svg>
                      </div>
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
                  <label>Min Pax</label>
                  <input v-model.number="packageForm.minPax" type="number" min="1" class="form-input" />
                </div>
              </div>

              <div class="form-group">
                <label>Bulk Pax Discount</label>
                <div class="waiter-option-row">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="packageForm.discountEnabled">
                    <span>Enable discounted per-pax price above a pax threshold</span>
                  </label>
                </div>
              </div>

              <div class="form-row" v-if="packageForm.discountEnabled">
                <div class="form-group half">
                  <label>Discount Starts At (Pax)</label>
                  <input
                    v-model.number="packageForm.discountMinPax"
                    type="number"
                    :min="Math.max(2, Number(packageForm.minPax) || 1)"
                    class="form-input"
                  />
                </div>
                <div class="form-group half">
                  <label>Discounted Price per Pax (RM)</label>
                  <input v-model.number="packageForm.discountedPrice" type="number" min="0" step="0.01" class="form-input" />
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

              <div class="form-group">
                <label>Package Image (optional)</label>
                <input type="file" accept="image/*" @change="onPackageImageChange" class="form-input" />
                <small v-if="packageForm.image" class="helper-text">Current image attached.</small>
              </div>

              <div class="form-group">
                <label>Waiter Service</label>
                <div class="waiter-option-row">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="packageForm.waitersAvailable">
                    <span>Enable waiter service for this package</span>
                  </label>
                </div>
              </div>

              <div class="form-group" v-if="packageForm.waitersAvailable">
                <label>Waiter Quantity</label>
                <input v-model.number="packageForm.waiterQuantity" type="number" min="1" class="form-input" />
                <small class="helper-text">Customers can optionally choose this waiter service.</small>
              </div>

              <div class="form-group" v-if="packageForm.waitersAvailable">
                <label>Fee Per Waiter (RM)</label>
                <input v-model.number="packageForm.waiterFee" type="number" min="0" step="0.01" class="form-input" />
                <small class="helper-text">This fee is added only when customer ticks waiter service.</small>
              </div>

              <div class="form-group">
                <label>Venue Option</label>
                <div class="waiter-option-row">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="packageForm.venueAvailable">
                    <span>Allow customer to add venue for this package</span>
                  </label>
                </div>
              </div>

              <div class="form-group" v-if="packageForm.venueAvailable">
                <label>Venue Price (RM)</label>
                <input v-model.number="packageForm.venueFee" type="number" min="0" step="0.01" class="form-input" />
                <small class="helper-text">This venue fee is added only when customer selects venue.</small>
              </div>

              <div class="form-group">
                <label>Food Selection Limits (per category)</label>
                <div class="form-row">
                  <div class="form-group half">
                    <label>Main Dish Limit</label>
                    <input v-model.number="packageForm.mainDishLimit" type="number" min="1" class="form-input" />
                  </div>
                  <div class="form-group half">
                    <label>Side Dish Limit</label>
                    <input v-model.number="packageForm.sideDishLimit" type="number" min="1" class="form-input" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group half">
                    <label>Beverage Limit</label>
                    <input v-model.number="packageForm.beverageLimit" type="number" min="1" class="form-input" />
                  </div>
                  <div class="form-group half">
                    <label>Dessert Limit</label>
                    <input v-model.number="packageForm.dessertLimit" type="number" min="1" class="form-input" />
                  </div>
                </div>
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
                <label>Item Image (optional)</label>
                <input type="file" accept="image/*" @change="onFoodImageChange" class="form-input" />
                <small v-if="foodForm.image" class="helper-text">Current image attached.</small>
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
import { menuAPI } from '@/services/api'
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
        minPax: 1,
        discountEnabled: false,
        discountMinPax: null,
        discountedPrice: null,
        category: 'basic',
        image: '',
        imageFile: null,
        waitersAvailable: false,
        waiterQuantity: 1,
        waiterFee: 0,
        venueAvailable: false,
        venueFee: 0,
        mainDishLimit: 8,
        sideDishLimit: 5,
        beverageLimit: 3,
        dessertLimit: 3
      },
      foodForm: {
        name: '',
        category: 'main',
        image: '',
        imageFile: null,
        packageIds: []
      },
      // Using only quick add for foods now for cleaner UI
      selectedPackageForAdd: '', 
      foodSearch: '',
      foodCategoryFilter: 'all',
      foodAvailabilityFilter: 'all',
      newFood: {
        name: '',
        category: '',
        image: '',
        imageFile: null,
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
      const keyword = this.foodSearch.trim().toLowerCase()
      return this.foods
        .filter(food => {
          const selectedId = String(this.selectedPackageForAdd)
          return (food.packageIds || []).some(pkgId => String(pkgId?._id || pkgId?.id || pkgId) === selectedId)
        })
        .filter(food => {
          if (!keyword) return true
          return String(food.name || '').toLowerCase().includes(keyword)
        })
        .filter(food => {
          if (this.foodCategoryFilter === 'all') return true
          return food.category === this.foodCategoryFilter
        })
        .filter(food => {
          if (this.foodAvailabilityFilter === 'all') return true
          if (this.foodAvailabilityFilter === 'available') return !!food.available
          return !food.available
        })
    }
  },
  methods: {
    openPackageModal() {
      this.editingPackage = null
      this.packageForm = {
        name: '',
        price: 0,
        description: '',
        minPax: 1,
        discountEnabled: false,
        discountMinPax: null,
        discountedPrice: null,
        category: 'basic',
        image: '',
        imageFile: null,
        waitersAvailable: false,
        waiterQuantity: 1,
        waiterFee: 0,
        venueAvailable: false,
        venueFee: 0,
        mainDishLimit: 8,
        sideDishLimit: 5,
        beverageLimit: 3,
        dessertLimit: 3
      }
      this.showAddPackage = true
    },
    editPackage(pkg) {
      this.editingPackage = pkg
      this.packageForm = {
        ...pkg,
        image: pkg.image || '',
        imageFile: null,
        minPax: Number(pkg.minPax) > 0 ? Number(pkg.minPax) : (Number(pkg.maxPax) > 0 ? Number(pkg.maxPax) : 1),
        discountEnabled: !!pkg.discountEnabled,
        discountMinPax: Number(pkg.discountMinPax) > 0 ? Number(pkg.discountMinPax) : null,
        discountedPrice: Number(pkg.discountedPrice) >= 0 ? Number(pkg.discountedPrice) : null,
        waitersAvailable: !!pkg.waitersAvailable,
        waiterQuantity: Number(pkg.waiterQuantity) > 0 ? Number(pkg.waiterQuantity) : 1,
        waiterFee: Number(pkg.waiterFee) >= 0 ? Number(pkg.waiterFee) : 0,
        venueAvailable: !!pkg.venueAvailable,
        venueFee: Number(pkg.venueFee) >= 0 ? Number(pkg.venueFee) : 0,
        mainDishLimit: Number(pkg.mainDishLimit) > 0 ? Number(pkg.mainDishLimit) : 8,
        sideDishLimit: Number(pkg.sideDishLimit) > 0 ? Number(pkg.sideDishLimit) : 5,
        beverageLimit: Number(pkg.beverageLimit) > 0 ? Number(pkg.beverageLimit) : 3,
        dessertLimit: Number(pkg.dessertLimit) > 0 ? Number(pkg.dessertLimit) : 3
      }
      this.showAddPackage = true
    },
    async deletePackage(id) {
      if (confirm('Delete this package? This cannot be undone.')) {
        const menuStore = useMenuStore()
        try {
          await menuStore.deletePackage(id)
        } catch (error) {
          alert(error.response?.data?.message || 'Failed to delete package.')
        }
      }
    },
    async savePackage() {
      const menuStore = useMenuStore()
      const authStore = useAuthStore()
      try {
        const basePrice = Math.max(0, Number(this.packageForm.price) || 0)
        const minPax = Math.max(1, Number(this.packageForm.minPax) || 1)
        const hasDiscount = !!this.packageForm.discountEnabled
        const discountMinPax = hasDiscount
          ? Math.max(minPax, Number(this.packageForm.discountMinPax) || minPax)
          : null
        const discountedPrice = hasDiscount
          ? Math.max(0, Number(this.packageForm.discountedPrice))
          : null

        if (hasDiscount && !Number.isFinite(discountedPrice)) {
          alert('Please enter a valid discounted price.')
          return
        }
        if (hasDiscount && discountedPrice >= basePrice) {
          alert('Discounted price must be lower than normal price per pax.')
          return
        }

        const payload = {
          name: this.packageForm.name,
          price: basePrice,
          description: this.packageForm.description,
          minPax,
          discountEnabled: hasDiscount,
          discountMinPax,
          discountedPrice,
          category: this.packageForm.category,
          image: this.packageForm.image || null,
          waitersAvailable: !!this.packageForm.waitersAvailable,
          waiterQuantity: this.packageForm.waitersAvailable
            ? Math.max(1, Number(this.packageForm.waiterQuantity) || 1)
            : 0,
          waiterFee: this.packageForm.waitersAvailable
            ? Math.max(0, Number(this.packageForm.waiterFee) || 0)
            : 0,
          venueAvailable: !!this.packageForm.venueAvailable,
          venueFee: this.packageForm.venueAvailable
            ? Math.max(0, Number(this.packageForm.venueFee) || 0)
            : 0,
          mainDishLimit: Math.max(1, Number(this.packageForm.mainDishLimit) || 8),
          sideDishLimit: Math.max(1, Number(this.packageForm.sideDishLimit) || 5),
          beverageLimit: Math.max(1, Number(this.packageForm.beverageLimit) || 3),
          dessertLimit: Math.max(1, Number(this.packageForm.dessertLimit) || 3)
        }

        if (this.packageForm.imageFile) {
          payload.image = await this.uploadPackageImageFile(this.packageForm.imageFile)
        }

        if (this.editingPackage) {
          await menuStore.updatePackage(this.editingPackage._id || this.editingPackage.id, payload)
        } else {
          await menuStore.addPackage({ ...payload, providerId: authStore.user.id })
        }
        this.closePackageModal()
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to save package.')
      }
    },
    closePackageModal() {
      this.showAddPackage = false
      this.editingPackage = null
      this.packageForm = {
        name: '',
        price: 0,
        description: '',
        minPax: 1,
        discountEnabled: false,
        discountMinPax: null,
        discountedPrice: null,
        category: 'basic',
        image: '',
        imageFile: null,
        waitersAvailable: false,
        waiterQuantity: 1,
        waiterFee: 0,
        venueAvailable: false,
        venueFee: 0,
        mainDishLimit: 8,
        sideDishLimit: 5,
        beverageLimit: 3,
        dessertLimit: 3
      }
    },
    onPackageImageChange(event) {
      const file = event.target.files?.[0] || null
      this.packageForm.imageFile = file
    },
    async uploadPackageImageFile(file) {
      if (!file) return ''
      const formData = new FormData()
      formData.append('image', file)
      const response = await menuAPI.uploadPackageImage(formData)
      return response?.data?.imagePath || ''
    },
    openEditFoodModal(food) {
        this.editingFood = food
        this.foodForm = { 
            name: food.name,
            category: food.category,
        image: food.image || '',
        imageFile: null,
            packageIds: food.packageIds ? [...food.packageIds] : []
        }
        this.showAddFood = true
    },
    closeFoodModal() {
        this.showAddFood = false
        this.editingFood = null
        this.foodForm = { name: '', category: 'main', image: '', imageFile: null, packageIds: [] }
    },
    onFoodImageChange(event) {
      const file = event.target.files?.[0] || null
      this.foodForm.imageFile = file
    },
    onQuickFoodImageChange(event) {
      const file = event.target.files?.[0] || null
      this.newFood.imageFile = file
    },
    async uploadImageFile(file) {
      if (!file) return ''
      const formData = new FormData()
      formData.append('image', file)
      const response = await menuAPI.uploadFoodImage(formData)
      return response?.data?.imagePath || ''
    },
    async saveFood() {
        const menuStore = useMenuStore()
        try {
            const payload = {
              name: this.foodForm.name,
              category: this.foodForm.category,
              packageIds: this.foodForm.packageIds,
              image: this.foodForm.image || null
            }
            if (this.foodForm.imageFile) {
              payload.image = await this.uploadImageFile(this.foodForm.imageFile)
            }
            if (this.editingFood) {
                await menuStore.updateFoodItem(this.editingFood._id || this.editingFood.id, payload)
            } else {
                await menuStore.addFoodItem(payload)
            }
            this.closeFoodModal()
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save food.')
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
        alert(error.response?.data?.message || 'Failed to delete food item.')
      }
    },
    async saveNewFood() {
      if (!this.newFood.name || !this.newFood.category || !this.selectedPackageForAdd) return

      const menuStore = useMenuStore()
      const authStore = useAuthStore()
      
      try {
        let imagePath = this.newFood.image || null
        if (this.newFood.imageFile) {
          imagePath = await this.uploadImageFile(this.newFood.imageFile)
        }

        await menuStore.addFoodItem({
          name: this.newFood.name,
          category: this.newFood.category,
          image: imagePath,
          available: true,
          packageIds: [this.selectedPackageForAdd],
          providerId: authStore.user.id
        })
        
        // Reset form
        this.newFood = { name: '', category: '', image: '', imageFile: null, available: true }
      } catch (error) {
        alert('Failed to add food item.')
      }
    },
    resolveImageUrl(imagePath) {
      if (!imagePath) return ''
      if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
        return imagePath
      }
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const hostBase = apiUrl.replace(/\/api\/?$/, '')
      let normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
      if (normalizedPath.startsWith('/uploads/')) {
        normalizedPath = `/api${normalizedPath}`
      }
      return `${hostBase}${normalizedPath}`
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

.pkg-image-wrap {
  width: 100%;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  margin-bottom: 14px;
}

.pkg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pkg-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
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

.quick-search-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.search-wrapper {
  flex: 2;
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

.food-thumbnail {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.item-number {
  display: inline-flex;
  min-width: 24px;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  color: #475569;
}

.food-icon-placeholder {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.food-category-icon {
  color: #64748b;
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

.waiter-option-row {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
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

.helper-text {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
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
.empty-icon {
  margin-bottom: 16px;
  color: #94a3b8;
  display: flex;
  justify-content: center;
}
.empty-state-small { padding: 32px; text-align: center; color: #94a3b8; font-size: 14px; }

@media (max-width: 768px) {
  .admin-content { margin-left: 0; width: 100%; padding: 16px; padding-bottom: 80px; }
  .packages-grid { grid-template-columns: 1fr; }
  .quick-search-row { flex-direction: column; }
  .quick-add-row { flex-direction: column; }
  .btn-quick-add { width: 100%; }
}
</style>
