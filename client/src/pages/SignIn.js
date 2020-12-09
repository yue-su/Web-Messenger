import { Box, TextField, Typography, Link, Grid } from "@material-ui/core";
import React, { useState } from "react";
import SideBar from "../components/SideBar";
import StyledButton from "../components/StyledButton";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const useStyles = makeStyles(() => ({
  container: {
    height: "100vh",
  },
}));

const initialState = { email: "", password: "" };

const SignIn = () => {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosWithAuth()
      .post("/users/login", state)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        history.push(`/chatroom`);
      });
    setState(initialState);
  };

  return (
    <Grid container className={classes.container}>
      <SideBar />
      <Grid item xs={12} md={7} container direction="column">
        <Grid item container justify="flex-end">
          <Box
            width="350px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingTop="30px"
            paddingRight="10px"
          >
            <Typography variant="body2">Don't have an account?</Typography>
            <Link to="/sign-up" component={RouterLink} underline="none">
              <StyledButton
                color="secondary"
                textColor="#3a8dff"
                text="Create account"
              />
            </Link>
          </Box>
        </Grid>
        <Grid item container justify="center">
          <Box
            position="absolute"
            width="380px"
            height="358px"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            paddingTop="100px"
          >
            <Typography variant="h2">Welcome Back!</Typography>
            <TextField
              color="primary"
              name="email"
              value={state.email}
              onChange={handleChange}
              label="Email address"
              required
              type="email"
            />
            <TextField
              color="primary"
              name="password"
              value={state.password}
              type="password"
              onChange={handleChange}
              label="Password"
              required
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
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignIn;
