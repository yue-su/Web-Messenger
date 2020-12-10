import React, { useState, useEffect, createContext } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

export const userContext = createContext();

const UsersProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    axiosWithAuth()
      .get("/users/")
      .then((res) => {
        console.log(res.data.data);
        setUserList(res.data.data);
      });
  }, [user]);

  return (
    <userContext.Provider value={{ user, setUser, userList }}>
      {children}
    </userContext.Provider>
  );
};

export default UsersProvider;
