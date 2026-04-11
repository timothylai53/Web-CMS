<template>
  <div class="menu-page">
    <Navbar />
    
    <!-- Custom Notification Toast -->
    <div v-if="notification.show" class="notification-toast" :class="notification.type">
      <div class="notification-icon">
        <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <span>{{ notification.message }}</span>
    </div>
    
    <div class="menu-container">
      <!-- Modern Hero Section -->
      <div class="hero-section">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1>Select Your Catering Package</h1>
          <p class="hero-subtitle">Choose from our curated selection of premium packages</p>
        </div>
      </div>

      <!-- Package Selection -->
      <div class="packages-section">
        <div class="section-header">
          <h3>Available Packages</h3>
        </div>
        <div class="packages-grid">
          <div 
            v-for="pkg in packages" 
            :key="pkg.id" 
            class="package-card"
            :class="{ selected: selectedPackage?.id === pkg.id }"
            @click="selectPackage(pkg)"
          >
            <div class="card-banner">
              <img v-if="pkg.image" :src="resolvePackageImage(pkg.image)" :alt="pkg.name" class="package-banner-image" />
              <div v-else class="package-banner-placeholder">Package Preview</div>
              <span class="provider-badge">{{ pkg.providerId?.businessName || 'Provider' }}</span>
            </div>
            
            <div class="card-content">
              <h4>{{ pkg.name }}</h4>
              
              <div class="price">
                RM {{ pkg.price }} <span class="per-pax">/ pax</span>
              </div>
              
              <p class="description">{{ pkg.description || 'No description available for this package.' }}</p>
              
              <div class="package-meta">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span>Max {{ pkg.maxPax || 1000 }} Guests</span>
              </div>
              
              <div class="select-btn-placeholder">
                {{ selectedPackage?.id === pkg.id ? 'Selected' : 'Select Package' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <form v-if="selectedPackage" @submit.prevent="addToCart" class="order-form">
        
        <!-- Selected Package Info -->
        <div class="selected-package-banner">
          <div class="banner-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg></div>
          <div class="banner-info">
            <h4>{{ selectedPackage.name }}</h4>
            <p>RM {{ selectedPackage.price }} per pax • Up to {{ selectedPackage.maxPax }} guests</p>
          </div>
        </div>

        <!-- Number of Pax -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <div>
              <h3>Number of Guests</h3>
              <p class="section-subtitle">How many people will you be serving?</p>
            </div>
          </div>
          <div class="pax-selector">
            <button type="button" class="pax-btn" @click="numberOfPax = Math.max(1, numberOfPax - 10)">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <div class="pax-input-wrapper">
              <input type="number" v-model.number="numberOfPax" min="1" :max="selectedPackage.maxPax" required class="pax-input" />
              <span class="pax-label">Guests</span>
            </div>
            <button type="button" class="pax-btn" @click="numberOfPax = Math.min(selectedPackage.maxPax, numberOfPax + 10)">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          <div class="subtotal-card">
            <span>Package Subtotal</span>
            <strong>RM {{ packageSubtotal.toFixed(2) }}</strong>
          </div>
        </div>

        <!-- Rice Selection -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10H2a10 10 0 0 1 10-10Z"/><path d="M14 12v1M10 12v1M12 12v1.5"/><path d="M2 12h20"/></svg></div>
            <div>
              <h3>Rice Selection</h3>
              <div class="progress-badge" :class="{'completed': selectedRice.length === 2, 'selecting': selectedRice.length === 1}">
                  <span v-if="selectedRice.length === 0">[ 0 / 2 ] Choose Rice</span>
                  <span v-else-if="selectedRice.length === 1">[ 1 / 2 ] Selecting...</span>
                  <span v-else>[ 2 / 2 ] Completed ✓</span>
                </div>
            </div>
          </div>
          <div class="selection-grid">
            <label v-for="rice in availableRice" :key="rice.id"
class="selection-card" :class="{ selected: selectedRice.includes(rice.name), disabled: selectedRice.length >= 2 && !selectedRice.includes(rice.name), dim: selectedRice.length > 0 && !selectedRice.includes(rice.name) }">
              <input type="checkbox" :value="rice.name" v-model="selectedRice" :id="'rice-' + rice.id" class="selection-checkbox" />
              <div v-if="rice.image" class="selection-image">
                <img :src="resolveFoodImage(rice.image)" :alt="rice.name" />
              </div>
              <div class="selection-label">
                <div class="selection-check"></div>
                <span>{{ rice.name }}</span>
              </div>
            </label>
          </div>
          <p class="warning-note" v-if="selectedRice.length > 2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Maximum 2 rice types allowed. Please deselect {{ selectedRice.length - 2 }} item(s).
          </p>
        </div>

        <!-- Main Dish Selection -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg></div>
            <div>
              <h3>Main Dish Selection</h3>
              <div class="progress-badge" :class="{'completed': selectedFoods.length === 8, 'selecting': selectedFoods.length > 0 && selectedFoods.length < 8}">
                  <span v-if="selectedFoods.length === 0">[ 0 / 8 ] Choose Main Dishes</span>
                  <span v-else-if="selectedFoods.length < 8">[ {{ selectedFoods.length }} / 8 ] Selecting...</span>
                  <span v-else>[ 8 / 8 ] Completed ✓</span>
                </div>
            </div>
          </div>
          <div class="selection-grid">
            <label v-for="food in availableMainDishes" :key="food.id"
class="selection-card" :class="{ selected: selectedFoods.includes(food.name), disabled: selectedFoods.length >= 8 && !selectedFoods.includes(food.name), dim: selectedFoods.length > 0 && !selectedFoods.includes(food.name) }">
              <input type="checkbox" :value="food.name" v-model="selectedFoods" :id="'food-' + food.id" class="selection-checkbox" />
              <div v-if="food.image" class="selection-image">
                <img :src="resolveFoodImage(food.image)" :alt="food.name" />
              </div>
              <div class="selection-label">
                <div class="selection-check"></div>
                <span>{{ food.name }}</span>
              </div>
            </label>
          </div>
          <p class="warning-note" v-if="selectedFoods.length > 8">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Maximum 8 main dishes allowed. Please deselect {{ selectedFoods.length - 8 }} item(s).
          </p>
        </div>

        <!-- Side Dish Selection -->
        <div class="form-section" v-if="availableSides.length > 0">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg></div>
            <div>
              <h3>Side Dish Selection</h3>
              <div class="progress-badge" :class="{'completed': selectedSides.length === 5, 'selecting': selectedSides.length > 0 && selectedSides.length < 5}">
                  <span v-if="selectedSides.length === 0">[ 0 / 5 ] Choose Side Dishes</span>
                  <span v-else-if="selectedSides.length < 5">[ {{ selectedSides.length }} / 5 ] Selecting...</span>
                  <span v-else>[ 5 / 5 ] Completed ✓</span>
                </div>
            </div>
          </div>
          <div class="selection-grid">
            <label v-for="side in availableSides" :key="side.id || side._id"
class="selection-card" :class="{ selected: selectedSides.includes(side.name), disabled: selectedSides.length >= 5 && !selectedSides.includes(side.name), dim: selectedSides.length > 0 && !selectedSides.includes(side.name) }">
              <input type="checkbox" :value="side.name" v-model="selectedSides" :id="'side-' + (side.id || side._id)" class="selection-checkbox" />
              <div v-if="side.image" class="selection-image">
                <img :src="resolveFoodImage(side.image)" :alt="side.name" />
              </div>
              <div class="selection-label">
                <div class="selection-check"></div>
                <span>{{ side.name }}</span>
              </div>
            </label>
          </div>
          <p class="warning-note" v-if="selectedSides.length > 5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Maximum 5 side dishes allowed. Please deselect {{ selectedSides.length - 5 }} item(s).
          </p>
        </div>

        <!-- Beverage Selection -->
        <div class="form-section" v-if="availableDrinks.length > 0">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg></div>
            <div>
              <h3>Beverage Selection</h3>
              <div class="progress-badge" :class="{'completed': selectedDrinks.length === 3, 'selecting': selectedDrinks.length > 0 && selectedDrinks.length < 3}">
                  <span v-if="selectedDrinks.length === 0">[ 0 / 3 ] Choose Beverages</span>
                  <span v-else-if="selectedDrinks.length < 3">[ {{ selectedDrinks.length }} / 3 ] Selecting...</span>
                  <span v-else>[ 3 / 3 ] Completed ✓</span>
                </div>
            </div>
          </div>
          <div class="selection-grid">
            <label v-for="drink in availableDrinks" :key="drink.id || drink._id" class="selection-card" :class="{ selected: selectedDrinks.includes(drink.name), disabled: selectedDrinks.length >= 3 && !selectedDrinks.includes(drink.name), dim: selectedDrinks.length > 0 && !selectedDrinks.includes(drink.name) }">
              <input type="checkbox" :value="drink.name" v-model="selectedDrinks" :id="'drink-' + (drink.id || drink._id)" class="selection-checkbox" />
              <div v-if="drink.image" class="selection-image">
                <img :src="resolveFoodImage(drink.image)" :alt="drink.name" />
              </div>
              <div class="selection-label">
                <div class="selection-check"></div>
                <span>{{ drink.name }}</span>
              </div>
            </label>
          </div>
          <p class="warning-note" v-if="selectedDrinks.length > 3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Maximum 3 beverages allowed. Please deselect {{ selectedDrinks.length - 3 }} item(s).
          </p>
        </div>

        <!-- Dessert Selection -->
        <div class="form-section" v-if="availableDesserts.length > 0">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/></svg></div>
            <div>
              <h3>Dessert Selection</h3>
              <div class="progress-badge" :class="{'completed': selectedDesserts.length === 3, 'selecting': selectedDesserts.length > 0 && selectedDesserts.length < 3}">
                  <span v-if="selectedDesserts.length === 0">[ 0 / 3 ] Choose Desserts</span>
                  <span v-else-if="selectedDesserts.length < 3">[ {{ selectedDesserts.length }} / 3 ] Selecting...</span>
                  <span v-else>[ 3 / 3 ] Completed ✓</span>
                </div>
            </div>
          </div>
          <div class="selection-grid">
            <label v-for="dessert in availableDesserts" :key="dessert.id || dessert._id" class="selection-card" :class="{ selected: selectedDesserts.includes(dessert.name), disabled: selectedDesserts.length >= 3 && !selectedDesserts.includes(dessert.name), dim: selectedDesserts.length > 0 && !selectedDesserts.includes(dessert.name) }">
              <input type="checkbox" :value="dessert.name" v-model="selectedDesserts" :id="'dessert-' + (dessert.id || dessert._id)" class="selection-checkbox" />
              <div v-if="dessert.image" class="selection-image">
                <img :src="resolveFoodImage(dessert.image)" :alt="dessert.name" />
              </div>
              <div class="selection-label">
                <div class="selection-check"></div>
                <span>{{ dessert.name }}</span>
              </div>
            </label>
          </div>
          <p class="warning-note" v-if="selectedDesserts.length > 3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Maximum 3 desserts allowed. Please deselect {{ selectedDesserts.length - 3 }} item(s).
          </p>
        </div>

        <!-- Add-on / Remark -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
            <div>
              <h3>Additional Notes / Remarks</h3>
              <p class="section-subtitle">Add any special notes or requests (optional)</p>
            </div>
          </div>
          <textarea v-model="remark" rows="4" placeholder="Add any special notes or requests here...

Examples:
• Allergies or dietary restrictions
• Delivery instructions
• Setup preferences
• Any other notes" class="remark-textarea"></textarea>
        </div>

                  <!-- Modern Info Card -->
          <div class="modern-info-card">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <div class="info-content">
              <strong>Custom Pricing & Bulk Orders</strong>
              <p>Planning for 100+ guests, require halal certification, or want to modify the menu? Submit a quotation instead of buying directly.</p>
            </div>
          </div>

          <!-- Bottom Floating Action Bar -->
          <div class="floating-action-bar">
            <div class="fab-price-section">
              <span class="fab-label">Total Estimate</span>
              <strong class="fab-amount">RM {{ packageSubtotal.toFixed(2) }} <span class="fab-pax-count">for {{ numberOfPax }} guests</span></strong>
            </div>
            
            <div class="fab-actions">
              <button type="button" @click="requestQuotation" class="fab-btn outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                <span>Request Quote</span>
              </button>
              
              <button type="submit" class="fab-btn primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useMenuStore } from '@/stores/menu'
import { useCartStore } from '@/stores/cart'
import { useQuotationsStore } from '@/stores/quotations'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  data() {
    return {
      selectedProviderId: null,
      selectedPackage: null,
      numberOfPax: 50,
      selectedRice: [],
      selectedFoods: [],
      selectedSides: [],
      selectedDrinks: [],
      selectedDesserts: [],
      remark: "",
      notification: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },
  computed: {
    packages() {
      const menuStore = useMenuStore()
      let packages = menuStore.allPackages
      

      
      // Filter by providerId from route parameter
      if (this.selectedProviderId) {
        packages = packages.filter(pkg => {
          const match = pkg.providerId?._id === this.selectedProviderId
          return match
        })
      }
      
      
      // Sort packages alphabetically by name
      return [...packages].sort((a, b) => a.name.localeCompare(b.name))
    },
    availableFoods() {
      const menuStore = useMenuStore()
      return menuStore.availableFoods
    },
    availableRice() {
      const menuStore = useMenuStore()
      const allRice = menuStore.availableFoods.filter(f => f.category === 'rice')
      

      
      // If a package is selected, filter by packageIds
      if (this.selectedPackage && this.selectedPackage._id) {
        const filtered = allRice.filter(rice => 
          rice.packageIds && rice.packageIds.includes(this.selectedPackage._id)
        )
        return filtered
      }
      return allRice
    },
    availableMainDishes() {
      const menuStore = useMenuStore()
      const allMainDishes = menuStore.availableFoods.filter(f => f.category === 'main')
      

      
      // If a package is selected, filter by packageIds
      if (this.selectedPackage && this.selectedPackage._id) {
        const filtered = allMainDishes.filter(dish => 
          dish.packageIds && dish.packageIds.includes(this.selectedPackage._id)
        )
        return filtered
      }
      return allMainDishes
    },
    availableSides() {
      const menuStore = useMenuStore()
      const allSides = menuStore.availableFoods.filter(f => f.category === 'side')
      
      if (this.selectedPackage && this.selectedPackage._id) {
        return allSides.filter(side => 
          side.packageIds && side.packageIds.includes(this.selectedPackage._id)
        )
      }
      return allSides
    },
    availableDrinks() {
      const menuStore = useMenuStore()
      const allDrinks = menuStore.availableFoods.filter(f => f.category === 'drink')
      
      if (this.selectedPackage && this.selectedPackage._id) {
        return allDrinks.filter(drink => 
          drink.packageIds && drink.packageIds.includes(this.selectedPackage._id)
        )
      }
      return allDrinks
    },
    availableDesserts() {
      const menuStore = useMenuStore()
      const allDesserts = menuStore.availableFoods.filter(f => f.category === 'dessert')
      
      if (this.selectedPackage && this.selectedPackage._id) {
        return allDesserts.filter(dessert => 
          dessert.packageIds && dessert.packageIds.includes(this.selectedPackage._id)
        )
      }
      return allDesserts
    },
    packageSubtotal() {
      return this.selectedPackage ? this.selectedPackage.price * this.numberOfPax : 0
    }
  },
  methods: {
    resolvePackageImage(imagePath) {
      return this.resolveFoodImage(imagePath)
    },
    resolveFoodImage(imagePath) {
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
    },
    showNotification(message, type = 'success') {
      this.notification.message = message
      this.notification.type = type
      this.notification.show = true
      
      setTimeout(() => {
        this.notification.show = false
      }, 3000)
    },
    
    selectPackage(pkg) {
      this.selectedPackage = pkg
      this.selectedRice = []
      this.selectedFoods = []
      this.selectedSides = []
      this.selectedDrinks = []
      this.selectedDesserts = []
      this.remark = ""
      
      // Fetch foods for this specific provider
      const menuStore = useMenuStore()
      if (pkg.providerId) {
        // Extract the ID from the populated providerId object
        const providerId = pkg.providerId._id || pkg.providerId
        menuStore.fetchFoods(providerId)
      }
      
      // Auto scroll to order form
      this.$nextTick(() => {
        const orderForm = document.querySelector('.order-form')
        if (orderForm) {
          orderForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    },
    addToCart() {
      if (this.selectedRice.length > 2) {
        this.showNotification("You can select up to 2 rice types only.", "error")
        return;
      }
      if (this.selectedFoods.length > 8) {
        this.showNotification("You can select up to 8 main dishes only.", "error")
        return;
      }
      if (this.selectedSides.length > 5) {
        this.showNotification("You can select up to 5 side dishes only.", "error")
        return;
      }
      if (this.selectedDrinks.length > 3) {
        this.showNotification("You can select up to 3 beverages only.", "error")
        return;
      }
      if (this.selectedDesserts.length > 3) {
        this.showNotification("You can select up to 3 desserts only.", "error")
        return;
      }

      const cartStore = useCartStore()
      
      cartStore.addToCart({
        id: this.selectedPackage._id || this.selectedPackage.id,
        packageId: this.selectedPackage._id || this.selectedPackage.id,
        providerId: this.selectedPackage.providerId?._id || this.selectedPackage.providerId,
        name: this.selectedPackage.name,
        description: this.selectedPackage.description,
        price: this.selectedPackage.price,
        quantity: this.numberOfPax,
        foods: [...this.selectedRice, ...this.selectedFoods, ...this.selectedSides],
        drinks: this.selectedDrinks,
        cakes: this.selectedDesserts,
        remark: this.remark
      })

      this.showNotification('Package added to cart!', 'success')
      
      // Reset form
      this.selectedPackage = null
      this.numberOfPax = 50
      this.selectedRice = []
      this.selectedFoods = []
      this.selectedSides = []
      this.selectedDrinks = []
      this.selectedDesserts = []
      this.remark = ""
    },
    async requestQuotation() {
      // Validation
      if (!this.selectedPackage) {
        this.showNotification("Please select a package first.", "error")
        return
      }
      if (!this.numberOfPax || this.numberOfPax < 1) {
        this.showNotification("Please enter number of guests.", "error")
        return
      }

      // Get user data
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        this.showNotification("Please login to request a quotation.", "error")
        this.$router.push('/login')
        return
      }

      // Build item selections summary for provider reference
      const itemsSummary = []
      if (this.selectedRice.length > 0) itemsSummary.push(`Rice: ${this.selectedRice.join(', ')}`)
      if (this.selectedFoods.length > 0) itemsSummary.push(`Main Dishes: ${this.selectedFoods.join(', ')}`)
      if (this.selectedSides.length > 0) itemsSummary.push(`Sides: ${this.selectedSides.join(', ')}`)
      if (this.selectedDrinks.length > 0) itemsSummary.push(`Drinks: ${this.selectedDrinks.join(', ')}`)
      if (this.selectedDesserts.length > 0) itemsSummary.push(`Desserts: ${this.selectedDesserts.join(', ')}`)
      
      const standardPrice = this.selectedPackage.price * this.numberOfPax
      
      // Prepare quotation request with clear context
      const quotationData = {
        providerId: this.selectedPackage.providerId?._id || this.selectedPackage.providerId,
        packageId: this.selectedPackage._id || this.selectedPackage.id,
        customerName: authStore.user.fullName || authStore.user.username || 'Customer',
        email: authStore.user.email || '',
        phoneNumber: authStore.user.phone || '',
        numberOfGuests: parseInt(this.numberOfPax),
        eventType: 'catering',
        selectedFoods: this.selectedFoods,
        selectedDrinks: this.selectedDrinks,
        selectedCakes: this.selectedDesserts,
        additionalRequests: `━━━━ QUOTATION REQUEST ━━━━

BASED ON PACKAGE: ${this.selectedPackage.name}
Standard Price: RM ${this.selectedPackage.price}/pax × ${this.numberOfPax} guests = RM ${standardPrice.toFixed(2)}

SELECTED ITEMS:
${itemsSummary.join('\n')}

CUSTOMER REMARKS:
${this.remark || 'No special requests'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
Note: Customer is requesting a custom quotation. Please review their requirements and provide a customized price quote.`,
        // Default event details - customer will confirm later
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        eventTime: '12:00',
        location: 'To be confirmed with quotation'
      }

      try {
        const quotationsStore = useQuotationsStore()
        await quotationsStore.submitQuotation(quotationData)
        
        this.showNotification("✓ Quotation request submitted successfully! The provider will review your request and send you a custom quote within 1-2 business days.", "success")
        
        // Reset form
        this.selectedPackage = null
        this.numberOfPax = 50
        this.selectedRice = []
        this.selectedFoods = []
        this.selectedSides = []
        this.selectedDrinks = []
        this.selectedDesserts = []
        this.remark = ""
        
        // Navigate to quotations page after 2 seconds
        setTimeout(() => {
          this.$router.push('/quotations')
        }, 2000)
        
      } catch (error) {
        console.error('Error submitting quotation:', error)
        const errorMsg = error.response?.data?.message || error.message || 'Failed to submit quotation. Please try again.'
        this.showNotification(errorMsg, "error")
      }
    }
  },
  watch: {
    '$route.query.providerId'(newProviderId) {
      this.selectedProviderId = newProviderId || null

      
      // Refetch fresh data when provider changes
      const menuStore = useMenuStore()
      if (this.selectedProviderId) {
        menuStore.fetchPackages(this.selectedProviderId)
        menuStore.fetchFoods(this.selectedProviderId)
      } else {
        menuStore.fetchPackages()
        menuStore.fetchFoods()
      }
      
      // Reset selection
      this.selectedPackage = null
    }
  },
  mounted() {
    const menuStore = useMenuStore()
    const cartStore = useCartStore()
    
    // Get providerId from query parameter
    this.selectedProviderId = this.$route.query.providerId || null

    
    // Fetch fresh data from backend (not from cache)
    if (this.selectedProviderId) {
      menuStore.fetchPackages(this.selectedProviderId)
      menuStore.fetchFoods(this.selectedProviderId)
    } else {
      menuStore.fetchPackages()
      menuStore.fetchFoods()
    }
    
    cartStore.loadFromStorage()
  }
};
</script>

<style scoped>
/* Layout & Container */
.menu-page {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.menu-container {
  flex: 1;
  margin-left: 260px;
  width: calc(100% - 260px);
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 2000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-weight: 500;
  backdrop-filter: blur(10px);
  max-width: 400px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) translateX(20px);
  }
}

.notification-toast.success {
  background: rgba(16, 185, 129, 0.95);
  color: white;
}

.notification-toast.error {
  background: rgba(239, 68, 68, 0.95);
  color: white;
}

/* Modern Hero Section */
.hero-section {
  position: relative;
  background-color: #1e293b;
  color: white;
  padding: 60px 40px;
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
    radial-gradient(circle at 90% 80%, rgba(15, 23, 42, 0.1) 0%, transparent 20%);
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
  color: white; /* Fallback */
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 3rem;
  font-weight: 400;
  line-height: 1.6;
}

/* Packages Grid */
.packages-section {
  position: relative;
  z-index: 10;
  padding: 0 40px 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.packages-section .section-header {
  margin-bottom: 24px;
}

.packages-section h3 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.package-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #0f172a; /* Cyan border for all cards as per design */
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  height: 100%;
}

.package-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -5px rgba(15, 23, 42, 0.15);
}

.package-card.selected {
  box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.2);
}

.card-banner {
  height: 140px;
  background: #e2e8f0; /* Solid light gray background */
  position: relative;
}

.package-banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.package-banner-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.02em;
}

