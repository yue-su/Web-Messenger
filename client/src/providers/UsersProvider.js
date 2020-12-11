import React, { useState, useEffect, createContext } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import io from "socket.io-client";

let socket;

export const userContext = createContext();

const UsersProvider = ({ children }) => {
  const [user, setUser] = useState({ userId: "", username: "" });
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState({
    username: "",
    messages: [],
    conversationId: "",
  });

  useEffect(() => {
    socket = io("http://192.168.1.11:3001");
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

  function passMessages(messages, card, id) {
    setCurrentConversation({
      messages: messages,
      username: card.username,
      conversationId: id,
    });
  }

  function renderMessage(message) {
    setCurrentConversation({
      ...currentConversation,
      messages: [...currentConversation.messages, message],
    });
  }

  return (
    <userContext.Provider
      value={{
        user,
        register,
        login,
        conversations,
        currentConversation,
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
