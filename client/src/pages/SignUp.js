import { Box, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import SideBar from "../components/SideBar";
import StyledButton from "../components/StyledButton";

const initialState = { email: "", password: "" };

const SignUp = () => {
  const [state, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefalt();
  };

  return (
    <Box width="1024px" display="flex">
      <SideBar />
      <Box position="relative" display="flex" alignItems="center">
        <Box
          width="351px"
          display="flex"
          justifyContent="space-between"
          position="absolute"
          top="30px"
          left="206px"
          alignItems="center"
        >
          <Typography variant="body2">Already have an account?</Typography>
          <StyledButton color="secondary" textColor="#3a8dff" text="Login" />
        </Box>
        <Box
          position="absolute"
          width="380px"
          height="358px"
          left="100px"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Typography variant="h2">Create an account.</Typography>
          <TextField
            color="primary"
            name="email"
            value={state.email}
            onChange={handleChange}
            label="Email address"
          />
          <TextField
            color="primary"
            name="password"
            value={state.password}
            type="password"
            onChange={handleChange}
            label="Password"
          />
          <Box alignSelf="center">
            <StyledButton
              onClick={handleSubmit}
              text="Login"
              textColor="#fff"
              color="primary"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
