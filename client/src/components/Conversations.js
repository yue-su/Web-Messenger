import { Grid } from "@material-ui/core";
import React, { useContext } from "react";
import { userContext } from "../providers/UsersProvider";
import ConversationCard from "./ConversationCard";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  container: {
    height: "100vh",
  },
  messageWindow: {
    overflowY: "scroll",
    overflowX: "hidden",
    flexDirection: "column",
    flexWrap: "nowrap",
  },
}));

const Conversations = () => {
  const classes = useStyles();
  const { conversations } = useContext(userContext);
  return (
    <Grid item container spacing={2} className={classes.messageWindow}>
      {conversations.map((conversation) => (
        <ConversationCard key={conversation.conversationId} {...conversation} />
      ))}
    </Grid>
  );
};

export default Conversations;
