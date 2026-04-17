<!--
  Customer Home Page
  Role: Customer
  Function: Display all approved catering providers for customers to browse and select
  Features:
    - View all approved catering providers
    - Provider cards with business details
    - Select provider to view their menu
-->
<template>
  <div class="home-container">
    <Navbar />
    
    <div class="home-content">
      <!-- Modern Hero Section -->
      <div class="hero-section">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1>Discover Exceptional Catering</h1>
          <p class="hero-subtitle">Connect with top-rated local caterers for your next event</p>
          
          <!-- Search Bar Integrated in Hero -->
          <div class="search-box-wrapper">
            <div class="search-toolbar">
              <div class="search-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Search by name, cuisine, or location..."
                  @input="filterProviders"
                />
              </div>
              <button @click="toggleFilterPanel" type="button" class="btn-filter" :class="{ active: showFilterPanel || activeFilterCount > 0 }">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                <span>Filter</span>
                <span v-if="activeFilterCount > 0" class="filter-count">{{ activeFilterCount }}</span>
              </button>
            </div>

            <div v-if="showFilterPanel" class="filter-panel">
              <div class="filter-grid">
                <div class="filter-item">
                  <label>Budget</label>
                  <select v-model="budgetFilter" @change="filterProviders">
                    <option value="all">All Budgets</option>
                    <option value="budget">Budget Friendly (&lt; RM100)</option>
                    <option value="standard">Standard (RM100 - RM499)</option>
                    <option value="premium">Premium (RM500+)</option>
                  </select>
                </div>
                <div class="filter-item">
                  <label>Service Type</label>
                  <select v-model="serviceAreaFilter" @change="filterProviders">
                    <option value="all">All Service Types</option>
                    <option value="radius">Radius Delivery</option>
                    <option value="locations">Specific Locations</option>
                  </select>
                </div>
                <div class="filter-item">
                  <label>State</label>
                  <select v-model="stateFilter" @change="filterProviders">
                    <option value="all">All Malaysia States</option>
                    <option v-for="state in malaysiaStates" :key="state" :value="state">{{ state }}</option>
                  </select>
                </div>
                <div class="filter-item">
                  <label>Sort By</label>
                  <select v-model="sortFilter" @change="filterProviders">
                    <option value="name">Name (A-Z)</option>
                    <option value="minOrderAsc">Minimum Order: Low to High</option>
                    <option value="minOrderDesc">Minimum Order: High to Low</option>
                  </select>
                </div>
              </div>
              <div class="filter-actions">
                <button type="button" @click="clearFilters" class="btn-filter-clear">Clear Filters</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="main-content">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Finding the best caterers for you...</p>
        </div>

        <!-- No Providers -->
        <div v-else-if="filteredProviders.length === 0 && !loading" class="empty-state">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h3>No Caterers Found</h3>
          <p>{{ searchQuery ? `We couldn't find anything matching "${searchQuery}"` : 'No approved providers available at the moment.' }}</p>
          <button v-if="searchQuery" @click="searchQuery = ''; filterProviders()" class="btn-clear">Clear Search</button>
        </div>

        <!-- Providers Grid -->
        <div v-else class="providers-section">
          <div class="section-header">
            <h2>Verified Caterers <span class="badge">{{ filteredProviders.length }}</span></h2>
          </div>
          
          <div class="providers-grid">
            <div 
              v-for="provider in filteredProviders" 
              :key="provider._id" 
              class="provider-card"
            >
            <!-- Card Header / Banner -->
            <div class="card-banner" :style="{ backgroundImage: provider.banner ? `url(${provider.banner})` : '' }">
              <div class="card-banner-overlay"></div>
              <div class="provider-badge" v-if="provider.minimumOrderValue < 100">Budget Friendly</div>
            </div>

            <!-- Card Content -->
            <div class="card-content">
              <!-- Logo overlapping banner -->
              <div class="provider-logo">
                <img v-if="provider.logo" :src="provider.logo" :alt="provider.businessName" />
                <div v-else class="logo-placeholder">
                  {{ provider.businessName?.charAt(0) || 'C' }}
                </div>
              </div>

              <!-- Info -->
              <div class="provider-details">
                <h3>{{ provider.businessName }}</h3>
                <p class="description">{{ truncateText(provider.aboutUs, 90) || 'Offering premium catering services for weddings, corporate events, and parties.' }}</p>

                <div class="meta-info">
                  <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{{ getServiceAreaText(provider) }}</span>
                  </div>
                  <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <span>Min. RM{{ provider.minimumOrderValue || 500 }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="card-actions">
                <button @click="viewDetails(provider)" class="btn-icon" title="View Details">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </button>
                <button @click="openChat(provider)" class="btn-icon btn-chat-icon" title="Chat with Provider">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
                <button @click="selectProvider(provider)" class="btn-primary-card">
                  <span>View Menu</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modern Details Modal -->
    <div v-if="showDetailsModal && selectedProvider" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal-card" @click.stop>
        <button @click="closeDetailsModal" class="modal-close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        
        <div class="modal-header-bg" :style="{ backgroundImage: selectedProvider.banner ? `url(${selectedProvider.banner})` : '' }">
          <div class="modal-header-overlay"></div>
          <div class="modal-provider-identity">
             <div class="modal-logo-wrapper">
                <img v-if="selectedProvider.logo" :src="selectedProvider.logo" :alt="selectedProvider.businessName" />
                <div v-else class="modal-logo-placeholder">
                  {{ selectedProvider.businessName?.charAt(0) || 'C' }}
                </div>
             </div>
             <h2>{{ selectedProvider.businessName }}</h2>
          </div>
        </div>

        <div class="modal-content-scroll">
          <div class="modal-body-section">
            <h3>About the Caterer</h3>
            <p class="about-text">{{ selectedProvider.aboutUs || 'Quality catering services for all occasions.' }}</p>
          </div>

          <div class="modal-grid">
            <div class="info-card">
              <h4>Contact</h4>
              <div class="info-row">
                <div class="icon-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
                <span>{{ selectedProvider.phone || 'Not available' }}</span>
              </div>
              <div class="info-row">
                <div class="icon-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg></div>
                <span>{{ selectedProvider.email || 'Not available' }}</span>
              </div>
              <div class="info-row">
                 <div class="icon-box"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                 <span>{{ selectedProvider.address || 'Address not listed' }}</span>
              </div>
            </div>

            <div class="info-card">
              <h4>Service Details</h4>
              <div class="info-row">
                <span class="label">Area:</span>
                <span class="value">{{ getServiceAreaText(selectedProvider) }}</span>
              </div>
              <div class="info-row">
                 <span class="label">Lead Time:</span>
                 <span class="value">{{ selectedProvider.leadTimeDays || 3 }} days</span>
              </div>
               <div class="info-row">
                 <span class="label">Min Order:</span>
                 <span class="value">RM {{ selectedProvider.minimumOrderValue || 500 }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer-modern">
          <button @click="closeDetailsModal" class="btn-text">Cancel</button>
          <button @click="selectProvider(selectedProvider)" class="btn-primary-large">
            View Menu & Order
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Home',
  components: {
    Navbar
  },
  data() {
    return {
      providers: [],
      filteredProviders: [],
      searchQuery: '',
      showFilterPanel: false,
      budgetFilter: 'all',
      serviceAreaFilter: 'all',
      stateFilter: 'all',
      sortFilter: 'name',
      malaysiaStates: [
        'Johor',
        'Kedah',
        'Kelantan',
        'Melaka',
        'Negeri Sembilan',
        'Pahang',
        'Perak',
        'Perlis',
        'Pulau Pinang',
        'Sabah',
        'Sarawak',
        'Selangor',
        'Terengganu',
        'Kuala Lumpur',
        'Labuan',
        'Putrajaya'
      ],
      loading: true,
      showDetailsModal: false,
      selectedProvider: null
    }
  },
  computed: {
    activeFilterCount() {
      let count = 0
      if (this.budgetFilter !== 'all') count += 1
      if (this.serviceAreaFilter !== 'all') count += 1
      if (this.stateFilter !== 'all') count += 1
      if (this.sortFilter !== 'name') count += 1
      return count
    }
  },
  async mounted() {
    await this.loadProviders()
  },
  methods: {
    async loadProviders() {
      try {
        this.loading = true
        
        // Fetch all approved catering providers using centralized api service
        const response = await api.get('/admin/providers/approved', {
          timeout: 10000 // 10 second timeout
        })
        
        // All returned providers are already approved and active
        this.providers = response.data
        this.filteredProviders = [...this.providers]
      } catch (error) {
        console.error('Error loading providers:', error)
        if (error.code === 'ECONNABORTED') {
          alert('Request timeout. Please check your connection and try again.')
        } else if (error.response) {
          console.error('Error details:', error.response.data)
          alert(`Failed to load providers: ${error.response.data.message || 'Server error'}`)
        } else {
          alert('Failed to connect to server. Please ensure the backend is running.')
        }
        this.providers = []
        this.filteredProviders = []
      } finally {
        this.loading = false
      }
    },
    filterProviders() {
      const query = this.searchQuery.toLowerCase()
      let list = [...this.providers]

      if (query) {
        list = list.filter(provider => {
          return (
            provider.businessName?.toLowerCase().includes(query) ||
            provider.fullName?.toLowerCase().includes(query) ||
            provider.address?.toLowerCase().includes(query) ||
            provider.phone?.toLowerCase().includes(query)
          )
        })
      }

      if (this.budgetFilter === 'budget') {
        list = list.filter(provider => Number(provider.minimumOrderValue || 0) < 100)
      } else if (this.budgetFilter === 'standard') {
        list = list.filter(provider => {
          const value = Number(provider.minimumOrderValue || 0)
          return value >= 100 && value < 500
        })
      } else if (this.budgetFilter === 'premium') {
        list = list.filter(provider => Number(provider.minimumOrderValue || 0) >= 500)
      }

      if (this.serviceAreaFilter === 'radius') {
        list = list.filter(provider => provider.serviceAreaType === 'radius')
      } else if (this.serviceAreaFilter === 'locations') {
        list = list.filter(provider => provider.serviceAreaType !== 'radius')
      }

      if (this.stateFilter !== 'all') {
        list = list.filter(provider => this.providerMatchesState(provider, this.stateFilter))
      }

      if (this.sortFilter === 'minOrderAsc') {
        list.sort((a, b) => Number(a.minimumOrderValue || 0) - Number(b.minimumOrderValue || 0))
      } else if (this.sortFilter === 'minOrderDesc') {
        list.sort((a, b) => Number(b.minimumOrderValue || 0) - Number(a.minimumOrderValue || 0))
      } else {
        list.sort((a, b) => String(a.businessName || '').localeCompare(String(b.businessName || '')))
      }

      this.filteredProviders = list
    },
    toggleFilterPanel() {
      this.showFilterPanel = !this.showFilterPanel
    },
    clearFilters() {
      this.budgetFilter = 'all'
      this.serviceAreaFilter = 'all'
      this.stateFilter = 'all'
      this.sortFilter = 'name'
      this.filterProviders()
    },
    providerMatchesState(provider, stateName) {
      const state = String(stateName || '').toLowerCase()
      if (!state) return true

      const addressText = String(provider.address || '').toLowerCase()
      const locationsText = Array.isArray(provider.serviceLocations)
        ? provider.serviceLocations.join(' ').toLowerCase()
        : ''
      const serviceAreaText = this.getServiceAreaText(provider).toLowerCase()
      const directStateField = String(provider.state || provider.businessState || '').toLowerCase()

      return (
        addressText.includes(state) ||
        locationsText.includes(state) ||
        serviceAreaText.includes(state) ||
        directStateField.includes(state)
      )
    },
    truncateText(text, maxLength) {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    },
    getServiceAreaText(provider) {
      if (provider.serviceAreaType === 'radius') {
        return `${provider.deliveryRadius || 50}km radius`
      } else if (provider.serviceLocations && provider.serviceLocations.length > 0) {
        if (provider.serviceLocations.length === 1) {
          return provider.serviceLocations[0]
        }
        return `${provider.serviceLocations.length} locations`
      }
      return 'Contact for details'
    },
    selectProvider(provider) {
      // Navigate to menu with provider ID
      this.$router.push({ path: '/menu', query: { providerId: provider._id } })
    },
    viewDetails(provider) {
      this.selectedProvider = provider
      this.showDetailsModal = true
    },
    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedProvider = null
    },
    openChat(provider) {
      this.$router.push({ 
        path: '/chat', 
        query: { 
          userId: provider._id, 
          userName: provider.businessName,
          userRole: 'cateringProvider'
        } 
      })
    }
  }
}
</script>

