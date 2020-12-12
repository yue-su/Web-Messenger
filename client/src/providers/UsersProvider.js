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
      console.log(message);
      setCurrentMessages((currentMessages) => {
        return [...currentMessages, message];
      });
    });

    socket.on("getConversation", (conversation) => {
      console.log(conversation);
      setConversations((conversations) => [...conversations, conversation]);
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
        setUser(res.data.data);

        socket.emit("online", res.data.data);
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

  function renderMessages(userTalkToId, userTalkToUsername) {
    axiosWithAuth()
      .get(`/messages/conversation/${userTalkToId}`)
      .then((messages) => {
        setCurrentConversationId(userTalkToId);
        setCurrentTalkto(userTalkToUsername);
        setCurrentMessages(messages.data);
      });
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
        renderMessages,
        socket,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UsersProvider;
