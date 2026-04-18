import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password })
}

// Menu API
export const menuAPI = {
  getPackages: (providerId = null) => {
    const params = providerId ? { providerId } : {};
    return api.get('/menu/packages', { params });
  },
  getPackageById: (id) => api.get(`/menu/packages/${id}`),
  uploadPackageImage: (formData) => api.post('/menu/packages/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  createPackage: (data) => api.post('/menu/packages', data),
  updatePackage: (id, data) => api.put(`/menu/packages/${id}`, data),
  deletePackage: (id) => api.delete(`/menu/packages/${id}`),
  
  getFoods: (providerId = null) => {
    const params = providerId ? { providerId } : {};
    return api.get('/menu/foods', { params });
  },
  getAvailableFoods: (providerId = null) => {
    const params = providerId ? { providerId } : {};
    return api.get('/menu/foods/available', { params });
  },
  uploadFoodImage: (formData) => api.post('/menu/foods/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  createFood: (data) => api.post('/menu/foods', data),
  updateFood: (id, data) => api.put(`/menu/foods/${id}`, data),
  deleteFood: (id) => api.delete(`/menu/foods/${id}`)
}

// Order API
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  updatePaymentStatus: (id, paymentStatus) => api.put(`/orders/${id}/payment`, { paymentStatus }),
  updateDeliveryStatus: (id, deliveryStatus) => api.put(`/orders/${id}/delivery`, { deliveryStatus }),
  deleteOrder: (id) => api.delete(`/orders/${id}`)
}

// Quotation API
export const quotationAPI = {
  createQuotation: (data) => api.post('/quotations', data),
  getMyQuotations: () => api.get('/quotations/my-quotations'),
  getAllQuotations: () => api.get('/quotations'),
  getQuotationById: (id) => api.get(`/quotations/${id}`),
  uploadQuotationPdf: (formData) => api.post('/quotations/upload-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateQuotation: (id, data) => api.put(`/quotations/${id}`, data),
  acceptQuotation: (id) => api.put(`/quotations/${id}/accept`),
  rejectQuotation: (id) => api.put(`/quotations/${id}/reject`),
  deleteQuotation: (id) => api.delete(`/quotations/${id}`)
}

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users')
}

// Chat API
export const chatAPI = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (userId) => api.get(`/chat/messages/${userId}`),
  sendMessage: (receiverId, message) => api.post('/chat/send', { receiverId, message }),
  sendFile: (formData) => api.post('/chat/send-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  markAsRead: (userId) => api.put(`/chat/read/${userId}`),
  getUnreadCount: () => api.get('/chat/unread-count')
}

export default api
