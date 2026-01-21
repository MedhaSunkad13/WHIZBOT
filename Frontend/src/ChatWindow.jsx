import React from "react";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { useState, useContext } from "react";
import { BounceLoader } from "react-spinners";
import { MyContext } from "./MyContext.jsx";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(true); //set default false to close navbar

  //️ FIXED — Append messages immediately, not in useEffect
  const getResponse = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt;

    // Show user message instantly
    setPrevChats((prev) => [...prev, { role: "user", content: userMessage }]);
    setPrompt(""); // clear input immediately

    setLoading(true);
    setNewChat(false);

    try {
      const reply = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          threadId: currThreadId,
        }),
      });

      const res = await reply.json();

      // Show bot reply instantly
      setPrevChats((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);
    } catch (err) {
      console.log("Error:", err);
    }

    setLoading(false);
  };

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          WHIZBOT <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDownDiv">
          <div className="dropDownItems">
            <i class="fa-solid fa-arrow-up-from-bracket"></i>Upgrade Plan
          </div>
          <div className="dropDownItems">
            <i className="fa-solid fa-gear"></i>Settings
          </div>
        </div>
      )}

      {/* Scrollable chat section */}
      <div className="chatScrollArea">
        <Chat />
        {loading && <BounceLoader color="#fff" size={50} />}
      </div>

      {/* Input */}
      <div className="chatInput">
        <div className="inputArea">
          <input
            type="text"
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getResponse()}
          />

          <div id="submit" onClick={getResponse}>
            <i className="fa-solid fa-circle-up"></i>
          </div>
        </div>

        <p className="info">
          WhizBOT can make mistakes. Please verify critical information from
          reliable sources. See Cookie Preferences
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
