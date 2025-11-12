from flask import render_template
from flask import Flask, request, jsonify
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize model
llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.7)

@app.route("/")
def home():
    return render_template("chat.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "")
    
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    # Compassionate prompt
    prompt = ChatPromptTemplate.from_template(
        "You are BlueCircle, an empathetic mental wellness assistant. "
        "Respond with kindness, warmth, and clarity.\n\nUser: {user_input}\nBlueCircle:"
    )

    formatted = prompt.format_messages(user_input=user_input)
    response = llm.invoke(formatted)

    return jsonify({"response": response.content})
@app.route("/widget.js")
def widget_js():
    js_code = """
document.addEventListener('DOMContentLoaded', () => {
  // Create the chat bubble
  const bubble = document.createElement('div');
  bubble.innerHTML = '💬';
  bubble.style.position = 'fixed';
  bubble.style.bottom = '20px';
  bubble.style.right = '20px';
  bubble.style.background = '#0077ee';
  bubble.style.color = 'white';
  bubble.style.borderRadius = '50%';
  bubble.style.width = '60px';
  bubble.style.height = '60px';
  bubble.style.display = 'flex';
  bubble.style.alignItems = 'center';
  bubble.style.justifyContent = 'center';
  bubble.style.fontSize = '28px';
  bubble.style.cursor = 'pointer';
  bubble.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
  bubble.style.zIndex = '9999';
  document.body.appendChild(bubble);

  // Create the chat iframe (hidden at first)
  const iframe = document.createElement('iframe');
  iframe.src = 'https://bluecircle-ai.onrender.com/';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '100px';
  iframe.style.right = '20px';
  iframe.style.width = '400px';
  iframe.style.height = '600px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
  iframe.style.zIndex = '9998';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // Toggle iframe visibility
  bubble.addEventListener('click', () => {
    iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
  });
});
"""
    return js_code, 200, {'Content-Type': 'application/javascript'}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
