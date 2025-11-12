// --- BlueCircle Chat Widget ---
console.log("BlueCircle widget loaded");

// Inject minimal CSS styling dynamically
const style = document.createElement("style");
style.innerHTML = `
  .chat-bubble {
    margin: 8px 0;
    padding: 8px 12px;
    border-radius: 15px;
    max-width: 80%;
    line-height: 1.4;
    font-size: 14px;
  }
  .user-bubble {
    background: #5A6DFC;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 5px;
  }
  .bot-bubble {
    background: #f1f1f1;
    color: #333;
    align-self: flex-start;
    border-bottom-left-radius: 5px;
  }
  .typing-indicator {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    margin: 8px 0;
    background: #f1f1f1;
    border-radius: 15px;
    padding: 8px 12px;
    max-width: fit-content;
  }
  .dot {
    width: 6px;
    height: 6px;
    background: #666;
    border-radius: 50%;
    animation: blink 1.4s infinite both;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink {
    0%, 80%, 100% { opacity: 0.3; }
    40% { opacity: 1; }
  }

  /* ✨ Fade & Slide animation for chat window */
  @keyframes slideUpFade {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .chat-open {
    animation: slideUpFade 0.4s ease forwards;
  }
`;
document.head.appendChild(style);

// Create chat button
const chatButton = document.createElement("button");
chatButton.textContent = "💬 Chat";
chatButton.style.position = "fixed";
chatButton.style.bottom = "20px";
chatButton.style.right = "20px";
chatButton.style.zIndex = "1000";

// 🎨 Enhanced chat button styling
chatButton.style.padding = "12px 26px";
chatButton.style.borderRadius = "25px";
chatButton.style.background = "#5A6DFC";
chatButton.style.color = "white";
chatButton.style.border = "none";
chatButton.style.cursor = "pointer";
chatButton.style.fontSize = "16px";
chatButton.style.boxShadow = "0 0 12px rgba(90, 109, 252, 0.7)";
chatButton.style.transition = "all 0.3s ease";

// Hover glow effect
chatButton.onmouseover = () => {
  chatButton.style.transform = "scale(1.05)";
  chatButton.style.boxShadow = "0 0 22px rgba(90, 109, 252, 0.9)";
};
chatButton.onmouseout = () => {
  chatButton.style.transform = "scale(1)";
  chatButton.style.boxShadow = "0 0 12px rgba(90, 109, 252, 0.7)";
};

document.body.appendChild(chatButton);

// Create chat window
const chatWindow = document.createElement("div");
chatWindow.style.position = "fixed";
chatWindow.style.bottom = "80px";
chatWindow.style.right = "20px";
chatWindow.style.width = "300px";
chatWindow.style.height = "400px";
chatWindow.style.background = "#fff";
chatWindow.style.border = "1px solid #ccc";
chatWindow.style.borderRadius = "10px";
chatWindow.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
chatWindow.style.display = "none";
chatWindow.style.flexDirection = "column";
chatWindow.style.overflow = "hidden";
chatWindow.style.zIndex = "1000";

const chatLog = document.createElement("div");
chatLog.style.flex = "1";
chatLog.style.padding = "10px";
chatLog.style.display = "flex";
chatLog.style.flexDirection = "column";
chatLog.style.overflowY = "auto";

// Input area container
const inputContainer = document.createElement("div");
inputContainer.style.display = "flex";
inputContainer.style.borderTop = "1px solid #ccc";

// Input field
const chatInput = document.createElement("input");
chatInput.type = "text";
chatInput.placeholder = "Type a message...";
chatInput.style.border = "none";
chatInput.style.padding = "10px";
chatInput.style.flex = "1";
chatInput.style.fontSize = "14px";
chatInput.style.outline = "none";

