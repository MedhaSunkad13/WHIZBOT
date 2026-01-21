// import {createContext} from "react";

// export const MyContext = createContext("");

import { createContext, useState } from "react";

export const MyContext = createContext();

export function MyProvider({ children }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [prevChats, setPrevChats] = useState([]);
  const [currThreadId, setCurrThreadId] = useState(null);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const value = {
    prompt, setPrompt,
    response, setResponse,
    prevChats, setPrevChats,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    allThreads, setAllThreads,
  };

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
}
