import { defineStore } from 'pinia'
import { menuAPI } from '@/services/api'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    packages: [],
    foods: [],
    loading: false,
    error: null
  }),

  getters: {
    allPackages: (state) => state.packages,
    availableFoods: (state) => state.foods.filter(f => f.available),
    
    getPackageById: (state) => (id) => {
      return state.packages.find(p => p._id === id || p.id === id)
    }
  },

  actions: {
    async fetchPackages(providerId = null) {
      try {
        this.loading = true
        const response = await menuAPI.getPackages(providerId)
        this.packages = response.data
        this.error = null
      } catch (error) {
        console.error('Error fetching packages:', error)
        this.error = error.response?.data?.message || 'Failed to fetch packages'
      } finally {
        this.loading = false
      }
    },

    async addPackage(packageData) {
      try {
        const response = await menuAPI.createPackage(packageData)
        this.packages.push(response.data.package)
        return response.data.package
      } catch (error) {
        console.error('Error adding package:', error)
        throw error
      }
    },

    async updatePackage(id, packageData) {
      try {
        const response = await menuAPI.updatePackage(id, packageData)
        const index = this.packages.findIndex(p => p._id === id)
        if (index !== -1) {
          this.packages[index] = response.data.package
        }
      } catch (error) {
        console.error('Error updating package:', error)
        throw error
      }
    },

    async deletePackage(id) {
      try {
        await menuAPI.deletePackage(id)
        this.packages = this.packages.filter(p => p._id !== id)
      } catch (error) {
        console.error('Error deleting package:', error)
        throw error
      }
    },

    async fetchFoods(providerId = null) {
      try {
        this.loading = true
        const response = await menuAPI.getFoods(providerId)
        this.foods = response.data
        this.error = null
      } catch (error) {
        console.error('Error fetching foods:', error)
        this.error = error.response?.data?.message || 'Failed to fetch foods'
      } finally {
        this.loading = false
      }
    },

    async addFoodItem(foodData) {
      try {
        const response = await menuAPI.createFood(foodData)
        this.foods.push(response.data.food)
        return response.data.food
      } catch (error) {
        console.error('Error adding food:', error)
        throw error
      }
    },

    async updateFoodItem(id, foodData) {
      try {
        const response = await menuAPI.updateFood(id, foodData)
        const index = this.foods.findIndex(f => f._id === id)
        if (index !== -1) {
          this.foods[index] = response.data.food
        }
      } catch (error) {
        console.error('Error updating food:', error)
        throw error
      }
    },

    async updateFoodAvailability(id, available) {
      try {
        await this.updateFoodItem(id, { available })
      } catch (error) {
        console.error('Error updating food availability:', error)
        throw error
      }
    },

    async deleteFoodItem(id) {
      try {
        await menuAPI.deleteFood(id)
        const index = this.foods.findIndex(f => (f._id || f.id) === id)
        if (index !== -1) {
          this.foods.splice(index, 1)
        }
      } catch (error) {
        console.error('Error deleting food:', error)
        throw error
      }
    },

    async loadFromStorage() {
      // Load from API instead of localStorage
      await Promise.all([
        this.fetchPackages(),
        this.fetchFoods()
      ])
    }
  }
})