.provider-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: white;
  color: #0f172a;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-content h4 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
  line-height: 1.3;
}

.price {
  font-size: 2rem;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 12px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.per-pax {
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
}

.description {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 24px;
  flex-grow: 1;
}

.package-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 24px;
}

.package-meta svg {
  color: #94a3b8; /* Lighter gray for icon */
}

/* Button style matching "SELECTED" block in design */
.select-btn-placeholder {
  width: 100%;
  padding: 14px;
  text-align: center;
  background: #0f172a;
  color: white;
  font-weight: 700;
  border-radius: 8px;
  transition: all 0.2s;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.2);
}

.package-card:hover .select-btn-placeholder {
  background: #1e293b; /* Darker cyan on hover */
}

/* Order Form Styles */
.order-form {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  max-width: 800px;
  margin: 0 auto;
}

.selected-package-banner {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.banner-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); /* Slight shadow */
  color: #0f172a; /* Icon Color */
}

.banner-info h4 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 2px;
}

.banner-info p {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-section {
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px dashed #e2e8f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.section-icon {
  width: 48px;
  height: 48px;
  background: #f1f5f9; /* Cyan Tint */
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #0f172a; /* Cyan Color */
}

.section-header h3 {
  margin: 0 0 6px 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
}

.section-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Pax Selector */
.pax-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.pax-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.pax-btn:hover {
  border-color: #0f172a;
  color: #0f172a;
}

.pax-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 150px;
}

