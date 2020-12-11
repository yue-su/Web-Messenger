import { Grid } from "@material-ui/core";
import React from "react";
import SearchBar from "../components/SearchBar";
import UserCard from "../components/UserCard";
import { makeStyles } from "@material-ui/core/styles";
import ConversationWindow from "../components/ConversationWindow";
import Conversations from "../components/Conversations";

const useStyles = makeStyles(() => ({
  container: {
    height: "100vh",
    padding: 20,
  },
}));

const Chatroom = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container} spacing={10} wrap="nowrap">
      <Grid item container md={4} direction="column" spacing={1} wrap="nowrap">
        <UserCard />
        <SearchBar />
        <Conversations />
      </Grid>
      <ConversationWindow />
    </Grid>
  );
};

export default Chatroom;
