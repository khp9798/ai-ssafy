<template>
  <div class="container">
    <div class="card">
      <div class="icon">
        <MessageCircle />
      </div>
      <h1 class="title">환영합니다!</h1>
      <p class="description">
        AI-powered 취뽓으로 새로운 가능성을 발견하세요.
      </p>

      <RouterLink to="/chat" class="chat-button">
        시작하기
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { MessageCircle } from "lucide-vue-next";
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(to bottom right, #f9fafe, #c4c5ff);
}

.card {
  max-width: 28rem;
  width: 100%;
  background-color: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.icon {
  width: 4.5rem;
  height: 4.5rem;
  margin: 0 auto 1.5rem auto;
  color: #6366f1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e0e7ff;
  border-radius: 50%;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.2rem;
}

.description {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.chat-button {
  display: inline-block;
  background: linear-gradient(to right, #6366f1, #4f46e5);
  color: white;
  font-weight: 600;
  padding: 0.8rem 1.8rem;
  border-radius: 9999px;
  text-decoration: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.chat-button:hover {
  background: linear-gradient(to right, #4f46e5, #4338ca);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
</style>