.pax-input {
  width: 100%;
  padding: 10px 12px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
}

.pax-input:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

.pax-label {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

.subtotal-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1; /* Dashed border for subtotal */
}

.subtotal-card span {
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.subtotal-card strong {
  font-size: 1.25rem;
  color: #0f172a;
  font-weight: 800;
}

/* Selection Grids */
.selection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); /* Slightly larger cards */
  gap: 16px;
}

.selection-card {
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.selection-card:hover {
  border-color: #94a3b8;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.selection-card.selected {
  border-color: #0f172a; /* Matching Cyan */
  background: #f1f5f9; /* Light Cyan Tint */
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.2);
}

.selection-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.selection-image {
  height: 100px;
  width: 100%;
  overflow: hidden;
  background: #f1f5f9;
}

.selection-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.selection-label {
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.selection-check {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  flex-shrink: 0;
  position: relative;
}

.selection-card.selected .selection-check {
  border-color: #0f172a;
  background: #0f172a;
}

.selection-card.selected .selection-check::after {
  content: '';
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 4px;
  height: 8px;
  border-bottom: 2px solid white;
  border-right: 2px solid white;
}

.selection-label span {
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.3;
}

.warning-note {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
}

.remark-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  resize: vertical;
  min-height: 100px;
}

.remark-textarea:focus {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

/* Action Inputs */
.info-box {
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.info-icon {
  font-size: 20px;
}

.info-box strong {
  display: block;
  color: #92400e;
  font-size: 14px;
  margin-bottom: 4px;
}

.info-box p {
  color: #b45309;
  font-size: 13px;
  margin: 0;
}

.action-guide {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
}

.guide-option strong {
  display: block;
  font-size: 14px;
  color: #0f172a;
  margin-bottom: 4px;
}

.guide-option p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 16px;
}

.submit-btn, .quotation-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 15px;
}

