import { defineStore } from 'pinia'
import api from '@/services/api'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    unreadCount: 0,
    pollInterval: null
  }),

  actions: {
    async fetchConversations() {
      try {
        const response = await api.get('/chat/conversations')
        this.conversations = response.data
      } catch (error) {
        console.error('Error fetching conversations:', error)
      }
    },

    async fetchUnreadCount() {
      try {
        const response = await api.get('/chat/unread-count')
        this.unreadCount = response.data.unreadCount
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    },

    async sendMessage(receiverId, message) {
      try {
        const response = await api.post('/chat/send', { receiverId, message })
        return response.data
      } catch (error) {
        console.error('Error sending message:', error)
        throw error
      }
    },

    async sendFile(receiverId, file) {
      try {
        const formData = new FormData()
        formData.append('receiverId', receiverId)
        formData.append('file', file)
        const response = await api.post('/chat/send-file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data
      } catch (error) {
        console.error('Error sending file:', error)
        throw error
      }
    },

    async getMessages(userId) {
      try {
        const response = await api.get(`/chat/messages/${userId}`)
        return response.data
      } catch (error) {
        console.error('Error fetching messages:', error)
        return []
      }
    },

    async markAsRead(userId) {
      try {
        await api.put(`/chat/read/${userId}`)
        await this.fetchUnreadCount()
      } catch (error) {
        console.error('Error marking as read:', error)
      }
    },

    // Start polling for new messages every 5 seconds
    startPolling() {
      if (this.pollInterval) return
      this.fetchUnreadCount()
      this.pollInterval = setInterval(() => {
        this.fetchUnreadCount()
      }, 5000)
    },

    // Stop polling
    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval)
        this.pollInterval = null
      }
    }
  }
})
