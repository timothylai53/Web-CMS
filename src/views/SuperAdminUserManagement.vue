<template>
  <div class="admin-container">
    <Navbar />
    
    <div class="main-content">
      <header class="page-header">
        <div class="header-content">
          <h1>User Management</h1>
          <p>Monitor and manage all user accounts across the platform.</p>
        </div>
      </header>

      <!-- Filters & Search -->
      <div class="controls-bar">
        <div class="search-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search users by name, email..."
            class="search-input"
          />
        </div>

        <div class="filter-group">
          <button 
            :class="['filter-btn', { active: roleFilter === 'all' }]"
            @click="roleFilter = 'all'"
          >
            All Users
          </button>
          <button 
            :class="['filter-btn', { active: roleFilter === 'customer' }]"
            @click="roleFilter = 'customer'"
          >
            Customers
          </button>
          <button 
            :class="['filter-btn', { active: roleFilter === 'cateringProvider' }]"
            @click="roleFilter = 'cateringProvider'"
          >
            Providers
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="empty-cell">
                <div class="empty-state">
                  <div class="empty-icon">🔍</div>
                  <p>No users found matching your criteria</p>
                </div>
              </td>
            </tr>
            <tr v-for="user in filteredUsers" :key="user._id">
              <td>
                <div class="user-cell">
                  <div class="avatar" :class="user.role">
                    {{ (user.fullName || user.username || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <div class="user-info">
                    <span class="name">{{ user.fullName || user.username }}</span>
                    <span class="email">{{ user.email }}</span>
                    <span v-if="user.businessName" class="business-name">{{ user.businessName }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['role-badge', user.role]">
                  {{ formatRole(user.role) }}
                </span>
              </td>
              <td>
                <div class="status-wrapper">
                  <span :class="['status-dot', user.isActive ? 'active' : 'inactive']"></span>
                  <span class="status-text">{{ user.isActive ? 'Active' : 'Deactivated' }}</span>
                </div>
                <!-- Provider Specific Status -->
                <div v-if="user.role === 'cateringProvider'" class="provider-status">
                   <span :class="['approval-tag', user.approvalStatus]">
                    {{ user.approvalStatus }}
                   </span>
                </div>
              </td>
              <td class="date-cell">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="text-right">
                <div class="actions-group">
                  <button @click="viewUserDetails(user)" class="btn-icon" title="View Details">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  </button>
                  <button 
                    v-if="user.role !== 'superadmin'"
                    @click="confirmToggleStatus(user)" 
                    :class="['btn-icon', user.isActive ? 'text-danger' : 'text-success']"
                    :title="user.isActive ? 'Deactivate Account' : 'Activate Account'"
                  >
                    <svg v-if="user.isActive" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- User Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="showDetailsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>User Profile</h3>
          <button class="close-btn" @click="showDetailsModal = false">×</button>
        </div>
        
        <div v-if="selectedUser" class="modal-body">
          <div class="profile-header">
            <div class="large-avatar" :class="selectedUser.role">
              {{ (selectedUser.fullName || selectedUser.username || 'U').charAt(0).toUpperCase() }}
            </div>
            <div class="profile-title">
              <h4>{{ selectedUser.fullName || selectedUser.username }}</h4>
              <span class="email-tag">{{ selectedUser.email }}</span>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <label>Role</label>
              <p>{{ formatRole(selectedUser.role) }}</p>
            </div>
            <div class="detail-item">
              <label>Phone</label>
              <p>{{ selectedUser.phone || 'N/A' }}</p>
            </div>
             <div class="detail-item full">
              <label>Address</label>
              <p>{{ selectedUser.address || 'N/A' }}</p>
            </div>
            
            <template v-if="selectedUser.role === 'cateringProvider'">
              <div class="detail-item full">
                <label>Business Name</label>
                <p>{{ selectedUser.businessName }}</p>
              </div>
              <div class="detail-item">
                <label>Approval Status</label>
                <span :class="['approval-tag', selectedUser.approvalStatus]">{{ selectedUser.approvalStatus }}</span>
              </div>
               <div v-if="selectedUser.rejectionReason" class="detail-item full">
                <label>Rejection Reason</label>
                <p class="rejection-text">{{ selectedUser.rejectionReason }}</p>
              </div>
            </template>

            <div class="detail-item">
              <label>Account Status</label>
              <span :class="['status-text', selectedUser.isActive ? 'active-text' : 'inactive-text']">
                {{ selectedUser.isActive ? 'Active' : 'Deactivated' }}
              </span>
            </div>
            <div class="detail-item">
              <label>Joined On</label>
              <p>{{ formatDate(selectedUser.createdAt) }}</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button v-if="selectedUser && selectedUser.role !== 'superadmin'" 
            @click="confirmToggleStatus(selectedUser); showDetailsModal = false"
            :class="['btn-action', selectedUser.isActive ? 'btn-deactivate' : 'btn-activate']"
          >
            {{ selectedUser.isActive ? 'Deactivate User' : 'Activate User' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'SuperAdminUserManagement',
  components: {
    Navbar
  },
  data() {
    return {
      users: [],
      searchQuery: '',
      roleFilter: 'all',
      selectedUser: null,
      showDetailsModal: false
    }
  },
  computed: {
    filteredUsers() {
      let filtered = this.users

      // Role Filter
      if (this.roleFilter !== 'all') {
        filtered = filtered.filter(user => user.role === this.roleFilter)
      }

      // Search Filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(user => 
          (user.fullName && user.fullName.toLowerCase().includes(query)) ||
          (user.username && user.username.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query)) ||
          (user.businessName && user.businessName.toLowerCase().includes(query))
        )
      }

      return filtered
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    async loadUsers() {
      try {
        const response = await api.get('/admin/users')
        this.users = response.data
      } catch (error) {
        console.error('Error loading users:', error)
      }
    },
    formatRole(role) {
      const roles = {
        'customer': 'Customer',
        'cateringProvider': 'Provider',
        'superadmin': 'Super Admin'
      }
      return roles[role] || role
    },
    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    viewUserDetails(user) {
      this.selectedUser = user
      this.showDetailsModal = true
    },
    async confirmToggleStatus(user) {
      if (user.role === 'superadmin') return

      const action = user.isActive ? 'deactivate' : 'activate'
      if (!confirm(`Are you sure you want to ${action} this user?`)) return

      try {
        await api.put(`/admin/users/${user._id}/toggle-status`)
        // Optimistic update
        user.isActive = !user.isActive
      } catch (error) {
        console.error('Error toggling status:', error)
        alert('Failed to update user status')
      }
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
  margin-left: 260px;
  padding: 32px 40px;
}

/* Header */
.page-header {
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

/* Controls Bar */
.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-wrapper svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-group {
  display: flex;
  background: #e2e8f0;
  padding: 4px;
  border-radius: 8px;
}

.filter-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: white;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  font-weight: 600;
}

/* Table */
.table-container {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: #f8fafc;
  padding: 16px 24px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}

.users-table td {
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.users-table tr:last-child td {
  border-bottom: none;
}

.users-table tr:hover td {
  background: #f8fafc;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #cbd5e1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.avatar.superadmin { background: #ef4444; }
.avatar.cateringProvider { background: #06b6d4; }
.avatar.customer { background: #3b82f6; }

.user-info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.email {
  font-size: 12px;
  color: #64748b;
}

.business-name {
  font-size: 11px;
  color: #0891b2;
  font-weight: 500;
}

/* Badges */
.role-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.superadmin { background: #fee2e2; color: #b91c1c; }
.role-badge.cateringProvider { background: #cffafe; color: #0e7490; }
.role-badge.customer { background: #eff6ff; color: #1d4ed8; }

.status-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.active { background: #22c55e; box-shadow: 0 0 0 2px #dcfce7; }
.status-dot.inactive { background: #94a3b8; }

.status-text {
  font-size: 13px;
  color: #475569;
}

.provider-status {
  margin-top: 4px;
}

.approval-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 700;
}

.approval-tag.pending { background: #fff7ed; color: #c2410c; }
.approval-tag.approved { background: #f0fdf4; color: #15803d; }
.approval-tag.rejected { background: #fef2f2; color: #b91c1c; }

.date-cell {
  font-size: 13px;
  color: #64748b;
}

/* Actions */
.text-right { text-align: right; }

.actions-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: none;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
}

.btn-icon:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.btn-icon.text-danger:hover {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fee2e2;
}

.btn-icon.text-success:hover {
  background: #f0fdf4;
  color: #22c55e;
  border-color: #dcfce7;
}

/* Empty State */
.empty-cell { text-align: center; padding: 48px; }
.empty-state { text-align: center; }
.empty-icon { font-size: 32px; margin-bottom: 8px; }
.empty-state p { color: #64748b; font-size: 14px; }

/* Modal */
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
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: modalPop 0.2s ease-out;
}

@keyframes modalPop {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #0f172a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #94a3b8;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.profile-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.large-avatar {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #cbd5e1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}
.large-avatar.superadmin { background: #ef4444; }
.large-avatar.cateringProvider { background: #06b6d4; }
.large-avatar.customer { background: #3b82f6; }

.profile-title h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: #0f172a;
}

.email-tag {
  color: #64748b;
  font-size: 14px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-item label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 4px;
}

.detail-item p {
  margin: 0;
  font-size: 14px;
  color: #334155;
  font-weight: 500;
}

.detail-item.full {
  grid-column: 1 / -1;
}

.rejection-text {
  color: #ef4444 !important;
  background: #fef2f2;
  padding: 8px;
  border-radius: 6px;
}

.active-text { color: #15803d; font-weight: 600; }
.inactive-text { color: #94a3b8; }

.modal-footer {
  padding: 20px 24px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
}

.btn-action {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-deactivate {
  background: white;
  border: 1px solid #fee2e2;
  color: #ef4444;
}

.btn-deactivate:hover {
  background: #fef2f2;
}

.btn-activate {
  background: #0f172a;
  color: white;
}

.btn-activate:hover {
  background: #1e293b;
}

@media (max-width: 768px) {
  .main-content { margin-left: 0; padding: 20px; }
  .controls-bar { flex-direction: column; align-items: stretch; }
  .filter-group { justify-content: space-between; }
  .table-container { overflow-x: auto; }
}
</style>
