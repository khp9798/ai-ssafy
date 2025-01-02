<template>
    <div class="chat-container">
      <h1>Chatbot</h1>
      <div class="chat-box">
        <ul>
          <li v-for="(msg, index) in messages" :key="index">
            <strong>{{ msg.role }}:</strong> {{ msg.content }}
          </li>
        </ul>
      </div>
      <form @submit.prevent="sendMessage" class="input-container">
        <input
          v-model="userMessage"
          type="text"
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  import { useCounterStore } from '@/stores/counter'
  

  const BASE_URL = useCounterStore().BASE_URL;
  console.log(BASE_URL)
  
  const userMessage = ref("");
  const messages = ref([]); 
  

  const sendMessage = async () => {
    if (!userMessage.value.trim()) {
      return;
    }
  
    messages.value.push({ role: "user", content: userMessage.value });
    console.log("메시지 발송 :", userMessage.value);
    try {
      const response = await axios({
        url: `${BASE_URL}chat`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            "message": userMessage.value
        }
      })
      .then((res) => {
        console.log("응답데이터")
        console.log(res.data)
        messages.value.push({ role: "assistant", content: res.data.reply }); 
      });
      
    } catch (error) {
      console.error("Error fetching assistant response:", error);
      messages.value.push({ role: "assistant", content: "Error occurred." });
    }
  
    // 입력 필드 초기화
    userMessage.value = "";
  };
  </script>
  
  <style scoped>
  .chat-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .chat-box {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #ddd;
    padding: 10px;
    background-color: #fff;
    margin-bottom: 20px;
  }
  
  .chat-box ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .chat-box li {
    margin-bottom: 10px;
  }
  
  .input-container {
    display: flex;
    gap: 10px;
  }
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  