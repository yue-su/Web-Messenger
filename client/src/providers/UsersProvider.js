import React, { useState, useEffect, createContext } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import io from "socket.io-client";

let socket;

export const userContext = createContext();

const UsersProvider = ({ children }) => {
  const [user, setUser] = useState({ userId: "", username: "" });
  const [conversations, setConversations] = useState([]);
  const [currentTalkto, setCurrentTalkto] = useState("");
  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState("");

  useEffect(() => {
    socket = io("http://192.168.1.11:3001");
    socket.on("replyMessage", (message) => {
      setCurrentMessages((currentMessages) => [...currentMessages, message]);
    });
  }, []);

  function login(state, history) {
    axiosWithAuth()
      .post("/users/login", state)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.data);

        socket.emit("online", res.data.data);

        axiosWithAuth()
          .get(`/conversations/user/${res.data.data.userId}`)
          .then((res) => {
            setConversations(res.data);
          })
          .catch((error) => console.error(error));

        history.push(`/chatroom`);
      });
  }

  function register(state, history) {
    axiosWithAuth()
      .post("/users/register", state)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setUser(res.data);
        history.push(`/chatroom`);
      });
  }

  function passMessages(messages, data, id) {
    setCurrentMessages(messages);
    setCurrentTalkto(data.username);
    setCurrentConversationId(id);
  }

  function renderMessage(message) {
    setCurrentMessages([...currentMessages, message]);
  }

  return (
    <userContext.Provider
      value={{
        user,
        register,
        login,
        conversations,
        currentConversationId,
        currentTalkto,
        currentMessages,
        renderMessage,
        passMessages,
        socket,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UsersProvider;
