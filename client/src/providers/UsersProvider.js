import React, { useState, useEffect, createContext, useRef } from "react";
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
  const [incomingMsg, setIncomingMsg] = useState(null);

  const currentIdRef = useRef(currentConversationId);
  const currentUserRef = useRef(user.userId);

  useEffect(() => {
    currentIdRef.current = currentConversationId;
    currentUserRef.current = user.userId;
  });

  useEffect(() => {
    socket = io("http://192.168.1.11:3001", {
      auth: {
        token: "socketToken",
      },
    });

    socket.on("replyMessage", (message) => {
      if (message.conversationId === currentIdRef.current) {
        setCurrentMessages((prevcurrentMessages) => {
          return [...prevcurrentMessages, message];
        });
      } else {
        setIncomingMsg(message);
      }
    });

    socket.on("getConversation", (conversation) => {
      setConversations((conversations) => [...conversations, conversation]);
    });
  }, []);

  function cleanChat() {
    setCurrentMessages([]);
  }

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
        axiosWithAuth()
          .get(`/conversations/user/${res.data.data.userId}`)
          .then((res) => {
            setConversations(res.data);
          })
          .catch((error) => console.error(error));
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

  function renderMessages(userTalkToId, userTalkToUsername, newConversationId) {
    axiosWithAuth()
      .get(`/messages/conversation/${userTalkToId}`)
      .then((messages) => {
        setCurrentConversationId(newConversationId);
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
        cleanChat,
        conversations,
        currentConversationId,
        currentTalkto,
        currentMessages,
        renderMessage,
        passMessages,
        renderMessages,
        socket,
        incomingMsg,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UsersProvider;
