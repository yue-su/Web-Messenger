import React, { useState, useEffect, createContext } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

export const userContext = createContext();

const UsersProvider = ({ children }) => {
  const [user, setUser] = useState({ userId: "", username: "" });
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState({
    username: "",
    messages: [],
    conversationId: "",
  });

  function login(state, history) {
    axiosWithAuth()
      .post("/users/login", state)
      .then((res) => {
        localStorage.setItem("token", res.data.token);

        setUser(res.data.data);

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

  //useEffect(() => {}, [conversations]);

  return (
    <userContext.Provider
      value={{
        user,
        register,
        login,
        conversations,
        currentConversation,
        passMessages,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UsersProvider;
