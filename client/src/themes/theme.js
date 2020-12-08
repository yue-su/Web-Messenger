import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: "Open Sans",
    fontSize: 14,
    h1: {
      fontSize: 26,
      // could customize the h1 variant as well
    },
    body2: {
      color: "#b0b0b0",
    },
  },
  palette: {
    primary: { main: "#3a8dff" },
    secondary: { main: "#fff" },
  },
});
