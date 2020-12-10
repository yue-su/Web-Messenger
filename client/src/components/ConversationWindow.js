import { Grid, TextField, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import MsgReceived from "./MsgReceived";
import MsgSent from "./MsgSent";

const useStyles = makeStyles(() => ({
  container: {
    height: "100vh",
  },
  messageWindow: {
    flexGrow: 1,
  },
  title: {
    padding: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  },
}));

const ConversationWindow = () => {
  const classes = useStyles();

  return (
    <Grid
      item
      container
      md={8}
      direction="column"
      className={classes.container}
    >
      <Grid item className={classes.title}>
        <Typography variant="h3">Santiago</Typography>
        <MoreHoriz />
      </Grid>
      <Grid item className={classes.messageWindow}>
        <MsgReceived />
        <MsgSent />
      </Grid>
      <Grid item>
        <TextField fullWidth variant="outlined" />
      </Grid>
    </Grid>
  );
};

export default ConversationWindow;
