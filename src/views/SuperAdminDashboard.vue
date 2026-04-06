<!--
  Super Admin Dashboard
  Role: Super Admin
  Function: Overview of system statistics and quick actions
  Features:
    - Total users, providers, customers count
    - Pending provider applications
    - System health metrics
    - Quick action buttons
-->

<template>
  <div class="admin-container">
    <Navbar />
    
    <div class="main-content">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>Dashboard Overview</h1>
          <p>Welcome back, Super Admin. Here's what's happening today.</p>
        </div>
        <div class="header-actions">
          <button class="refresh-btn" @click="refreshData">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
            Refresh
          </button>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon users">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="stat-info">
            <p class="stat-label">Total Users</p>
            <h3 class="stat-value">{{ statistics.totalUsers || 0 }}</h3>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon providers">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <div class="stat-info">
            <p class="stat-label">Service Providers</p>
            <h3 class="stat-value">{{ statistics.totalProviders || 0 }}</h3>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon pending">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-info">
            <p class="stat-label">Pending Reviews</p>
            <h3 class="stat-value">{{ statistics.pendingProviders || 0 }}</h3>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon customers">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div class="stat-info">
            <p class="stat-label">Active Customers</p>
            <h3 class="stat-value">{{ statistics.totalCustomers || 0 }}</h3>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Quick Actions -->
        <section class="action-section">
          <h2 class="section-title">Quick Actions</h2>
          <div class="actions-list">
            <router-link to="/superadmin/provider-approval" class="action-item">
              <div class="action-icon-wrapper blue">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div class="action-details">
                <h3>Review Applications</h3>
                <p>Manage provider approval requests</p>
              </div>
              <div v-if="statistics.pendingProviders > 0" class="notification-badge">{{ statistics.pendingProviders }}</div>
              <div class="chevron">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </router-link>

            <router-link to="/superadmin/user-management" class="action-item">
              <div class="action-icon-wrapper purple">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              </div>
              <div class="action-details">
                <h3>Manage Users</h3>
                <p>View, edit, or suspend user accounts</p>
              </div>
              <div class="chevron">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </router-link>

            <router-link to="/superadmin/settings" class="action-item">
              <div class="action-icon-wrapper gray">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </div>
              <div class="action-details">
                <h3>System Settings</h3>
                <p>Configure platform preferences</p>
              </div>
              <div class="chevron">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </router-link>
          </div>
        </section>

        <!-- Recent Activity -->
        <section class="activity-section">
          <div class="section-header">
            <h2 class="section-title">New Applications</h2>
            <router-link to="/superadmin/provider-approval" class="view-all">View All</router-link>
          </div>
          
          <div v-if="recentApplications.length > 0" class="activity-list">
            <div v-for="app in recentApplications" :key="app._id" class="activity-card">
              <div class="provider-avatar">
                {{ (app.businessName || app.username).charAt(0).toUpperCase() }}
              </div>
              <div class="activity-details">
                <h4>{{ app.businessName || app.username }}</h4>
                <p>{{ app.email }}</p>
                <span class="timestamp">Applied recently</span>
              </div>
              <div class="activity-status">
                <span :class="['status-chip', app.approvalStatus]">
                  {{ app.approvalStatus }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <div class="empty-icon">📂</div>
            <p>No new applications found</p>
            <span>All caught up! New provider requests will appear here.</span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'SuperAdminDashboard',
  components: {
    Navbar
  },
  data() {
    return {
      statistics: {},
      recentApplications: []
    }
  },
  async mounted() {
    await this.refreshData()
  },
  methods: {
    async refreshData() {
      await Promise.all([
        this.loadStatistics(),
        this.loadRecentApplications()
      ])
    },
    async loadStatistics() {
      try {
        const response = await api.get('/admin/statistics')
        this.statistics = response.data
      } catch (error) {
        console.error('Error loading statistics:', error)
      }
    },
    async loadRecentApplications() {
      try {
        const response = await api.get('/admin/providers/pending')
        this.recentApplications = response.data.slice(0, 5)
      } catch (error) {
        console.error('Error loading applications:', error)
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
  margin-left: 260px; /* Matching sidebar width */
  padding: 32px 40px;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
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

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column; /* Vert layout for modern look */
  gap: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.users { background: #eff6ff; color: #3b82f6; }
.stat-icon.providers { background: #f0fdf4; color: #10b981; }
.stat-icon.pending { background: #fff7ed; color: #f97316; }
.stat-icon.customers { background: #f5f3ff; color: #8b5cf6; }

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.2;
}

/* Dashboard Grid (Actions & Activity) */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
}

/* Quick Actions */
.actions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 20px;
  border-radius: 16px;
  text-decoration: none;
  border: 1px solid #f1f5f9;
  transition: all 0.2s;
  position: relative;
}

.action-item:hover {
  border-color: #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.action-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon-wrapper.blue { background: #eff6ff; color: #3b82f6; }
.action-icon-wrapper.purple { background: #f5f3ff; color: #8b5cf6; }
.action-icon-wrapper.gray { background: #f1f5f9; color: #475569; }

.action-details h3 {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.action-details p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.notification-badge {
  background: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
}

.chevron {
  margin-left: auto;
  color: #cbd5e1;
}

/* Recent Activity */
.activity-section {
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-all {
  font-size: 13px;
  font-weight: 600;
  color: #3b82f6;
  text-decoration: none;
}

.view-all:hover { text-decoration: underline; }

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.provider-avatar {
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #64748b;
  font-size: 14px;
}

.activity-details {
  flex: 1;
}

.activity-details h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.activity-details p {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 2px 0;
}

.timestamp {
  font-size: 11px;
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

.empty-state {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 16px;
  border: 1px dashed #cbd5e1;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.empty-state p {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.empty-state span {
  font-size: 13px;
  color: #64748b;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dashboard-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .main-content { margin-left: 0; padding: 20px; }
  .stats-grid { grid-template-columns: 1fr; }
  .header-actions { display: none; }
}
</style>
