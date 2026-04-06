<template>
  <div class="admin-container">
    <Navbar />
    
    <div class="admin-content">
      <!-- Hero Section -->
      <div class="dashboard-hero">
        <div class="hero-content">
          <div class="hero-text">
            <h2>Financial Reports</h2>
            <p>Track your revenue, order volume, and business performance.</p>
          </div>
          <div class="hero-actions">
            <button @click="exportToPdf" class="btn-primary-outline">
              <span class="icon">📥</span> Export PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="filter-bar">
        <div class="date-controls">
          <div class="input-group">
            <label>From</label>
            <input type="date" v-model="dateFrom" class="form-input" />
          </div>
          <div class="input-group">
            <label>To</label>
            <input type="date" v-model="dateTo" class="form-input" />
          </div>
          <div class="action-buttons">
            <button @click="generateReport" class="btn-secondary">Filter</button>
            <button @click="showAll" class="btn-ghost">Reset</button>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">💰</div>
          <div class="stat-info">
            <span class="label">Total Revenue</span>
            <span class="value">RM {{ totalSales.toFixed(2) }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">📦</div>
          <div class="stat-info">
            <span class="label">Total Orders</span>
            <span class="value">{{ totalOrders }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">📈</div>
          <div class="stat-info">
            <span class="label">Avg. Order Value</span>
            <span class="value">RM {{ averageOrderValue.toFixed(2) }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">✅</div>
          <div class="stat-info">
            <span class="label">Completed</span>
            <span class="value">{{ completedOrders }}</span>
          </div>
        </div>
      </div>

      <div class="content-split-layout">
        <!-- Order Status Breakdown -->
        <div class="dashboard-section">
          <div class="section-header">
            <h3>Order Status Breakdown</h3>
          </div>
          <div class="status-bars-container">
            <div v-for="(count, status) in ordersByStatus" :key="status" class="status-row">
              <div class="row-header">
                <span class="status-name">{{ capitalizeStatus(status) }}</span>
                <span class="status-count">{{ count }} ({{ totalOrders ? Math.round((count/totalOrders)*100) : 0 }}%)</span>
              </div>
              <div class="progress-track">
                <div 
                  class="progress-fill" 
                  :class="status"
                  :style="{ width: (count / totalOrders * 100) + '%' }"
                ></div>
              </div>
            </div>
            <div v-if="Object.keys(ordersByStatus).length === 0" class="empty-chart">
               No order data available for this period.
            </div>
          </div>
        </div>

        <!-- Top Packages -->
        <div class="dashboard-section">
          <div class="section-header">
            <h3>Top Performing Packages</h3>
          </div>
          <div class="top-packages-list">
            <div v-for="(item, index) in topPackages" :key="index" class="package-list-item">
              <div class="rank-badge">{{ index + 1 }}</div>
              <div class="pkg-details">
                <span class="pkg-name">{{ item.name }}</span>
                <span class="pkg-sub">{{ item.count }} orders</span>
              </div>
              <div class="pkg-revenue">
                RM {{ item.revenue.toFixed(2) }}
              </div>
            </div>
            <div v-if="topPackages.length === 0" class="empty-chart">
               No package data available.
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="dashboard-section">
        <div class="section-header">
          <h3>Detailed Order Log</h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order._id">
                <td class="font-mono">{{ getOrderNumber(order) }}</td>
                <td>{{ formatDate(order.eventDate || order.createdAt) }}</td>
                <td>{{ order.customerName }}</td>
                <td class="font-bold">RM {{ order.totalAmount.toFixed(2) }}</td>
                <td><span :class="['status-pill', order.status]">{{ order.status }}</span></td>
              </tr>
              <tr v-if="filteredOrders.length === 0">
                <td colspan="5" class="empty-cell">No records found for this period.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'
import jsPDF from 'jspdf'

export default {
  components: { Navbar },
  data() {
    return {
      dateFrom: '',
      dateTo: '',
      filteredOrders: []
    }
  },
  computed: {
    allOrders() {
      const ordersStore = useOrdersStore()
      return ordersStore.allOrders
    },
    totalSales() {
      return this.filteredOrders.reduce((sum, order) => {
        if (order.status !== 'cancelled') {
          return sum + order.totalAmount
        }
        return sum
      }, 0)
    },
    totalOrders() {
      return this.filteredOrders.length
    },
    averageOrderValue() {
      return this.totalOrders > 0 ? this.totalSales / this.totalOrders : 0
    },
    completedOrders() {
      return this.filteredOrders.filter(o => o.status === 'completed').length
    },
    ordersByStatus() {
      const counts = {}
      this.filteredOrders.forEach(order => {
        counts[order.status] = (counts[order.status] || 0) + 1
      })
      return counts
    },
    topPackages() {
      const packages = {}
      this.filteredOrders.forEach(order => {
        const pkgName = order.packageName || 'Unknown Package'
        if (!packages[pkgName]) {
          packages[pkgName] = { name: pkgName, count: 0, revenue: 0 }
        }
        packages[pkgName].count += 1
        packages[pkgName].revenue += order.totalAmount || 0
      })
      return Object.values(packages).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
    }
  },
  methods: {
    capitalizeStatus(status) {
        if (!status) return ''
        return status.charAt(0).toUpperCase() + status.slice(1)
    },
    generateReport() {
      let orders = this.allOrders

      if (this.dateFrom) {
        const fromDate = new Date(this.dateFrom)
        fromDate.setHours(0, 0, 0, 0)
        orders = orders.filter(order => {
          const orderDate = new Date(order.eventDate || order.createdAt)
          orderDate.setHours(0, 0, 0, 0)
          return orderDate >= fromDate
        })
      }

      if (this.dateTo) {
        const toDate = new Date(this.dateTo)
        toDate.setHours(23, 59, 59, 999)
        orders = orders.filter(order => {
          const orderDate = new Date(order.eventDate || order.createdAt)
          orderDate.setHours(0, 0, 0, 0)
          return orderDate <= toDate
        })
      }

      this.filteredOrders = orders
    },
    showAll() {
      this.dateFrom = ''
      this.dateTo = ''
      this.filteredOrders = this.allOrders
    },
    getOrderNumber(order) {
      return order.orderNumber || `ORD-${order._id?.substring(order._id.length - 8).toUpperCase()}` || 'N/A'
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-MY', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      })
    },
    exportToPdf() {
      const doc = new jsPDF()
      
      const dateRange = this.dateFrom && this.dateTo 
        ? `${this.dateFrom} to ${this.dateTo}` 
        : 'All Time'
      
      // Get provider details from auth store
      const authStore = useAuthStore()
      const provider = authStore.currentUser
      
      // Title
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('SALES REPORT', 105, 15, { align: 'center' })
      
      // Provider Details Box
      doc.setFillColor(59, 130, 246)
      doc.rect(14, 22, 182, 18, 'F')
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(255, 255, 255)
      doc.text('PROVIDER DETAILS', 16, 27)
      doc.setFont('helvetica', 'normal')
      doc.text(`Business: ${provider?.businessName || provider?.fullName || 'N/A'}`, 16, 32)
      doc.text(`Email: ${provider?.email || 'N/A'}`, 16, 36)
      doc.text(`Phone: ${provider?.phone || 'N/A'}`, 100, 32)
      doc.text(`Generated: ${new Date().toLocaleDateString('en-MY')} ${new Date().toLocaleTimeString('en-MY')}`, 100, 36)
      
      // Report Info
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.text(`Report Period: ${dateRange}`, 14, 45)
      
      // Executive Summary Box
      doc.setFillColor(240, 240, 240)
      doc.rect(14, 50, 182, 30, 'F')
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('EXECUTIVE SUMMARY', 16, 57)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const completionRate = this.totalOrders > 0 ? ((this.completedOrders / this.totalOrders) * 100).toFixed(1) : 0
      doc.text(`Total Orders: ${this.totalOrders}`, 16, 63)
      doc.text(`Total Revenue: RM ${this.totalSales.toFixed(2)}`, 16, 68)
      doc.text(`Average Order: RM ${this.averageOrderValue.toFixed(2)}`, 16, 73)
      doc.text(`Completed: ${this.completedOrders} (${completionRate}%)`, 16, 78)
      
      let yPos = 90
      
      // Order Status Breakdown
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('ORDER STATUS BREAKDOWN', 14, yPos)
      yPos += 7
      
      // Draw table manually
      const statusHeaders = ['Status', 'Count', 'Percentage']
      const colWidths = [80, 50, 50]
      const rowHeight = 8
      
      // Header row
      doc.setFillColor(59, 130, 246)
      doc.rect(14, yPos, 182, rowHeight, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      statusHeaders.forEach((header, i) => {
        const x = 14 + colWidths.slice(0, i).reduce((a, b) => a + b, 0)
        doc.text(header, x + 2, yPos + 5.5)
      })
      yPos += rowHeight
      
      // Data rows
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      Object.entries(this.ordersByStatus).forEach(([status, count], index) => {
        const percentage = this.totalOrders > 0 ? ((count / this.totalOrders) * 100).toFixed(1) : 0
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240)
          doc.rect(14, yPos, 182, rowHeight, 'F')
        }
        doc.text(status.charAt(0).toUpperCase() + status.slice(1), 16, yPos + 5.5)
        doc.text(count.toString(), 96, yPos + 5.5)
        doc.text(`${percentage}%`, 146, yPos + 5.5)
        yPos += rowHeight
      })
      
      // Table border
      doc.setDrawColor(200, 200, 200)
      doc.rect(14, 97, 182, yPos - 97)
      
      yPos += 10
      
      // Top Packages
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('TOP 5 PACKAGES BY REVENUE', 14, yPos)
      yPos += 7
      
      const pkgHeaders = ['Rank', 'Package Name', 'Orders', 'Revenue', 'Avg/Order']
      const pkgColWidths = [20, 70, 25, 35, 32]
      
      // Header
      doc.setFillColor(59, 130, 246)
      doc.rect(14, yPos, 182, rowHeight, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      pkgHeaders.forEach((header, i) => {
        const x = 14 + pkgColWidths.slice(0, i).reduce((a, b) => a + b, 0)
        doc.text(header, x + 2, yPos + 5.5)
      })
      yPos += rowHeight
      
      // Data rows
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      const startY = yPos
      this.topPackages.forEach((pkg, index) => {
        const avgPerOrder = pkg.count > 0 ? (pkg.revenue / pkg.count).toFixed(2) : 0
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240)
          doc.rect(14, yPos, 182, rowHeight, 'F')
        }
        doc.text((index + 1).toString(), 16, yPos + 5.5)
        doc.text(pkg.name.substring(0, 30), 36, yPos + 5.5)
        doc.text(pkg.count.toString(), 108, yPos + 5.5)
        doc.text(`RM ${pkg.revenue.toFixed(2)}`, 119, yPos + 5.5)
        doc.text(`RM ${avgPerOrder}`, 156, yPos + 5.5)
        yPos += rowHeight
      })
      
      // Table border
      doc.setDrawColor(200, 200, 200)
      doc.rect(14, startY - rowHeight, 182, (this.topPackages.length + 1) * rowHeight)
      
      // New page for detailed orders
      doc.addPage()
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('DETAILED ORDER LIST', 105, 15, { align: 'center' })
      
      yPos = 25
      const orderHeaders = ['Order #', 'Date', 'Package', 'Customer', 'Pax', 'Amount', 'Status']
      const orderColWidths = [28, 22, 38, 32, 15, 25, 22]
      
      // Header
      doc.setFillColor(59, 130, 246)
      doc.rect(14, yPos, 182, rowHeight, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      orderHeaders.forEach((header, i) => {
        const x = 14 + orderColWidths.slice(0, i).reduce((a, b) => a + b, 0)
        doc.text(header, x + 1, yPos + 5.5)
      })
      yPos += rowHeight
      
      // Data rows
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      this.filteredOrders.forEach((order, index) => {
        // Add new page if needed
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
          // Repeat header
          doc.setFillColor(59, 130, 246)
          doc.rect(14, yPos, 182, rowHeight, 'F')
          doc.setTextColor(255, 255, 255)
          doc.setFontSize(9)
          doc.setFont('helvetica', 'bold')
          orderHeaders.forEach((header, i) => {
            const x = 14 + orderColWidths.slice(0, i).reduce((a, b) => a + b, 0)
            doc.text(header, x + 1, yPos + 5.5)
          })
          yPos += rowHeight
          doc.setTextColor(0, 0, 0)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8)
        }
        
        if (index % 2 === 0) {
          doc.setFillColor(240, 240, 240)
          doc.rect(14, yPos, 182, rowHeight, 'F')
        }
        
        doc.text(this.getOrderNumber(order), 15, yPos + 5.5)
        doc.text(this.formatDate(order.eventDate || order.createdAt), 43, yPos + 5.5)
        doc.text((order.packageName || 'N/A').substring(0, 14), 66, yPos + 5.5)
        doc.text((order.customerName || '').substring(0, 11), 105, yPos + 5.5)
        doc.text((order.numberOfPax || 0).toString(), 138, yPos + 5.5)
        doc.text(`${order.totalAmount.toFixed(0)}`, 154, yPos + 5.5)
        doc.text((order.status || 'pending').toUpperCase(), 173, yPos + 5.5)
        
        yPos += rowHeight
      })
      
      // Footer with page numbers
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(100, 100, 100)
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' })
      }
      
      // Save PDF
      const filename = `Sales_Report_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
    }
  },
  async mounted() {
    const ordersStore = useOrdersStore()
    await ordersStore.fetchAllOrders()
    
    // Default to last 30 days
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    this.dateTo = today.toISOString().split('T')[0]
    this.dateFrom = thirtyDaysAgo.toISOString().split('T')[0]
    
    this.generateReport()
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
  padding: 24px 32px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-text h2 {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
}

.hero-text p {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.btn-primary-outline {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary-outline:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* Filters */
.filter-bar {
  background: white;
  border-radius: 12px;
  padding: 16px 24px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.date-controls {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
  color: #334155;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.btn-secondary {
  background: #0f172a;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover { background: #1e293b; }

.btn-ghost {
  background: none;
  border: none;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
}

.btn-ghost:hover { color: #0f172a; text-decoration: underline; }

/* Dashboard Sections */
.dashboard-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.section-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.blue { background: #eff6ff; color: #3b82f6; }
.stat-icon.purple { background: #f3e8ff; color: #a855f7; }
.stat-icon.green { background: #ecfdf5; color: #10b981; }
.stat-icon.orange { background: #fff7ed; color: #f97316; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-info .label { font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 4px; }
.stat-info .value { font-size: 20px; font-weight: 800; color: #0f172a; }

/* Split Layout */
.content-split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

/* Charts & Bars */
.status-row { margin-bottom: 16px; }

.row-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
}

.status-name { font-weight: 600; color: #334155; }
.status-count { color: #64748b; }

.progress-track {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill { height: 100%; border-radius: 4px; }
.progress-fill.pending { background: #fbbf24; }
.progress-fill.confirmed { background: #3b82f6; }
.progress-fill.preparing { background: #f97316; }
.progress-fill.ready { background: #8b5cf6; }
.progress-fill.completed { background: #10b981; }
.progress-fill.cancelled { background: #ef4444; }

/* Top Packages */
.package-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.package-list-item:last-child { border-bottom: none; }

.rank-badge {
  width: 24px;
  height: 24px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.pkg-details { flex: 1; display: flex; flex-direction: column; }
.pkg-name { font-size: 14px; font-weight: 600; color: #1e293b; }
.pkg-sub { font-size: 12px; color: #94a3b8; }
.pkg-revenue { font-size: 14px; font-weight: 700; color: #0f172a; }

/* Table */
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; padding: 12px 16px; background: #f8fafc; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; }
.data-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
.data-table tr:hover td { background: #f8fafc; }

.font-mono { font-family: 'Monaco', monospace; font-size: 13px; color: #64748b; }
.font-bold { font-weight: 600; }

.status-pill {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: capitalize;
}

.status-pill.pending { background: #fff7ed; color: #c2410c; }
.status-pill.confirmed { background: #eff6ff; color: #1d4ed8; }
.status-pill.preparing { background: #f5f3ff; color: #7c3aed; }
.status-pill.ready { background: #ecfdf5; color: #047857; }
.status-pill.completed { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.status-pill.cancelled { background: #fef2f2; color: #b91c1c; }

.empty-cell, .empty-chart { text-align: center; padding: 40px; color: #94a3b8; font-size: 14px; }

@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .content-split-layout { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .admin-content { margin-left: 0; width: 100%; padding: 16px; }
  .stats-grid { grid-template-columns: 1fr; }
  .date-controls { flex-direction: column; align-items: stretch; }
  .action-buttons { margin-left: 0; justify-content: stretch; }
  .btn-secondary, .btn-ghost { width: 100%; text-align: center; }
}
</style>
