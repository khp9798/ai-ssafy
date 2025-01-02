<template>
  <div :class="['chat-container', darkMode ? 'dark' : 'light']">
    <div class="card">
      <header class="header">
        <div class="icon">
          <MessageCircle />
        </div>
        <h1 class="title">취뽓</h1>
      </header>
      <p class="description">
        AI 기반 신년사 분석 서비스로 기업의 인사이트를 탐구하세요.
      </p>

      <RouterLink to="/chat" class="chat-button"> 시작하기 </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { MessageCircle } from "lucide-vue-next";
import { ref } from "vue";

const darkMode = ref(false);
</script>

<style scoped>
.chat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--background-color);
  color: var(--text-color);
}

.chat-container.light {
  --background-color: #f4f4f9;
  --text-color: #1e293b;
  --card-bg: #ffffff;
  --icon-bg: #e0f2fe;
  --icon-color: #4a90e2;
  --button-bg: linear-gradient(to right, #4a90e2, #4a90e2);
  --button-hover-bg: linear-gradient(to right, #4a90e2, #4a90e2);
}

.chat-container.dark {
  --background-color: #1e1e2e;
  --text-color: #f4f4f9;
  --card-bg: #2e2e4a;
  --icon-bg: #3a3b5e;
  --icon-color: #6366f1;
  --button-bg: linear-gradient(to right, #4a90e2, #4f46e5);
  --button-hover-bg: linear-gradient(to right, #4f46e5, #4338ca);
}

.card {
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.header {
  margin-bottom: 1.5rem;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background-color: var(--icon-bg);
  border-radius: 50%;
  color: var(--icon-color);
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.description {
  font-size: 1rem;
  color: var(--text-color);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.chat-button {
  display: inline-block;
  background: var(--button-bg);
  color: #ffffff;
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  border-radius: 9999px;
  text-decoration: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.chat-button:hover {
  background: var(--button-hover-bg);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
</style>