// ✈️ Send button with take-off animation
const sendButton = document.createElement("button");
sendButton.innerHTML = "✈️"; // paper-plane icon
sendButton.title = "Send message";
sendButton.style.background = "#5A6DFC";
sendButton.style.color = "white";
sendButton.style.border = "none";
sendButton.style.padding = "0 16px";
sendButton.style.cursor = "pointer";
sendButton.style.borderTopRightRadius = "8px";
sendButton.style.transition = "all 0.3s ease";
sendButton.style.fontSize = "18px";
sendButton.style.boxShadow = "0 0 8px rgba(90, 109, 252, 0.6)";
sendButton.style.display = "flex";
sendButton.style.alignItems = "center";
sendButton.style.justifyContent = "center";
sendButton.style.transformOrigin = "center bottom";
sendButton.onmouseover = () => {
  sendButton.style.boxShadow = "0 0 16px rgba(90, 109, 252, 0.9)";
  sendButton.style.transform = "scale(1.1) rotate(-20deg) translateY(-2px)";
};
sendButton.onmouseout = () => {
  sendButton.style.boxShadow = "0 0 8px rgba(90, 109, 252, 0.6)";
  sendButton.style.transform = "scale(1) rotate(0deg) translateY(0)";
};

// Assemble input area
inputContainer.appendChild(chatInput);
inputContainer.appendChild(sendButton);
chatWindow.appendChild(chatLog);
chatWindow.appendChild(inputContainer);
document.body.appendChild(chatWindow);

// Typing animation
function typeMessage(element, text, speed = 35, callback) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) callback();
  }
  type();
}

// Typing indicator (animated dots)
function showTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.classList.add("bot-bubble", "typing-indicator");
  indicator.innerHTML = `
    <b>#01 LiVEiT® BLUE:</b>
    <div style="display:inline-flex; margin-left:6px;">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>`;
  chatLog.appendChild(indicator);
  chatLog.scrollTop = chatLog.scrollHeight;
  return indicator;
}

// Intro message
let introShown = false;
function showIntroMessage() {
  if (introShown) return;
  introShown = true;

  const typingIndicator = showTypingIndicator();

  setTimeout(() => {
    typingIndicator.remove();

    const introDiv = document.createElement("div");
    introDiv.classList.add("bot-bubble");
    introDiv.innerHTML = `<b>LiVEiT® BLUE #01:</b> `;
    chatLog.appendChild(introDiv);

    const span = document.createElement("span");
    introDiv.appendChild(span);
    chatLog.scrollTop = chatLog.scrollHeight;

    const messageText =
      "👋 Hi there! I'm BlueCircle, your compassionate wellness companion. How are you feeling today?";

    typeMessage(span, messageText, 35);
  }, 1200);
}

// Toggle chat window with fade/slide + intro delay
chatButton.onclick = () => {
  const isHidden = chatWindow.style.display === "none";

  if (isHidden) {
    chatWindow.style.display = "flex";
    chatWindow.classList.add("chat-open");
    setTimeout(() => {
      showIntroMessage();
    }, 600);
  } else {
    chatWindow.style.display = "none";
    chatWindow.classList.remove("chat-open");
  }
};

// Send message logic
async function sendMessage() {
  const userMessage = chatInput.value.trim();
  if (userMessage === "") return;

  const userDiv = document.createElement("div");
  userDiv.classList.add("chat-bubble", "user-bubble");
  userDiv.innerHTML = `<b>You:</b> ${userMessage}`;
  chatLog.appendChild(userDiv);
  chatInput.value = "";

  const typingIndicator = showTypingIndicator();

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });
    const data = await response.json();

    setTimeout(() => {
      typingIndicator.remove();
      const botDiv = document.createElement("div");
      botDiv.classList.add("chat-bubble", "bot-bubble");
      botDiv.innerHTML = `<b>BlueCircle:</b> ${data.response || "(error)"}`;
      chatLog.appendChild(botDiv);
      chatLog.scrollTop = chatLog.scrollHeight;
    }, 800);
  } catch {
    typingIndicator.remove();
    const botDiv = document.createElement("div");
    botDiv.classList.add("chat-bubble", "bot-bubble");
    botDiv.innerHTML = `<b>BlueCircle:</b> connection error`;
    chatLog.appendChild(botDiv);
  }

  chatLog.scrollTop = chatLog.scrollHeight;
}

// Send on Enter or click
chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
sendButton.onclick = sendMessage;
