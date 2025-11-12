// --- BlueCircle Chat Widget ---
console.log("BlueCircle widget loaded");

// Create a floating chat button
const chatButton = document.createElement("button");
chatButton.textContent = "💬 Chat";
chatButton.style.position = "fixed";
chatButton.style.bottom = "20px";
chatButton.style.right = "20px";
chatButton.style.zIndex = "1000";
chatButton.style.padding = "10px 20px";
chatButton.style.borderRadius = "20px";
chatButton.style.background = "#0078ff";
chatButton.style.color = "white";
chatButton.style.border = "none";
chatButton.style.cursor = "pointer";
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
chatLog.style.overflowY = "auto";

const chatInput = document.createElement("input");
chatInput.type = "text";
chatInput.placeholder = "Type a message...";
chatInput.style.border = "none";
chatInput.style.padding = "10px";
chatInput.style.width = "100%";
chatInput.style.boxSizing = "border-box";
chatInput.style.borderTop = "1px solid #ccc";

chatWindow.appendChild(chatLog);
chatWindow.appendChild(chatInput);
document.body.appendChild(chatWindow);

// Toggle window
chatButton.onclick = () => {
  chatWindow.style.display =
    chatWindow.style.display === "none" ? "flex" : "none";
};

// Send message
chatInput.addEventListener("keypress", async (e) => {
  if (e.key === "Enter" && chatInput.value.trim() !== "") {
    const userMessage = chatInput.value.trim();
    chatLog.innerHTML += `<div><b>You:</b> ${userMessage}</div>`;
    chatInput.value = "";

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      if (data.response) {
        chatLog.innerHTML += `<div><b>BlueCircle:</b> ${data.response}</div>`;
      } else {
        chatLog.innerHTML += `<div><b>BlueCircle:</b> (error)</div>`;
      }
    } catch (err) {
      chatLog.innerHTML += `<div><b>BlueCircle:</b> connection error</div>`;
    }
    chatLog.scrollTop = chatLog.scrollHeight;
  }
});
