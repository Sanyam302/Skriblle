import { useState, useEffect, useRef } from "react";
import { socket } from "../socket";
import "./Chat.css";

function Chat({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    // Guess backend ko bhejo
    socket.emit("guess", message.trim());

    setMessage("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        Chat
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => {
          const isMine = msg.user === username;

          return (
            <div
              key={index}
              className={`message ${
                isMine ? "mine" : "other"
              }`}
            >
              <div className="message-user">
                {msg.user}
              </div>

              <div className="message-text">
                {msg.text}
              </div>

              <div className="message-time">
                {msg.time}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef}></div>
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          placeholder="Type your guess..."
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;