<template>
  <div class="ai-chat-container">
    <button class="chat-toggle-btn" @click="toggleChat" :class="{ 'is-open': isOpen }">
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>

    <div class="chat-window" :class="{ 'show': isOpen }">
      <div class="chat-header">
        <div class="header-info">
          <span class="ai-avatar">✨</span>
          <div>
            <h3>CaterFlow AI</h3>
            <p>Smart Assistant</p>
          </div>
        </div>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div class="message ai-message">
          <div class="msg-bubble">
            Hello! I'm your CaterFlow AI assistant. Tell me about your event size, budget, or preferred food, and I'll recommend the best packages for you!
          </div>
        </div>

        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          class="message"
          :class="msg.role === 'user' ? 'user-message' : 'ai-message'"
        >
          <div class="msg-bubble" v-html="formatMessage(msg.text)"></div>
        </div>

        <div v-if="isLoading" class="message ai-message">
          <div class="msg-bubble typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div class="chat-input-area">
        <input 
          v-model="inputText" 
          @keyup.enter="sendMessage"
          type="text" 
          placeholder="e.g. Find me a buffet for 50 pax under RM1500..."
          :disabled="isLoading"
        />
        <button @click="sendMessage" :disabled="isLoading || !inputText.trim()" class="send-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// 1. 改这里：直接使用你系统中统一的 api 实例 (它配置好了 base URL 和拦截器)
import api from '@/services/api';

export default {
  name: 'AIChatWidget',
  data() {
    return {
      isOpen: false,
      inputText: '',
      messages: [],
      isLoading: false
    }
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.scrollToBottom();
      }
    },
    async sendMessage() {
      if (!this.inputText.trim() || this.isLoading) return;

      const userMsg = this.inputText.trim();
      this.messages.push({ role: 'user', text: userMsg });
      this.inputText = '';
      this.isLoading = true;
      this.scrollToBottom();

      try {
  const response = await api.post('/ai/chat', { message: userMsg });
  
  // 打印整个数据结构，看看 reply 到底在哪里
  console.log("🔥 真正的后端数据内容:", response.data); 

  // 根据打印结果，调整下面这一行
  const replyText = response.data.reply; 
  
  if (replyText) {
    this.messages.push({ role: 'ai', text: replyText });
  } else {
    // 如果这里显示 undefined，说明后端压根没发字段叫 reply 的东西过来
    this.messages.push({ role: 'ai', text: '服务器返回的数据里没有 reply 字段！' });
  }

      } catch (error) {
        console.error('AI Chat Error:', error);
        this.messages.push({ 
          role: 'ai', 
          text: 'Oops! I am having trouble connecting to my brain right now. Please try again later.' 
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    formatMessage(text) {
      if (!text) return '';
      let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/\n/g, '<br>');
      return formatted;
    }
  }
}
</script>

<style scoped>
/* 悬浮容器定位 */
.ai-chat-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  font-family: 'Inter', sans-serif;
}

/* 触发按钮 */
.chat-toggle-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0f172a, #334155);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.chat-toggle-btn:hover {
  transform: scale(1.05);
}

.chat-toggle-btn.is-open {
  background: #ef4444;
}

/* 聊天窗口主体 */
.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  pointer-events: none;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.chat-window.show {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

/* 头部 */
.chat-header {
  background: #0f172a;
  color: white;
  padding: 20px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  font-size: 24px;
  background: rgba(255,255,255,0.1);
  padding: 8px;
  border-radius: 12px;
}

.header-info h3 { margin: 0; font-size: 16px; font-weight: 700; }
.header-info p { margin: 2px 0 0 0; font-size: 12px; color: #94a3b8; }

/* 消息区域 */
.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8fafc;
}

.message {
  display: flex;
  max-width: 85%;
}

.user-message {
  align-self: flex-end;
}

.ai-message {
  align-self: flex-start;
}

.msg-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
}

.user-message .msg-bubble {
  background: #0f172a;
  color: white;
  border-bottom-right-radius: 4px;
}

.ai-message .msg-bubble {
  background: white;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

/* 输入区域 */
.chat-input-area {
  padding: 16px;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 10px;
}

.chat-input-area input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  transition: all 0.2s;
}

.chat-input-area input:focus {
  border-color: #0f172a;
}

.send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #0f172a;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* 打字动画 */
.typing-indicator span {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: #94a3b8;
  border-radius: 50%;
  margin: 0 2px;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@media (max-width: 480px) {
  .chat-window {
    width: 320px;
    height: 450px;
    bottom: 70px;
    right: -10px;
  }
}
</style>