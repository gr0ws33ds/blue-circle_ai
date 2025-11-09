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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
