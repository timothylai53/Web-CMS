<template>
  <div class="admin-container">
    <Navbar />
    
    <div class="admin-content">
      <!-- Modern Hero -->
      <div class="dashboard-hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="hero-text">
            <h2>Event Schedule</h2>
            <p>Track your upcoming catering events and delivery details.</p>
          </div>
          <div class="stats-summary">
            <div class="stat-pill blue">
              <span class="label">Today</span>
              <span class="value">{{ todaysEventsCount }}</span>
            </div>
            <div class="stat-pill purple">
              <span class="label">Upcoming</span>
              <span class="value">{{ upcomingEventsCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="content-grid-layout">
        <!-- Calendar Section -->
        <div class="dashboard-section calendar-column">
          <div class="card-header-row">
            <h3>Calendar</h3>
            <div class="calendar-controls">
              <button @click="previousMonth" class="btn-icon-nav">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <span class="current-month">{{ currentMonthYear }}</span>
              <button @click="nextMonth" class="btn-icon-nav">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>

          <div class="calendar-card">
            <div class="calendar-grid-header">
              <div class="day-label" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
            </div>
            
            <div class="calendar-grid-body">
              <div 
                v-for="(day, index) in calendarDays" 
                :key="index"
                :class="['calendar-day-cell', { 
                  'other-month': day.otherMonth,
                  'is-today': day.isToday,
                  'is-selected': isSelectedDate(day.date),
                  'has-event': day.eventCount > 0
                }]"
                @click="selectDate(day)"
              >
                <span class="day-number">{{ day.day }}</span>
                <div v-if="day.eventCount > 0" class="event-dot-indicator">
                  <span class="dot"></span>
                  <span v-if="day.eventCount > 1" class="count-badge">{{ day.eventCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Events List Section -->
        <div class="dashboard-section events-column">
          <div class="section-header">
            <h3>{{ selectedDateDisplay }}</h3>
          </div>

          <div v-if="eventsForSelectedDate.length === 0" class="empty-state-card">
            <div class="empty-icon">📅</div>
            <p>No events scheduled for this date.</p>
          </div>

          <div v-else class="events-list-stack">
            <div v-for="event in eventsForSelectedDate" :key="event._id" class="event-detail-card">
              <div class="event-card-header">
                <div>
                  <h4>{{ event.customerName || 'Customer Event' }}</h4>
                  <span class="order-ref">Order #{{ (event._id || '').slice(-6) }}</span>
                </div>
                <span :class="['status-pill', event.status]">{{ capitalizeStatus(event.status) }}</span>
              </div>
              
              <div class="event-info-grid">
                <div class="info-item">
                  <span class="icon">📦</span>
                  <span class="text">{{ event.packageName }}</span>
                </div>
                <div class="info-item">
                  <span class="icon">🕐</span>
                  <span class="text">{{ event.eventTime || 'Not specified' }}</span>
                </div>
                <div class="info-item">
                  <span class="icon">👥</span>
                  <span class="text">{{ event.numberOfPax }} Pax</span>
                </div>
                <div class="info-item full-width">
                  <span class="icon">📍</span>
                  <span class="text">{{ event.location || 'Not specified' }}</span>
                </div>
              </div>

              <div class="event-contact-box">
                <div class="contact-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>{{ event.customerPhone || 'N/A' }}</span>
                </div>
                <div class="contact-row">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>{{ event.customerEmail || 'N/A' }}</span>
                </div>
              </div>

              <div class="event-footer-actions">
                <button @click="viewOrderDetails(event)" class="btn-link">
                  View Full Details →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/Navbar.vue'

export default {
  components: { Navbar },
  data() {
    return {
      currentDate: new Date(),
      selectedDate: new Date(),
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    }
  },
  computed: {
    allOrders() {
      const ordersStore = useOrdersStore()
      // Show all orders except pending in the events calendar
      return ordersStore.allOrders.filter(o => 
        o.eventDate && o.status !== 'pending' && o.status !== 'cancelled'
      )
    },
    todaysEventsCount() {
       const today = new Date();
       return this.allOrders.filter(o => {
          const d = new Date(o.eventDate);
          return d.getDate() === today.getDate() && 
                 d.getMonth() === today.getMonth() && 
                 d.getFullYear() === today.getFullYear();
       }).length;
    },
    upcomingEventsCount() {
       const today = new Date();
       // Next 7 days
       const nextWeek = new Date(today);
       nextWeek.setDate(today.getDate() + 7);
       
       return this.allOrders.filter(o => {
          const d = new Date(o.eventDate);
          return d > today && d <= nextWeek;
       }).length;
    },
    currentMonthYear() {
      return this.currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    },
    selectedDateDisplay() {
      return this.selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'short', 
        day: 'numeric' 
      })
    },
    calendarDays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()
      
      const startingDayOfWeek = firstDay.getDay()
      
      const days = []
      
      // Previous month days
      const prevMonthLastDay = new Date(year, month, 0).getDate()
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i
        days.push({
          day,
          date: new Date(year, month - 1, day),
          otherMonth: true,
          isToday: false,
          hasEvent: false,
          eventCount: 0
        })
      }
      
      // Current month days
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i)
        const eventCount = this.allOrders.filter(o => {
          // Parse the event date as local date (ignore time/timezone)
          const eventDate = new Date(o.eventDate)
          return eventDate.getFullYear() === year &&
                 eventDate.getMonth() === month &&
                 eventDate.getDate() === i
        }).length
        
        days.push({
          day: i,
          date,
          otherMonth: false,
          isToday: this.isToday(date),
          hasEvent: eventCount > 0,
          eventCount
        })
      }
      
      // Next month days
      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          day: i,
          date: new Date(year, month + 1, i),
          otherMonth: true,
          isToday: false,
          hasEvent: false,
          eventCount: 0
        })
      }
      
      return days
    },
    eventsForSelectedDate() {
      return this.allOrders.filter(o => {
        const eventDate = new Date(o.eventDate)
        return eventDate.getFullYear() === this.selectedDate.getFullYear() &&
               eventDate.getMonth() === this.selectedDate.getMonth() &&
               eventDate.getDate() === this.selectedDate.getDate()
      })
    }
  },
  methods: {
    isToday(date) {
      const today = new Date()
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear()
    },
    isSelectedDate(date) {
      return date.getDate() === this.selectedDate.getDate() &&
             date.getMonth() === this.selectedDate.getMonth() &&
             date.getFullYear() === this.selectedDate.getFullYear()
    },
    previousMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      )
    },
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      )
    },
    selectDate(day) {
        this.selectedDate = day.date
        if (day.otherMonth) {
            this.currentDate = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
        }
    },
    capitalizeStatus(status) {
      if (!status) return 'Pending'
      return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    },
    viewOrderDetails(event) {
      this.$router.push('/provider/orders')
    }
  },
  async mounted() {
    const ordersStore = useOrdersStore()
    const authStore = useAuthStore()
    // Explicitly pass provider ID to ensure we only get this provider's orders
    if (authStore.user?.id) {
        await ordersStore.fetchProviderOrders(authStore.user.id)
    } else {
        await ordersStore.fetchAllOrders()
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
  background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent 70%);
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

.stats-summary { display: flex; gap: 16px; }

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

/* Layout Grid */
.content-grid-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 32px;
  align-items: start;
}

