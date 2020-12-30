import React, { useContext, useEffect } from "react";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { userContext } from "./UsersProvider";

const LoginSuccess = () => {
  const location = useLocation();
  const history = useHistory();

  const { loginWithGoogle } = useContext(userContext);

  useEffect(() => {
    const parsed = queryString.parse(location.search);
    console.log(parsed);
    loginWithGoogle(parsed, history);
  }, [history, location.search, loginWithGoogle]);

  return <div>Google login page</div>;
};

export default LoginSuccess;