<style scoped>
/* Layout & Container - Matching Quotations/Orders */
.home-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

.home-content {
  flex: 1;
  margin-left: 260px;
  width: calc(100% - 260px);
  display: flex;
  flex-direction: column;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
}

/* Modern Hero Section */
.hero-section {
  position: relative;
  background-color: #1e293b;
  color: white;
  padding: 50px 20px 80px; /* Added extra padding bottom for search bar overlap */
  text-align: center;
  overflow: visible; /* Changed to visible to allow search box overlap if needed, or keep hidden if contained */
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
  opacity: 1;
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
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 3rem;
  font-weight: 400;
  line-height: 1.6;
}

/* Search Box Integration */
.search-box-wrapper {
  max-width: 760px;
  margin: 0 auto;
  position: relative;
}

.search-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  transform: translateY(20px);
}

.search-box {
  background: white;
  border-radius: 100px;
  padding: 8px 24px 8px 45px; /* Increased left padding to give icon more room */
  display: flex;
  align-items: center;
  gap: 12px; /* Adjusted gap */
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  flex: 1;
  box-sizing: border-box; 
  position: relative; /* Ensure overlapping elements are contained */
}

.btn-filter {
  height: 52px;
  min-width: 120px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.2s;
}

.btn-filter:hover,
.btn-filter.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
}

