import "./App.css";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { MyProvider } from "./MyContext";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr thread
  const [newChat, setNewChat] = useState(true); //to trigger new chat creation
  const [allThreads, setAllThreads] = useState([]); //stores all threads info

  const providerValue = {
    prompt,
    setPrompt,
    responses,
    setResponses,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
  };
  return (
    <div className="mainApp">
      <MyProvider>
        <Sidebar />
        <ChatWindow />
      </MyProvider>
    </div>
  );
}

export default App;
