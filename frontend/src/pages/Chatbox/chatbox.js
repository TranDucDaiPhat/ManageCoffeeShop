import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./chatbox.css";


function Chatbox() {
  const [message, setMessage] = useState(""); // tin nhắn hiện tại
  const [messages, setMessages] = useState([]); // danh sách tin nhắn đã trao đổi
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null); // Dùng để tham chiếu đến vị trí cuối cùng của danh sách tin nhắn

  const sendMessage = async () => {
    if (!message.trim()) return; // không gửi nếu tin nhắn rỗng
    setLoading(true);

    // Thêm tin nhắn người dùng vào danh sách
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: message },
    ]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", { message });
      const { query, result, answer } = res.data;

      // Thêm kết quả chatbot vào danh sách
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "chatbot", text: answer || result || "Không có kết quả" },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "chatbot", text: "Đã có lỗi xảy ra" },
      ]);
    } finally {
      setLoading(false);
    }

    setMessage(""); // xóa tin nhắn sau khi gửi
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage(); // gửi tin nhắn khi nhấn Enter
      e.preventDefault();
    }
  };

  // Tự động cuộn xuống khi danh sách tin nhắn thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chatbox-container">
      <h2 className="chatbox-title">Blitzcrank, trợ lý AI</h2>

      <div className="chatbox-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatbox-message ${msg.sender === "user" ? "user-message" : "chatbot-message"}`}
          >
            <div className="chatbox-avatar">
            <img
                src={msg.sender === "user" ? "https://th.bing.com/th/id/OIP.Do9SRoXLzoeDZjutkz8F-AHaHa?w=149&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7" : "https://th.bing.com/th/id/OIP.VrjFibWCf8EsW__VZRYjyAHaEK?rs=1&pid=ImgDetMain"}
                alt={msg.sender}
                className="chatbox-avatar-img"
                style={{
                    width: "50px",   // Điều chỉnh kích thước của avatar
                    height: "50px",  // Điều chỉnh kích thước của avatar
                    borderRadius: "50%",  // Làm ảnh thành hình tròn
                    marginBottom: "5px",  // Thêm khoảng cách dưới ảnh
                    objectFit: "cover",    // Đảm bảo hình ảnh không bị méo
                }}/>

            </div>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Vị trí cuộn tới */}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Nhập câu hỏi..."
        className="chatbox-input"
      />
      <button onClick={sendMessage} disabled={loading} className="chatbox-button">
        {loading ? "Đang gửi..." : "Gửi"}
      </button>
    </div>
  );
}

export default Chatbox;
