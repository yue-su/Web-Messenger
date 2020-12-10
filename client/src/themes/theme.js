import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: "Open Sans",
    fontSize: 14,
    h1: {
      fontSize: 26,
      // could customize the h1 variant as well
    },
    h2: {
      fontSize: 26,
      fontWeight: 600,
      // could customize the h1 variant as well
    },
    h3: {
      fontSize: 20,
      fontWeight: 600,
    },
    h4: {
      fontSize: 16,
      fontWeight: 600,
    },
    body1: {
      fontWeight: 600,
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
