import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useCounterStore = defineStore('counter', () => {

    const BASE_URL = "https://ssafy-chatbot.fly.dev/"

    return { BASE_URL }

})
