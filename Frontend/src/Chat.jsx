import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import "./Chat.css";

function Chat() {
  const { newChat, prevChats, response } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState("");

  useEffect(() => {
    // If no response, reset typing
    if (!response || response.trim() === "") {
      setLatestReply("");
      return;
    }

    const chars = response.split("");
    let index = 0;

    const interval = setInterval(() => {
      setLatestReply(chars.slice(0, index + 1).join(""));
      index++;

      if (index >= chars.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [response]);

  return (
    <>
      {newChat && <h1>Start a new chat!</h1>}

      <div className="chatContainer">
        {/* Show entire previous chat history */}
        {prevChats?.map((chat, index) => (
          <div
            key={index}
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
          >
            {chat.role === "user" ? (
              <p className="userMsg">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}

        {/* Show typing effect for the new message */}
        {prevChats.length > 0 && (
          <>
            {latestReply === null ? (
              <div className="gptDiv" key={"non-typing"}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {prevChats[prevChats.length - 1].content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="gptDiv" key={"typing"}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {latestReply}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Chat;
