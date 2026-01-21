import "./Sidebar.css";
import React, { useEffect, useContext } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setResponse,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/threads");

      if (!response.ok) {
        console.error("Server returned:", response.status);
        return;
      }

      const res = await response.json();

      const filteredData = res.map((thread) => ({
        threadID: thread.threadId,
        title: thread.title,
        createdAt: thread.createdAt,
      }));

      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setResponse("");
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${newThreadId}`
      );

      if (!response.ok) {
        console.error("Server returned:", response.status);
        return;
      }

      const res = await response.json();
      console.log("Fetched thread:", res);

      setPrevChats(res.messages || []);

      setNewChat(false);

      setResponse("");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadID) => {
    try {
      await fetch(`http://localhost:8080/api/thread/${threadID}`, {
        method: "DELETE",
      });

      // remove from UI immediately
      setAllThreads((prev) => prev.filter((t) => t.threadID !== threadID));

      if (threadID === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src="src/assets/blackLogo.png" alt="GPT Logo" className="logo" />
        <span>
          <i className="fa-regular fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={() => changeThread(thread.threadID)}
            className={thread.threadID === currThreadId ? "activeThread" : ""}>
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadID);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">Made with &hearts; by MedhaSunkad</div>
    </section>
  );
}

export default Sidebar;