.submit-btn {
  background: #0f172a;
  color: white;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.3);
}

.submit-btn:hover {
  background: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(15, 23, 42, 0.3);
}

.quotation-btn {
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.quotation-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}

@media (max-width: 768px) {
  .menu-container {
    margin-left: 70px;
    max-width: calc(100% - 70px);
    padding: 20px;
  }
  
  .hero-section {
    padding: 40px 20px;
  }
  
  .hero-content h1 {
    font-size: 28px;
  }
}


  .pax-quick-select {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }
  .pax-pill {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid #cbd5e1;
    background: white;
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .pax-pill:hover {
    border-color: #0f172a;
    color: #0f172a;
  }
  .pax-pill.active {
    background: #0f172a;
    color: white;
    border-color: #0f172a;
  }
  
  .progress-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    background: #f1f5f9;
    color: #64748b;
    margin-top: 8px;
    transition: all 0.3s ease;
  }
  .progress-badge.selecting {
    background: #e0f2fe;
    color: #0369a1;
  }
  .progress-badge.completed {
    background: #dcfce7;
    color: #15803d;
  }

  .selection-card.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
  .selection-card.dim {
    opacity: 0.7;
  }
  .selection-card.dim:hover {
    opacity: 1;
  }

  .pax-quick-select {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
  }
  .pax-pill {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid #cbd5e1;
    background: white;
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .pax-pill:hover {
    border-color: #0f172a;
    color: #0f172a;
  }
  .pax-pill.active {
    background: #0f172a;
    color: white;
    border-color: #0f172a;
  }
  
  .progress-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    background: #f1f5f9;
    color: #64748b;
    margin-top: 8px;
    transition: all 0.3s ease;
  }
  .progress-badge.selecting {
    background: #e0f2fe;
    color: #0369a1;
  }
  .progress-badge.completed {
    background: #dcfce7;
    color: #15803d;
  }

  .selection-card.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
  .selection-card.dim {
    opacity: 0.7;
  }
  .selection-card.dim:hover {
    opacity: 1;
  }

  /* --- NEW UI COMPONENT STYLES --- */
  /* Modern Info Card */
  .modern-info-card {
    background: #f8fafc;
    border-left: 4px solid #0ea5e9;
    border-radius: 8px;
    padding: 16px 20px;
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    align-items: flex-start;
  }
  
  .modern-info-card .info-icon {
    color: #0ea5e9;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .modern-info-card .info-content strong {
    display: block;
    color: #0f172a;
    font-size: 0.95rem;
    margin-bottom: 6px;
  }

  .modern-info-card .info-content p {
    color: #475569;
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 0;
  }

  /* Floating Action Bar */
  .order-form {
    padding-bottom: 100px; /* Add padding so FAB doesn't cover content */
  }

  .floating-action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid #e2e8f0;
    padding: 16px 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
    z-index: 1000;
  }

  .fab-price-section {
    display: flex;
    flex-direction: column;
  }

  .fab-label {
    font-size: 0.8rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .fab-amount {
    font-size: 1.5rem;
    color: #0f172a;
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 2px;
    font-weight: 700;
  }

  .fab-pax-count {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 500;
  }

  .fab-actions {
    display: flex;
    gap: 12px;
  }

  .fab-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .fab-btn.outline {
    background: transparent;
    border: 2px solid #e2e8f0;
    color: #475569;
  }

  .fab-btn.outline:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
    color: #0f172a;
  }

  .fab-btn.primary {
    background: #0f172a;
    border: 2px solid #0f172a;
    color: white;
  }

  .fab-btn.primary:hover {
    background: #1e293b;
    border-color: #1e293b;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  }

  @media (max-width: 768px) {
    .floating-action-bar {
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    .fab-price-section {
      align-items: center;
      width: 100%;
    }
    .fab-actions {
      width: 100%;
      flex-direction: column;
    }
    .fab-btn {
      width: 100%;
      justify-content: center;
    }
  }

  /* --- NEW UI COMPONENT STYLES --- */
  /* Modern Info Card */
  .modern-info-card {
    background: #f8fafc;
    border-left: 4px solid #0ea5e9;
    border-radius: 8px;
    padding: 16px 20px;
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    align-items: flex-start;
  }
  
  .modern-info-card .info-icon {
    color: #0ea5e9;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .modern-info-card .info-content strong {
    display: block;
    color: #0f172a;
    font-size: 0.95rem;
    margin-bottom: 6px;
  }

  .modern-info-card .info-content p {
    color: #475569;
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 0;
  }

  /* Floating Action Bar */
  .order-form {
    padding-bottom: 100px; /* Add padding so FAB doesn't cover content */
  }

  .floating-action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-top: 1px solid #e2e8f0;
    padding: 16px 5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
    z-index: 1000;
  }

  .fab-price-section {
    display: flex;
    flex-direction: column;
  }

  .fab-label {
    font-size: 0.8rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .fab-amount {
    font-size: 1.5rem;
    color: #0f172a;
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 2px;
    font-weight: 700;
  }

  .fab-pax-count {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 500;
  }

  .fab-actions {
    display: flex;
    gap: 12px;
  }

  .fab-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .fab-btn.outline {
    background: transparent;
    border: 2px solid #e2e8f0;
    color: #475569;
  }

  .fab-btn.outline:hover {
    border-color: #cbd5e1;
    background: #f8fafc;
    color: #0f172a;
  }

  .fab-btn.primary {
    background: #0f172a;
    border: 2px solid #0f172a;
    color: white;
  }

  .fab-btn.primary:hover {
    background: #1e293b;
    border-color: #1e293b;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  }

  @media (max-width: 768px) {
    .floating-action-bar {
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
    .fab-price-section {
      align-items: center;
      width: 100%;
    }
    .fab-actions {
      width: 100%;
      flex-direction: column;
    }
    .fab-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>