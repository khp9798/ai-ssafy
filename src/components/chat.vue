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
        <button @click="openTutorial" class="tutorial-btn">사용법</button>
      </header>

      <!-- Chat Section -->
      <div class="chat-box">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="[
            'message-container',
            msg.role === 'user' ? 'user-message' : 'assistant-message',
          ]"
        >
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

        <div v-if="loading" class="message-container assistant-message">
          <div class="spinner"></div>
          <div class="loading-text">분석 중...</div>
        </div>
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

    <!-- Tutorial Modal -->
    <div v-if="showTutorial" class="modal-overlay">
      <div class="modal-content">
        <h2>사용 방법</h2>
        <ul>
          <li>1. 검색창에 기업명을 입력하세요.</li>
          <li>2. Enter를 누르면 신년사 분석 결과를 확인할 수 있습니다.</li>
          <li>3. Dark Mode 버튼으로 화면 테마를 변경할 수 있습니다.</li>
        </ul>
        <button @click="closeTutorial" class="close-modal">닫기</button>
      </div>
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
const showTutorial = ref(false);

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
};

const openTutorial = () => {
  showTutorial.value = true;
};

const closeTutorial = () => {
  showTutorial.value = false;
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

.tutorial-btn {
  background: var(--header-bg);
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.tutorial-btn:hover {
  background: #3a78d7;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.user-message {
  align-self: flex-end;
  background: var(--user-bg);
  text-align: right;
  color: var(--text-color);
}

.assistant-message {
  align-self: flex-start;
  background: var(--assistant-bg);
  text-align: left;
  color: var(--text-color);
}

.message-container {
  max-width: 60%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--background-color);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  margin-bottom: 16px;
  color: var(--text-color);
}

.modal-content ul {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  color: var(--text-color);
}

.modal-content ul li {
  margin-bottom: 8px;
}

.close-modal {
  background: var(--header-bg);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.close-modal:hover {
  background: #3a78d7;
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
