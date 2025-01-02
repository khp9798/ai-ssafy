const chatContainer = document.getElementById("chat-container");
const messageForm = document.getElementById("message-form");
const userInput = document.getElementById("user-input");
const apiSelector = document.getElementById("api-selector");

// We'll read the API endpoint from an environment variable
const BASE_URL = process.env.API_ENDPOINT;

function createMessageBubble(content, sender = "user") {
  const wrapper = document.createElement("div");
  wrapper.classList.add("mb-6", "flex", "items-start");

  if (sender === "assistant") {
    wrapper.classList.add("justify-start");
  } else {
    wrapper.classList.add("justify-end");
  }

  const bubble = document.createElement("div");
  bubble.classList.add(
    "max-w-full",
    "md:max-w-2xl",
    "p-3",
    "rounded-lg",
    "whitespace-pre-wrap",
    "leading-relaxed",
    "shadow-sm"
  );

  if (sender === "assistant") {
    bubble.classList.add("bg-gray-200", "text-gray-900");

    // 챗봇의 응답을 테이블 형식으로 표시
    bubble.innerHTML = `
      <table class="w-full border-collapse border border-gray-300">
        <thead class="bg-gray-300">
          <tr>
            <th class="border border-gray-400 px-4 py-2">Column 1</th>
            <th class="border border-gray-400 px-4 py-2">Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-400 px-4 py-2">${content || "Data 1"}</td>
            <td class="border border-gray-400 px-4 py-2">${content || "Data 2"}</td>
          </tr>
        </tbody>
      </table>
    `;
  } else {
    bubble.classList.add("bg-blue-600", "text-white");
    bubble.textContent = content; // 사용자의 메시지는 단순 텍스트로 표시
  }

  wrapper.appendChild(bubble);
  return wrapper;
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function getAssistantResponse(userMessage) {
  const mode = apiSelector.value;
  const url = `${BASE_URL}/chat`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userMessage }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data.reply; // 서버에서 "reply"라는 키로 응답한다고 가정
}

messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  // 사용자의 메시지를 오른쪽에 추가
  chatContainer.appendChild(createMessageBubble(message, "user"));
  userInput.value = "";
  scrollToBottom();

  try {
    const response = await getAssistantResponse(message);

    // 챗봇의 응답을 왼쪽에 추가
    chatContainer.appendChild(createMessageBubble(response, "assistant"));
    scrollToBottom();
  } catch (error) {
    console.error("Error fetching assistant response:", error);
    chatContainer.appendChild(
      createMessageBubble("Error fetching response. Check console.", "assistant")
    );
    scrollToBottom();
  }
});
