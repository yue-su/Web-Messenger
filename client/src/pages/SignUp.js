import {
  Box,
  TextField,
  Typography,
  Link,
  Grid,
  Snackbar,
} from "@material-ui/core";

import React, { useContext, useState } from "react";
import SideBar from "../components/SideBar";
import StyledButton from "../components/StyledButton";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { userContext } from "../providers/UsersProvider";
import Alert from "../components/Alert";

const useStyles = makeStyles(() => ({
  container: {
    height: "100vh",
  },
}));

const initialState = { username: "", email: "", password: "" };

const SignUp = () => {
  const classes = useStyles();

  const history = useHistory();

  const { register, errors } = useContext(userContext);

  const [state, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(state, history);
    setState(initialState);
  };

  return (
    <Grid container className={classes.container}>
      <SideBar />
      <Grid item xs={12} md={7} container direction="column">
        <Grid item container justify="flex-end">
          <Snackbar open={errors.register}>
            <Alert severity="warning">
              username, email and password is required
            </Alert>
          </Snackbar>
          <Box
            width="350px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingTop="30px"
            paddingRight="10px"
          >
            <Typography variant="body2">Already have an account?</Typography>
            <Link to="/sign-in" component={RouterLink} underline="none">
              <StyledButton
                color="secondary"
                textColor="#3a8dff"
                text="Login"
              />
            </Link>
          </Box>
        </Grid>
        <Grid item container justify="center">
          <Box
            position="absolute"
            width="380px"
            height="400px"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            paddingTop="100px"
          >
            <Typography variant="h2">Create an account.</Typography>
            <TextField
              color="primary"
              name="username"
              value={state.username}
              onChange={handleChange}
              label="Username"
              required
            />
            <TextField
              color="primary"
              name="email"
              value={state.email}
              onChange={handleChange}
              label="Email address"
              type="email"
              required
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
                handler={handleSubmit}
                text="Create"
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

export default SignUp;
