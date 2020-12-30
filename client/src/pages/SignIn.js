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

const initialState = { email: "", password: "" };

const SignIn = () => {
  const classes = useStyles();
  const history = useHistory();

  const { login, errors } = useContext(userContext);
  const [state, setState] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(state, history);
    setState(initialState);
  };

  return (
    <Grid container className={classes.container}>
      <SideBar />
      <Grid item xs={12} md={7} container direction="column">
        <Grid item container justify="flex-end">
          <Snackbar open={errors.login}>
            <Alert severity="warning">Wrong username and password</Alert>
          </Snackbar>
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
            <Box
              width="100%"
              alignSelf="center"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <StyledButton
                handler={handleSubmit}
                text="Login"
                textColor="#fff"
                color="primary"
              />
              <Typography>or</Typography>
              <Link href="http://localhost:3001/auth/google">Google +</Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SignIn;
