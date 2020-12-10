import React, { useState, useEffect, createContext } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

export const userContext = createContext();

const UsersProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState([]);

  function login(state, history) {
    axiosWithAuth()
      .post("/users/login", state)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        console.log(res.data);
        setUser(res.data.data);
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

  useEffect(() => {
    axiosWithAuth()
      .get("/users/")
      .then((res) => {
        console.log(res.data.data);
        setUserList(res.data.data);
      });
  }, [user]);

  return (
    <userContext.Provider value={{ user, register, login, userList }}>
      {children}
    </userContext.Provider>
  );
};

export default UsersProvider;
