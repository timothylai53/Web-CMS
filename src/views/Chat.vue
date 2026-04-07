<template>
  <div class="chat-container">
    <Navbar />
    
    <div class="main-content">
      <div class="chat-layout">
        
        <!-- Conversation List Sidebar -->
        <div class="conversations-panel" :class="{ 'mobile-hidden': activeChat }">
          <div class="panel-header">
            <h2>Messages</h2>
            <span v-if="totalUnread > 0" class="unread-total">{{ totalUnread }}</span>
          </div>
          
          <div class="search-bar">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input v-model="searchQuery" placeholder="Search conversations..." />
          </div>

          <div class="conversations-list">
            <div v-if="filteredConversations.length === 0" class="no-conversations">
              <div class="empty-chat-icon">💬</div>
              <p>No conversations yet</p>
              <p class="hint" v-if="isCustomer">Visit a provider's page to start chatting!</p>
            </div>
            
            <div 
              v-for="conv in filteredConversations" 
              :key="conv.user._id"
              :class="['conversation-item', { active: activeChat === conv.user._id, unread: conv.unreadCount > 0 }]"
              @click="openChat(conv.user)"
            >
              <div class="conv-avatar" :class="conv.user.role">
                {{ getInitial(conv.user) }}
              </div>
              <div class="conv-info">
                <div class="conv-top">
                  <span class="conv-name">{{ getDisplayName(conv.user) }}</span>
                  <span class="conv-time">{{ formatTime(conv.lastMessage?.createdAt) }}</span>
                </div>
                <div class="conv-bottom">
                  <p class="conv-preview">{{ getConvPreview(conv) }}</p>
                  <span v-if="conv.unreadCount > 0" class="unread-badge">{{ conv.unreadCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Panel -->
        <div class="chat-panel" :class="{ 'mobile-visible': activeChat }">
          <!-- No Active Chat -->
          <div v-if="!activeChat" class="no-chat-selected">
            <div class="placeholder-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h3>Select a Conversation</h3>
            <p>Choose from your existing conversations or start a new one</p>
          </div>

          <!-- Active Chat -->
          <template v-else>
            <!-- Chat Header -->
            <div class="chat-header">
              <button class="back-btn" @click="activeChat = null">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <div class="chat-user-info">
                <div class="chat-avatar" :class="activeChatUser?.role">
                  {{ getInitial(activeChatUser) }}
                </div>
                <div>
                  <h3>{{ getDisplayName(activeChatUser) }}</h3>
                  <span class="chat-role">{{ activeChatUser?.role === 'cateringProvider' ? 'Catering Provider' : 'Customer' }}</span>
                </div>
              </div>
            </div>

            <!-- Messages Area -->
            <div class="messages-area" ref="messagesContainer">
              <div v-if="loadingMessages" class="loading-messages">
                <div class="spinner-small"></div>
                <span>Loading messages...</span>
              </div>
              
              <div v-else-if="messages.length === 0" class="no-messages">
                <p>No messages yet. Say hello! 👋</p>
              </div>

              <template v-else>
                <div 
                  v-for="msg in messages" 
                  :key="msg._id"
                  :class="['message-bubble', msg.sender === currentUserId ? 'sent' : 'received']"
                >
                  <!-- Image Message -->
                  <div v-if="msg.messageType === 'image'" class="image-message">
                    <img 
                      :src="getFileUrl(msg.fileUrl)" 
                      :alt="msg.fileName" 
                      class="chat-image"
                      @click="openImagePreview(msg)"
                    />
                  </div>

                  <!-- Document Message -->
                  <div v-else-if="msg.messageType === 'document'" class="document-message" @click="downloadFile(msg)">
                    <div class="doc-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                    </div>
                    <div class="doc-info">
                      <span class="doc-name">{{ msg.fileName }}</span>
                      <span class="doc-size">{{ formatFileSize(msg.fileSize) }}</span>
                    </div>
                    <div class="doc-download">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </div>
                  </div>

                  <!-- Text Message -->
                  <p v-else class="message-text">{{ msg.message }}</p>

                  <!-- Time + Read Status -->
                  <div class="message-meta">
                    <span class="message-time">{{ formatMessageTime(msg.createdAt) }}</span>
                    <!-- Double tick for sent messages -->
                    <span v-if="msg.sender === currentUserId" class="tick-status">
                      <!-- Read: Blue double tick -->
                      <svg v-if="msg.read" class="tick-icon read" xmlns="http://www.w3.org/2000/svg" width="16" height="11" viewBox="0 0 16 11">
                        <path d="M11.071 0.929L4.5 7.5L1.929 4.929L0.515 6.343L4.5 10.328L12.485 2.343L11.071 0.929Z" fill="currentColor"/>
                        <path d="M14.071 0.929L7.5 7.5L6.743 6.743L5.329 8.157L7.5 10.328L15.485 2.343L14.071 0.929Z" fill="currentColor"/>
                      </svg>
                      <!-- Delivered: Grey double tick -->
                      <svg v-else class="tick-icon delivered" xmlns="http://www.w3.org/2000/svg" width="16" height="11" viewBox="0 0 16 11">
                        <path d="M11.071 0.929L4.5 7.5L1.929 4.929L0.515 6.343L4.5 10.328L12.485 2.343L11.071 0.929Z" fill="currentColor"/>
                        <path d="M14.071 0.929L7.5 7.5L6.743 6.743L5.329 8.157L7.5 10.328L15.485 2.343L14.071 0.929Z" fill="currentColor"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </template>
            </div>

            <!-- File Upload Preview -->
            <div v-if="filePreview" class="file-preview-bar">
              <div class="file-preview-content">
                <img v-if="filePreview.type === 'image'" :src="filePreview.url" class="preview-thumb" />
                <div v-else class="preview-doc-icon">📄</div>
                <div class="preview-info">
                  <span class="preview-name">{{ filePreview.name }}</span>
                  <span class="preview-size">{{ formatFileSize(filePreview.size) }}</span>
                </div>
              </div>
              <button @click="cancelFileUpload" class="preview-cancel">✕</button>
            </div>

            <!-- Message Input -->
            <div class="message-input-area">
              <!-- Attachment Button -->
              <div class="attach-wrapper">
                <button @click="toggleAttachMenu" class="attach-btn" title="Attach file">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                </button>
                <!-- Attach Menu Popup -->
                <div v-if="showAttachMenu" class="attach-menu">
                  <label class="attach-option" @click="showAttachMenu = false">
                    <span class="attach-option-icon image-icon">🖼️</span>
                    <span>Photo</span>
                    <input type="file" accept="image/*" @change="handleFileSelect($event, 'image')" hidden />
                  </label>
                  <label class="attach-option" @click="showAttachMenu = false">
                    <span class="attach-option-icon doc-icon-opt">📄</span>
                    <span>Document</span>
                    <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv" @change="handleFileSelect($event, 'document')" hidden />
                  </label>
                </div>
              </div>
              
              <input 
                v-model="newMessage" 
                @keyup.enter="sendMessage" 
                placeholder="Type a message..." 
                class="message-input"
                :disabled="sending"
              />
              <button @click="sendMessage" class="send-btn" :disabled="(!newMessage.trim() && !selectedFile) || sending">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </template>
        </div>

      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="imagePreview" class="image-modal-overlay" @click="closeImagePreview">
      <div class="image-modal" @click.stop>
        <div class="image-modal-header">
          <span class="image-modal-title">{{ imagePreview.fileName }}</span>
          <div class="image-modal-actions">
            <a :href="getFileUrl(imagePreview.fileUrl)" download class="modal-action-btn" title="Download">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </a>
            <button @click="closeImagePreview" class="modal-action-btn" title="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
        <div class="image-modal-body">
          <img :src="getFileUrl(imagePreview.fileUrl)" :alt="imagePreview.fileName" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'

export default {
  name: 'Chat',
  components: { Navbar },
  data() {
    return {
      searchQuery: '',
      activeChat: null,
      activeChatUser: null,
      messages: [],
      newMessage: '',
      sending: false,
      loadingMessages: false,
      refreshInterval: null,
      showAttachMenu: false,
      selectedFile: null,
      filePreview: null,
      imagePreview: null
    }
  },
  computed: {
    currentUserId() {
      const authStore = useAuthStore()
      return authStore.user?._id || authStore.user?.id
    },
    isCustomer() {
      const authStore = useAuthStore()
      return authStore.user?.role === 'customer'
    },
    conversations() {
      const chatStore = useChatStore()
      return chatStore.conversations
    },
    totalUnread() {
      return this.conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
    },
    filteredConversations() {
      if (!this.searchQuery) return this.conversations
      const q = this.searchQuery.toLowerCase()
      return this.conversations.filter(c => 
        this.getDisplayName(c.user).toLowerCase().includes(q)
      )
    }
  },
  async mounted() {
    const chatStore = useChatStore()
    await chatStore.fetchConversations()

    const targetUserId = this.$route.query.userId
    if (targetUserId) {
      const existing = this.conversations.find(c => c.user._id === targetUserId)
      if (existing) {
        this.openChat(existing.user)
      } else {
        try {
          const response = await chatStore.getMessages(targetUserId)
          const userName = this.$route.query.userName || 'Provider'
          const userRole = this.$route.query.userRole || 'cateringProvider'
          this.activeChatUser = {
            _id: targetUserId,
            businessName: userName,
            role: userRole
          }
          this.activeChat = targetUserId
          this.messages = response
        } catch (error) {
          console.error('Error starting chat:', error)
        }
      }
    }

    this.refreshInterval = setInterval(() => {
      this.refreshData()
    }, 3000)

    // Close attach menu on outside click
    document.addEventListener('click', this.closeAttachMenu)
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
    document.removeEventListener('click', this.closeAttachMenu)
  },
  methods: {
    getInitial(user) {
      if (!user) return '?'
      const name = user.businessName || user.fullName || user.username || 'U'
      return name.charAt(0).toUpperCase()
    },
    getDisplayName(user) {
      if (!user) return 'Unknown'
      return user.businessName || user.fullName || user.username || 'User'
    },
    getConvPreview(conv) {
      if (!conv.lastMessage) return 'No messages yet'
      const type = conv.lastMessage.messageType || 'text'
      if (type === 'image') return '📷 Photo'
      if (type === 'document') return '📄 ' + (conv.lastMessage.fileName || 'Document')
      return conv.lastMessage.message
    },
    getFileUrl(fileUrl) {
      if (!fileUrl) return ''
      return `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}'}${fileUrl}`
    },
    formatTime(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      const now = new Date()
      const diff = now - date
      if (diff < 60000) return 'now'
      if (diff < 3600000) return Math.floor(diff / 60000) + 'm'
      if (diff < 86400000) return Math.floor(diff / 3600000) + 'h'
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },
    formatMessageTime(dateStr) {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    },
    formatFileSize(bytes) {
      if (!bytes) return ''
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    },
    async openChat(user) {
      this.activeChat = user._id
      this.activeChatUser = user
      this.loadingMessages = true

      const chatStore = useChatStore()
      await chatStore.markAsRead(user._id)
      this.messages = await chatStore.getMessages(user._id)
      this.loadingMessages = false
      await chatStore.fetchConversations()

      this.$nextTick(() => { this.scrollToBottom() })
    },
    async sendMessage() {
      // If there's a file selected, send it
      if (this.selectedFile) {
        await this.sendFileMessage()
        return
      }

      if (!this.newMessage.trim() || this.sending) return

      this.sending = true
      const chatStore = useChatStore()

      try {
        const msg = await chatStore.sendMessage(this.activeChat, this.newMessage.trim())
        this.messages.push(msg)
        this.newMessage = ''
        this.$nextTick(() => { this.scrollToBottom() })
        await chatStore.fetchConversations()
      } catch (error) {
        alert('Failed to send message')
      } finally {
        this.sending = false
      }
    },
    async sendFileMessage() {
      if (!this.selectedFile || this.sending) return

      this.sending = true
      const chatStore = useChatStore()

      try {
        const msg = await chatStore.sendFile(this.activeChat, this.selectedFile)
        this.messages.push(msg)
        this.cancelFileUpload()
        this.newMessage = ''
        this.$nextTick(() => { this.scrollToBottom() })
        await chatStore.fetchConversations()
      } catch (error) {
        alert('Failed to send file')
      } finally {
        this.sending = false
      }
    },
    toggleAttachMenu(e) {
      e.stopPropagation()
      this.showAttachMenu = !this.showAttachMenu
    },
    closeAttachMenu() {
      this.showAttachMenu = false
    },
    handleFileSelect(event, type) {
      const file = event.target.files[0]
      if (!file) return

      // Validate size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      this.selectedFile = file

      if (type === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.filePreview = {
            type: 'image',
            url: e.target.result,
            name: file.name,
            size: file.size
          }
        }
        reader.readAsDataURL(file)
      } else {
        this.filePreview = {
          type: 'document',
          name: file.name,
          size: file.size
        }
      }

      // Reset file input
      event.target.value = ''
    },
    cancelFileUpload() {
      this.selectedFile = null
      this.filePreview = null
    },
    openImagePreview(msg) {
      this.imagePreview = msg
    },
    closeImagePreview() {
      this.imagePreview = null
    },
    downloadFile(msg) {
      const link = document.createElement('a')
      link.href = this.getFileUrl(msg.fileUrl)
      link.download = msg.fileName || 'download'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },
    async refreshData() {
      const chatStore = useChatStore()
      await chatStore.fetchUnreadCount()
      
      if (this.activeChat) {
        const newMessages = await chatStore.getMessages(this.activeChat)
        if (newMessages.length !== this.messages.length) {
          this.messages = newMessages
          await chatStore.markAsRead(this.activeChat)
          this.$nextTick(() => this.scrollToBottom())
        }
      }
      
      await chatStore.fetchConversations()
    }
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Inter', sans-serif;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  height: 100vh;
  overflow: hidden;
}

.chat-layout {
  display: flex;
  height: 100%;
}

/* ===== Conversations Panel ===== */
.conversations-panel {
  width: 360px;
  border-right: 1px solid #e2e8f0;
  background: white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.panel-header {
  padding: 24px 20px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.unread-total {
  background: #ef4444;
  color: white;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 700;
}

.search-bar {
  padding: 0 20px 16px;
  position: relative;
}

.search-bar svg {
  position: absolute;
  left: 32px;
  top: 10px;
  color: #94a3b8;
}

.search-bar input {
  width: 100%;
  padding: 10px 10px 10px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #0f172a;
  background: #f8fafc;
  box-sizing: border-box;
}

.search-bar input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.no-conversations {
  text-align: center;
  padding: 48px 20px;
  color: #94a3b8;
}

.empty-chat-icon { font-size: 40px; margin-bottom: 12px; }
.no-conversations p { margin: 0; font-size: 14px; }
.hint { margin-top: 8px !important; font-size: 12px !important; }

.conversation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f8fafc;
}

.conversation-item:hover { background: #f8fafc; }
.conversation-item.active { background: #eff6ff; border-right: 3px solid #3b82f6; }
.conversation-item.unread { background: #fefce8; }

.conv-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #cbd5e1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.conv-avatar.cateringProvider { background: #06b6d4; }
.conv-avatar.customer { background: #3b82f6; }

.conv-info { flex: 1; min-width: 0; }

.conv-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conv-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conv-time {
  font-size: 11px;
  color: #94a3b8;
  flex-shrink: 0;
}

.conv-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conv-preview {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.unread-badge {
  background: #3b82f6;
  color: white;
  font-size: 11px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

/* ===== Chat Panel ===== */
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.no-chat-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.placeholder-icon { margin-bottom: 16px; opacity: 0.4; }
.no-chat-selected h3 { color: #64748b; font-size: 18px; margin: 0 0 8px; }
.no-chat-selected p { font-size: 14px; margin: 0; }

/* Chat Header */
.chat-header {
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  display: none;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #cbd5e1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.chat-avatar.cateringProvider { background: #06b6d4; }
.chat-avatar.customer { background: #3b82f6; }

.chat-user-info h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
}

.chat-role {
  font-size: 12px;
  color: #94a3b8;
}

/* ===== Messages Area ===== */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.loading-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #94a3b8;
  padding: 48px;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.no-messages {
  text-align: center;
  color: #94a3b8;
  padding: 60px;
  font-size: 14px;
}

/* ===== Message Bubbles ===== */
.message-bubble {
  max-width: 70%;
  padding: 10px 14px 4px;
  border-radius: 16px;
  position: relative;
}

.message-bubble.sent {
  align-self: flex-end;
  background: #0f172a;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble.received {
  align-self: flex-start;
  background: white;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
}

.message-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

/* Message Meta (time + ticks) */
.message-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 4px;
  padding-bottom: 2px;
}

.message-time {
  font-size: 10px;
  opacity: 0.6;
}

/* ===== Read Receipt Ticks ===== */
.tick-status {
  display: inline-flex;
  align-items: center;
  margin-left: 2px;
}

.tick-icon {
  width: 16px;
  height: 11px;
}

.tick-icon.delivered {
  color: rgba(255, 255, 255, 0.45);
}

.tick-icon.read {
  color: #34b7f1;
}

.message-bubble.received .tick-icon.delivered {
  color: #94a3b8;
}

.message-bubble.received .tick-icon.read {
  color: #34b7f1;
}

/* ===== Image Message ===== */
.image-message {
  margin: -6px -10px 0;
  cursor: pointer;
}

.chat-image {
  max-width: 280px;
  max-height: 300px;
  border-radius: 12px;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s;
}

.chat-image:hover {
  opacity: 0.9;
}

.message-bubble.sent .chat-image {
  border-bottom-right-radius: 4px;
}

.message-bubble.received .chat-image {
  border-bottom-left-radius: 4px;
}

/* ===== Document Message ===== */
.document-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  min-width: 220px;
  transition: background 0.15s;
}

.document-message:hover {
  background: rgba(255, 255, 255, 0.18);
}

.message-bubble.received .document-message {
  background: #f1f5f9;
}

.message-bubble.received .document-message:hover {
  background: #e2e8f0;
}

.doc-icon {
  flex-shrink: 0;
  color: inherit;
  opacity: 0.8;
}

.doc-info {
  flex: 1;
  min-width: 0;
}

.doc-name {
  display: block;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-size {
  display: block;
  font-size: 11px;
  opacity: 0.6;
  margin-top: 2px;
}

.doc-download {
  flex-shrink: 0;
  opacity: 0.6;
}

/* ===== File Preview Bar ===== */
.file-preview-bar {
  padding: 10px 24px;
  background: #eff6ff;
  border-top: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-preview-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}

.preview-doc-icon {
  width: 48px;
  height: 48px;
  background: #dbeafe;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.preview-info {
  display: flex;
  flex-direction: column;
}

.preview-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-size {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.preview-cancel {
  background: none;
  border: none;
  font-size: 18px;
  color: #64748b;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.preview-cancel:hover { background: #dbeafe; color: #1e40af; }

/* ===== Message Input ===== */
.message-input-area {
  padding: 16px 24px;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.attach-wrapper {
  position: relative;
}

.attach-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s;
}

.attach-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.attach-menu {
  position: absolute;
  bottom: 52px;
  left: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  overflow: hidden;
  z-index: 100;
  min-width: 180px;
}

.attach-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  cursor: pointer;
  transition: background 0.15s;
  font-size: 14px;
  color: #0f172a;
}

.attach-option:hover {
  background: #f8fafc;
}

.attach-option-icon {
  font-size: 20px;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  color: #0f172a;
  background: #f8fafc;
}

.message-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #0f172a;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: #1e293b;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* ===== Image Preview Modal ===== */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.image-modal {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.image-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  color: white;
}

.image-modal-title {
  font-size: 14px;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.image-modal-actions {
  display: flex;
  gap: 8px;
}

.modal-action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.15);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  text-decoration: none;
}

.modal-action-btn:hover {
  background: rgba(255,255,255,0.25);
}

.image-modal-body {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-modal-body img {
  max-width: 85vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

/* ===== Mobile Responsive ===== */
@media (max-width: 768px) {
  .main-content { margin-left: 0; }
  .conversations-panel { width: 100%; }
  .conversations-panel.mobile-hidden { display: none; }
  .chat-panel { display: none; }
  .chat-panel.mobile-visible { display: flex; }
  .back-btn { display: block; }
}
</style>
