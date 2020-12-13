import React, { useState, useEffect, createContext, useRef } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import io from "socket.io-client";
import { getRandomAvatar } from "../utils/getRandomAvatar";
import useLocalStorage from "../hooks/useLocalStorage";

let socket;

export const userContext = createContext();

const currentChatReceiverInit = {
  userId: "",
  username: "",
  messages: [],
  conversationId: "",
};

const userInit = {
  userId: "",
  username: "",
  photoURL: "",
};

const conversationsInit = [];

const incomingMsgInit = null;

const errorsInit = {
  login: false,
  register: false,
  chatInput: false,
};

const UsersProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", userInit);
  const [conversations, setConversations] = useLocalStorage(
    "conversations",
    conversationsInit
  );
  const [incomingMsg, setIncomingMsg] = useLocalStorage(
    "incoming",
    incomingMsgInit
  );
  const [currentChatReceiver, setCurrentChatReceiver] = useLocalStorage(
    "current",
    currentChatReceiverInit
  );

  const [errors, setErrors] = useState(errorsInit);

  const currentIdRef = useRef();
  //const currentUserRef = useRef(user.userId);

  useEffect(() => {
    currentIdRef.current = currentChatReceiver.conversationId;
    //currentUserRef.current = user.userId;
  });

  useEffect(() => {
    socket = io("http://192.168.1.11:3001", {
      auth: {
        token: "socketToken",
      },
    });

    socket.on("replyMessage", (message) => {
      if (message.conversationId === currentIdRef.current) {
        setCurrentChatReceiver((currentChatReceiver) => {
          return {
            ...currentChatReceiver,
            messages: [message, ...currentChatReceiver.messages],
          };
        });
      } else {
        setIncomingMsg(message);
      }
    });

    socket.on("getConversation", (conversation) => {
      console.log(conversation);
      setConversations((conversations) => [conversation, ...conversations]);
    });
  }, []);

  function cleanChat() {
    setCurrentChatReceiver({
      ...currentChatReceiver,
      messages: [],
    });
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
        setErrors({
          ...errors,
          login: false,
        });
      })
      .catch((error) => {
        if (error) {
          setErrors({
            ...errors,
            login: true,
          });
        }
      });
  }

  function register(state, history) {
    if (state.username && state.password && state.email) {
      axiosWithAuth()
        .post("/users/register", { ...state, photoURL: getRandomAvatar() })
        .then((res) => {
          localStorage.setItem("token", res.data.token);

          setUser({
            userId: res.data.data.id,
            username: res.data.data.username,
            photoURL: res.data.data.photoURL,
          });

          socket.emit("online", {
            userId: res.data.data.id,
            username: res.data.data.username,
          });
          axiosWithAuth()
            .get(`/conversations/user/${res.data.data.id}`)
            .then((res) => {
              setConversations(res.data);
            })
            .catch((error) => console.error(error));
          history.push(`/chatroom`);
        });
    } else {
      setErrors({
        ...errors,
        register: true,
      });
    }
  }

  function passMessages(messages, username, conversationId, userId) {
    setCurrentChatReceiver({
      messages: messages,
      username: username,
      conversationId: conversationId,
      userId: userId,
    });
  }

  function renderMessage(message) {
    setCurrentChatReceiver({
      ...currentChatReceiver,
      messages: [message, ...currentChatReceiver.messages],
    });
  }

  function renderMessages(userTalkToId, userTalkToUsername, newConversationId) {
    axiosWithAuth()
      .get(`/messages/conversation/${userTalkToId}`)
      .then((messages) => {
        setCurrentChatReceiver({
          userId: userTalkToId,
          conversationId: newConversationId,
          username: userTalkToUsername,
          messages: messages.data,
        });
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
        currentChatReceiver,
        renderMessage,
        passMessages,
        renderMessages,
        socket,
        incomingMsg,
        errors,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UsersProvider;
