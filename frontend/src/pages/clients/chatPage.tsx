import React, { useState } from "react";
import axios from "axios";
import "./ChatPage.css"
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await api.post("/chat", {
        message: text,
      });

      setMessages((prev) => [
        ...prev,
        { role: "user", text },
        { role: "bot", text: res.data.reply },
      ]);

      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <div className="chat-page">

    <div className="chat-container">

      <div className="chat-header">
          Tunisia Booking AI Assistant
      </div>


      <div className="chat-messages">

        {messages.length === 0 && (
          <p className="welcome">
            👋 Bonjour ! Je peux vous aider à trouver un hôtel,
            restaurant, circuit ou destination.
          </p>
        )}


        {messages.map((m, i) => (

          <div
            key={i}
            className={
              m.role === "user"
              ?
              "message user-message"
              :
              "message bot-message"
            }
          >

            <strong>
              {m.role === "user" ? "Vous" : "AI"}
            </strong>

            <span>
              {m.text}
            </span>

          </div>

        ))}

      </div>



      <div className="chat-input-area">

        <input
          value={text}
          onChange={(e)=>setText(e.target.value)}
          placeholder="Écrire votre message..."
          onKeyDown={(e)=>{
            if(e.key==="Enter")
              sendMessage();
          }}
        />


        <button onClick={sendMessage}>
          Envoyer 🚀
        </button>


      </div>


    </div>

  </div>
)
}