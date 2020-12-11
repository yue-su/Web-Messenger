import { Grid } from "@material-ui/core";
import React, { useContext } from "react";
import { userContext } from "../providers/UsersProvider";
import ConversationCard from "./ConversationCard";

const Conversations = () => {
  const { conversations } = useContext(userContext);
  return (
    <Grid item container spacing={2}>
      {conversations.map((conversation) => (
        <ConversationCard key={conversation.conversationId} {...conversation} />
      ))}
    </Grid>
  );
};

export default Conversations;
