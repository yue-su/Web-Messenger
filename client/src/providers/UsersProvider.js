import React, { useState, useEffect, createContext, useRef } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { getRandomAvatar } from "../utils/getRandomAvatar";
import io from "socket.io-client";

let socket;

export const userContext = createContext();

/**
 * setting up the initial root states for the app
 */

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

/**
 * The UsersProveder holds the root states and initalizes them with uselocalstorage
 */

const UsersProvider = ({ children }) => {
  const [user, setUser] = useState(userInit);
  const [conversations, setConversations] = useState(conversationsInit);
  const [incomingMsg, setIncomingMsg] = useState(incomingMsgInit);
  const [currentChatReceiver, setCurrentChatReceiver] = useState(
    currentChatReceiverInit
  );

  const [errors, setErrors] = useState(errorsInit);

  //
  /**
   * a currentIdRef is set to track the current conversation's ID on every render.
   * This is for the socket to check the incoming message's id and compare with the currentIdRef.
   *
   * As the socket is initiated in a useEffect only only runs after the first render,
   * it can't reference any of the state's current value, that's why the currentIdRef took place.
   */
  const currentIdRef = useRef();

  useEffect(() => {
    currentIdRef.current = currentChatReceiver.conversationId;
  });

  /**
   * socket client set up, the URL is pointing to the backend(on another server)
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    socket = io(process.env.REACT_APP_BACKEND, {
      auth: {
        token: token,
      },
    });

    /**
     * a replyMessage event is to license the incoming messages sent from the server.
     * it checks the incoming message's conversationId with the current conversationID.
     * if the Ids are match, the message will be added to the current chat window.
     * if it's not a match, the message will be sent to a state called incomingMsg, the state is
     * passed to the conversationCard for further process.
     */

    const online = socket.emit("online", user);

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

    socket.on("user", (user) => {
      console.log(user);
    });

    return online;
  }, [user]);

  useEffect(() => {
    if (user.userId) {
      axiosWithAuth()
        .get(`/api/conversations/user/${user.userId}`)
        .then((res) => {
          setConversations(res.data);
        })
        .catch((error) => console.error(error));
    }
  }, [user]);

  /**
   * login and register function takes care of the user state,
   * they also emit a user online message to the socket server.
   * needs to do a refactor for better structrue
   */

  function login(state, history) {
    axiosWithAuth()
      .post("/api/users/login", state)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.data);

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

  function loginWithGoogle(user, history) {
    const userInfo = {
      //here we need to conver the id to integer by adding +
      userId: +user.userId,
      username: user.username,
      photoURL: user.photoURL,
    };
    setUser(userInfo);
    localStorage.setItem("token", user.token);
    history.push("/chatroom");
  }

  function register(state, history) {
    if (state.username && state.password && state.email) {
      axiosWithAuth()
        .post("/api/users/register", { ...state, photoURL: getRandomAvatar() })
        .then((res) => {
          localStorage.setItem("token", res.data.token);

          setUser({
            userId: res.data.data.id,
            username: res.data.data.username,
            photoURL: res.data.data.photoURL,
          });
          axiosWithAuth()
            .get(`/api/conversations/user/${res.data.data.id}`)
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

  /**
   * this passMessages function is used by the conversationCard component.
   * when a user click one of the conversation card on the list, the receiver's information
   * will be passed to the current chat window
   */
  function passMessages(messages, username, conversationId, userId) {
    setCurrentChatReceiver({
      messages: messages,
      username: username,
      conversationId: conversationId,
      userId: userId,
    });
  }

  /*Used by searchBar when the user created a new conversation */
  function createNewConversation(conversation) {
    setConversations([conversation, ...conversations]);
  }

  /**
   * When the user sent a message, it will render on the current chat window
   */
  function renderMessage(message) {
    setCurrentChatReceiver({
      ...currentChatReceiver,
      messages: [message, ...currentChatReceiver.messages],
    });
  }

  return (
    <userContext.Provider
      value={{
        socket,
        user,
        conversations,
        currentChatReceiver,
        incomingMsg,
        errors,
        register,
        login,
        passMessages,
        renderMessage,
        createNewConversation,
        loginWithGoogle,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UsersProvider;
