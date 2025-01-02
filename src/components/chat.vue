<template>
  <div :class="['chat-container', darkMode ? 'dark' : 'light']">
    <!-- Main Chat -->
    <div class="chat-main">
      <header class="chat-header">
        <div class="header-content">
          <img
            src="/src/assets/logo/logo.png"
            alt="Service Logo"
            class="logo"
          />
          <h1>신년사 분석 챗봇</h1>
        </div>
        <button @click="toggleDarkMode" class="toggle-btn">
          {{ darkMode ? "🌞 Light Mode" : "🌙 Dark Mode" }}
        </button>
      </header>
      <div class="chat-box">
        <ul>
          <li
            v-for="(msg, index) in messages"
            :key="index"
            :class="{
              user: msg.role === 'user',
              assistant: msg.role === 'assistant',
            }"
          >
            <div class="message-container">
              <div
                v-if="msg.role === 'assistant' && msg.content.includes('|')"
                class="message styled-table"
              >
                <div v-html="renderMarkdown(msg.content)"></div>
              </div>
              <div
                v-else
                class="message"
                v-html="
                  msg.role === 'assistant'
                    ? renderMarkdown(msg.content)
                    : msg.content
                "
              ></div>
              <span class="timestamp">{{ getCurrentTime() }}</span>
            </div>
          </li>
          <li v-if="loading" class="assistant">
            <div class="message-container loading-container">
              <div class="spinner"></div>
              <div class="loading-text">분석 중...</div>
            </div>
          </li>
        </ul>
      </div>
      <form @submit.prevent="sendMessage" class="input-container">
        <input
          v-model="userMessage"
          type="text"
          placeholder="궁금한 기업명을 입력하세요!"
        />
        <button type="submit" class="send-button">
          <SendIcon class="icon" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useCounterStore } from "@/stores/counter";
import { SendIcon } from "lucide-vue-next";
import { marked } from "marked";

const BASE_URL = useCounterStore().BASE_URL;
const userMessage = ref("");
const messages = ref([]);
const darkMode = ref(false);
const loading = ref(false);

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
};

const sendMessage = async () => {
  if (!userMessage.value.trim()) return;

  messages.value.push({ role: "user", content: userMessage.value });
  loading.value = true;

  try {
    const response = await axios.post(`${BASE_URL}chat`, {
      message: userMessage.value,
    });

    messages.value.push({ role: "assistant", content: response.data.reply });
  } catch (error) {
    console.error("Error:", error);
    messages.value.push({
      role: "assistant",
      content: "서버와 연결 중 오류가 발생했습니다.",
    });
  } finally {
    loading.value = false;
  }

  userMessage.value = "";
};

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const renderMarkdown = (text) => {
  return marked(text, { sanitize: true });
};
</script>

<style scoped>
.chat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: var(--background-color);
  color: var(--text-color);
}

.chat-container.light {
  --background-color: #f4f4f9;
  --text-color: #333;
  --header-bg: #4a90e2;
  --user-bg: #e8f5fe;
  --assistant-bg: #f0f0f0;
}

.chat-container.dark {
  --background-color: #1e1e2e;
  --text-color: #dcdcdc;
  --header-bg: #2e2e4a;
  --user-bg: #4a4a6a;
  --assistant-bg: #333;
}

.chat-main {
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 800px;
  height: 90%;
  background: var(--background-color);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.chat-header {
  background: var(--header-bg);
  color: #fff;
  padding: 16px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content {
  display: flex;
  align-items: center;
}

.logo {
  height: 40px;
  margin-right: 10px;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.chat-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chat-box li {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.chat-box li.user {
  align-items: flex-end;
}

.chat-box li.assistant {
  align-items: flex-start;
}

.message-container {
  max-width: 70%;
  background: var(--user-bg);
  color: var(--text-color);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.chat-box li.assistant .message-container {
  background: var(--assistant-bg);
}

.styled-table table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 16px;
  text-align: left;
}

.styled-table thead tr {
  background-color: var(--header-bg);
  color: #ffffff;
  font-weight: bold;
}

.styled-table th,
.styled-table td {
  padding: 12px 15px;
  border: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:hover {
  background-color: #f1f1f1;
}

.timestamp {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.loading-container {
  display: flex;
  align-items: center;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-top: 2px solid var(--header-bg);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: var(--text-color);
}

.input-container {
  display: flex;
  padding: 10px;
  background: var(--header-bg);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

input {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
}

.send-button {
  margin-left: 10px;
  padding: 12px;
  background: #0066cc;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.send-button:hover {
  background: #005bb5;
}

.toggle-btn {
  background: transparent;
  color: #fff;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.3s;
  margin-left: auto;
}

.toggle-btn:hover {
  color: #f4f4f9;
}
</style>
