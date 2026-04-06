<template>
  <div class="admin-container">
    <Navbar />
    
    <div class="main-content">
      <header class="page-header">
        <div class="header-content">
          <h1>System Settings</h1>
          <p>Configure platform behavior and manage system maintenance.</p>
        </div>
      </header>

      <div class="settings-grid">
        
        <!-- Platform Status Card -->
        <div class="settings-card status-card">
          <div class="card-header">
            <h3>Platform Status</h3>
            <span class="status-badge live">System Operational</span>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="label">Version</span>
              <span class="value">v1.2.0 (Stable)</span>
            </div>
            <div class="info-row">
              <span class="label">Environment</span>
              <span class="value">Production</span>
            </div>
            <div class="info-row">
              <span class="label">Database Status</span>
              <span class="value success">Connected (MongoDB Atlas)</span>
            </div>
             <div class="info-row">
              <span class="label">Server Time</span>
              <span class="value">{{ currentTime }}</span>
            </div>
          </div>
        </div>

        <!-- Configuration Card -->
        <div class="settings-card">
          <div class="card-header">
            <h3>Configuration</h3>
            <p>Manage access control and features</p>
          </div>
          <div class="card-body">
            
            <div class="setting-item">
              <div class="setting-info">
                <h4>Maintenance Mode</h4>
                <p>Prevent users from accessing the platform during updates.</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="config.maintenanceMode" @change="saveConfig">
                <span class="slider round"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <h4>User Registration</h4>
                <p>Allow new customers to create accounts.</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="config.registrationEnabled" @change="saveConfig">
                <span class="slider round"></span>
              </label>
            </div>
            
             <div class="setting-item">
              <div class="setting-info">
                <h4>Provider Registration</h4>
                <p>Allow new catering providers to sign up.</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="config.providerRegistrationEnabled" @change="saveConfig">
                <span class="slider round"></span>
              </label>
            </div>

          </div>
        </div>

        <!-- Data Management Card -->
        <div class="settings-card">
          <div class="card-header">
             <h3>Data & System</h3>
             <p>Perform administrative actions</p>
          </div>
          <div class="card-body actions-body">
            <div class="action-row">
              <div class="action-info">
                <h4>Clear System Cache</h4>
                <p>Remove temporary files and cached data.</p>
              </div>
              <button class="btn-action secondary" @click="clearCache">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                 Clear Cache
              </button>
            </div>

             <div class="action-row">
              <div class="action-info">
                <h4>Export User Data</h4>
                <p>Download a CSV of all user records.</p>
              </div>
              <button class="btn-action primary" @click="exportData">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export CSV
              </button>
            </div>
            
             <div class="action-row danger">
              <div class="action-info">
                <h4>System Logs</h4>
                <p>View error logs and access attempts.</p>
              </div>
              <button class="btn-action outline" @click="viewLogs">
                View Logs
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" class="toast-notification">
      Settings Saved Successfully
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'SuperAdminSettings',
  components: {
    Navbar
  },
  data() {
    return {
      config: {
        maintenanceMode: false,
        registrationEnabled: true,
        providerRegistrationEnabled: true
      },
      currentTime: '',
      timer: null,
      showToast: false
    }
  },
  mounted() {
    this.loadConfig()
    this.startClock()
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    startClock() {
      this.updateTime()
      this.timer = setInterval(this.updateTime, 1000)
    },
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString()
    },
    async loadConfig() {
      try {
        const response = await api.get('/admin/config')
        if (response.data) {
          this.config = { ...this.config, ...response.data }
        }
      } catch (error) {
        console.error('Error loading config:', error)
      }
    },
    async saveConfig() {
      try {
        await api.put('/admin/config', this.config)
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
        }, 3000)
      } catch (error) {
        console.error('Error saving config:', error)
        alert('Failed to save settings')
      }
    },
    clearCache() {
      if (confirm('Clear all system cache? This might affect performance temporarily.')) {
        // Mock action
         setTimeout(() => alert('Cache cleared successfully'), 500)
      }
    },
    exportData() {
      // Mock action
      alert('Data export started. Download will begin shortly.')
    },
    viewLogs() {
      alert('Log viewer is not yet implemented.')
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

/* Grid */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.settings-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.card-header p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #64748b;
}

.card-body {
  padding: 24px;
}

/* Status Card */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.live {
  background: #f0fdf4;
  color: #15803d;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-badge.live::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #15803d;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #bbf7d0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f8fafc;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
}

.info-row .value {
  color: #0f172a;
  font-weight: 600;
  font-size: 14px;
}

.value.success {
  color: #15803d;
}

/* Toggle Switches */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
}

.setting-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.setting-item:first-child {
  padding-top: 0;
}

.setting-info h4 {
  margin: 0 0 4px 0;
  font-size: 15px;
  color: #334155;
}

.setting-info p {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
}

/* Toggle Switch CSS */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #3b82f6;
}

input:focus + .slider {
  box-shadow: 0 0 1px #3b82f6;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Actions */
.action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.action-row:last-child {
  margin-bottom: 0;
}

.action-info h4 {
  font-size: 14px;
  margin: 0 0 2px 0;
  color: #334155;
}

.action-info p {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-action.primary {
  background: #0f172a;
  color: white;
}

.btn-action.primary:hover {
  background: #1e293b;
}

.btn-action.secondary {
  background: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.btn-action.secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn-action.outline {
  background: white;
  border: 1px dashed #cbd5e1;
  color: #64748b;
}

/* Toast */
.toast-notification {
  position: fixed;
  bottom: 32px;
  right: 32px;
  background: #0f172a;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
  z-index: 100;
}

@keyframes slideIn {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 768px) {
  .main-content { margin-left: 0; padding: 20px; }
  .settings-grid { grid-template-columns: 1fr; }
}
</style>
