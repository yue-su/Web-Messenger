import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: "Open Sans",
    fontSize: 12,
    h1: {
      fontSize: 26,
      // could customize the h1 variant as well
    },
  },
  palette: {
    primary: { main: "#DF1B1B" },
  },
});
