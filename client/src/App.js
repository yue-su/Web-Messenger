import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
//import LandingPage from "./pages/Landing"

import "./App.css";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Route exact path="/" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
