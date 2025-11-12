from flask import Flask, render_template, request, jsonify, send_from_directory
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize model
llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.7)

# --- Route for your main page ---
@app.route("/")
def home():
    return render_template("index01.html")  # loads your main homepage

# --- Chat endpoint (AI logic) ---
@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "")
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    # Compassionate prompt for BlueCircle
    prompt = ChatPromptTemplate.from_template(
        "You are BlueCircle, an empathetic mental wellness assistant. "
        "Respond with kindness, warmth, and clarity.\n\nUser: {user_input}\nBlueCircle:"
    )

    formatted = prompt.format_messages(user_input=user_input)
    response = llm.invoke(formatted)

    return jsonify({"response": response.content})


# --- Serve your local widget.js from /static ---
@app.route("/widget.js")
def widget_js():
    return send_from_directory("static", "widget.js")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    app.run(host="0.0.0.0", port=port, debug=True)
