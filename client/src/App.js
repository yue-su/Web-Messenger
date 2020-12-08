import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import { theme } from "./themes/theme";
//import LandingPage from "./pages/Landing"

import "./App.css";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/sign-in" />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