.filter-count {
  background: #22d3ee;
  color: #0f172a;
  border-radius: 999px;
  min-width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
}

.filter-panel {
  margin-top: 34px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(8px);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 12px;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.filter-item label {
  font-size: 12px;
  font-weight: 700;
  color: #cbd5e1;
  letter-spacing: 0.02em;
}

.filter-item select {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 10px 12px;
  font-size: 13px;
  outline: none;
}

.filter-item option {
  color: #0f172a;
  background: #ffffff;
}

.filter-actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}

.btn-filter-clear {
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: transparent;
  color: #e2e8f0;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-filter-clear:hover {
  background: rgba(255, 255, 255, 0.12);
}

.search-box svg {
  color: #64748b;
  flex-shrink: 0;
  min-width: 20px;
  z-index: 10; /* Ensure icon is above input if overlaps */
}

.search-box input {
  flex: 1;
  border: none;
  font-size: 16px;
  padding: 12px 0 12px 12px; /* Added left padding to input to push text away from icon area */
  outline: none;
  color: #0f172a;
  background: transparent; /* Ensure background doesn't cover icon */
  width: 100%;
}

.search-box input::placeholder {
  color: #94a3b8;
}

/* Loading & Empty States */
.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

.empty-icon {
  color: #cbd5e1;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  color: #0f172a;
  margin-bottom: 8px;
  font-weight: 600;
}