.dashboard-section { margin-bottom: 0; }

.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header-row h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* Calendar Card */
.calendar-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 24px;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.current-month {
  font-weight: 600;
  color: #0f172a;
  min-width: 130px;
  text-align: center;
  font-size: 14px;
}

.btn-icon-nav {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.btn-icon-nav:hover { background: #f1f5f9; color: #0f172a; }

.calendar-grid-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 12px;
}

.day-label {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
}

.calendar-grid-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day-cell {
  aspect-ratio: 1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  font-size: 14px;
  color: #334155;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.calendar-day-cell:hover { background: #f8fafc; border-color: #e2e8f0; }

.calendar-day-cell.other-month { color: #cbd5e1; }

.calendar-day-cell.is-today {
  font-weight: 700;
  color: #0f172a;
  background: #f1f5f9;
}

.calendar-day-cell.is-selected {
  background: #0f172a;
  color: white;
}

.calendar-day-cell.is-selected:hover { background: #1e293b; }

.event-dot-indicator {
  margin-top: 4px;
  display: flex;
  align-items: center;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ef4444; /* Default red for event */
}

.calendar-day-cell.is-selected .dot { background: #fca5a5; }

.count-badge {
  font-size: 9px;
  margin-left: 2px;
  opacity: 0.8;
}

/* Events List */
.events-column .section-header { margin-bottom: 16px; }
.events-column h3 { font-size: 18px; font-weight: 700; color: #1e293b; }

.empty-state-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 48px;
  text-align: center;
  color: #94a3b8;
}

.empty-icon { font-size: 40px; margin-bottom: 16px; display: block; }

.events-list-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.event-detail-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s;
}

.event-detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.event-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.event-card-header h4 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.order-ref {
  font-size: 12px;
  font-family: 'Monaco', monospace;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
}

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

.event-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.info-item.full-width { grid-column: 1 / -1; }

.info-item .icon { font-size: 16px; width: 20px; text-align: center; }
.info-item .text { font-size: 14px; color: #334155; font-weight: 500; }

.event-contact-box {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  gap: 24px;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
}

.event-footer-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-link {
  background: none;
  border: none;
  color: #0f172a;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-link:hover { text-decoration: underline; }

@media (max-width: 1024px) {
  .content-grid-layout { grid-template-columns: 1fr; }
  .calendar-column { max-width: 500px; margin: 0 auto 32px auto; width: 100%; }
}

@media (max-width: 768px) {
  .admin-content { margin-left: 0; width: 100%; padding: 16px; }
  .stats-summary { display: none; }
  .event-contact-box { flex-direction: column; gap: 8px; }
}
</style>
