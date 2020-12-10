import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { theme } from "./themes/theme";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import Chatroom from "./pages/Chatroom";
import UsersProvider from "./providers/UsersProvider";

function App() {
  return (
    <UsersProvider>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Redirect exact from="/" to="/sign-in" />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-up" component={SignUp} />
            <PrivateRoute path="/chatroom" component={Chatroom} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </UsersProvider>
  );
}

export default App;