.btn-clear {
  margin-top: 20px;
  padding: 10px 24px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  color: #0f172a;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.btn-clear:hover {
  background: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.spinner {
  margin: 0 auto 20px;
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #0f172a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Providers Grid */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  margin-top: 20px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge {
  background: #eff6ff;
  color: #2563eb;
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
}

.providers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.provider-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.provider-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.card-banner {
  height: 140px;
  background-color: #f1f5f9;
  background-size: cover;
  background-position: center;
  position: relative;
}

.card-banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%);
}

.provider-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.95);
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  color: #059669;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-content {
  padding: 0 24px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.provider-logo {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  background: white;
  padding: 4px;
  margin-top: -40px;
  margin-bottom: 16px;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.provider-logo img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.provider-details h3 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 44px;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #475569;
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
}

.meta-item svg {
  color: #64748b;
  width: 14px;
  height: 14px;
}

.card-actions {
  margin-top: auto;
  display: flex;
  gap: 12px;
}

.btn-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f8fafc;
  color: #0f172a;
  border-color: #cbd5e1;
}

.btn-chat-icon:hover {
  background: #eff6ff;
  color: #3b82f6;
  border-color: #bfdbfe;
}

.btn-primary-card {
  flex: 1;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  height: 44px;
}

.btn-primary-card:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Modal and Responsive styles remain similar but updated for consistency */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
  background: rgba(0,0,0,0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  backdrop-filter: blur(4px);
}

.modal-close-btn:hover {
  background: rgba(0,0,0,0.4);
}

.modal-header-bg {
  height: 180px;
  background-color: #0f172a;
  background-size: cover;
  background-position: center;
  position: relative;
}

.modal-header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%);
}

.modal-provider-identity {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  display: flex;
  align-items: flex-end;
  gap: 20px;
}

.modal-logo-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: white;
  padding: 4px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.modal-logo-wrapper img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.modal-logo-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: #0f172a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 28px;
}

.modal-provider-identity h2 {
  color: white;
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  padding-bottom: 4px;
}

.modal-content-scroll {
  padding: 30px;
  overflow-y: auto;
}

.modal-body-section {
  margin-bottom: 30px;
}

.modal-body-section h3 {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 12px;
}

.about-text {
  color: #334155;
  line-height: 1.6;
  font-size: 15px;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-card {
  background: #f8fafc;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.info-card h4 {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin: 0 0 16px 0;
  font-weight: 700;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.icon-box {
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-row span {
  color: #334155;
  font-weight: 500;
}

.modal-footer-modern {
  padding: 20px 30px;
  border-top: 1px solid #e2e8f0;
  background: white;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.btn-text {
  padding: 10px 20px;
  background: transparent;
  color: #64748b;
  border: none;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-text:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.btn-primary-large {
  padding: 12px 28px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.btn-primary-large:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .home-content {
    margin-left: 0;
    width: 100%;
  }

  .main-content {
    padding: 20px;
  }
  
  .hero-section {
    padding: 60px 20px 80px;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .search-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-filter {
    width: 100%;
  }

  .filter-panel {
    margin-top: 14px;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .providers-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-grid {
    grid-template-columns: 1fr;
  }
}
</style>
