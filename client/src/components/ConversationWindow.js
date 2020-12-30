import { Grid, TextField, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import MsgReceived from "./MsgReceived";
import MsgSent from "./MsgSent";
import { userContext } from "../pages/UsersProvider";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const useStyles = makeStyles(() => ({
  container: {
    height: "100vh",
  },
  messageWindow: {
    flexGrow: 1,
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column-reverse",
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
  const { currentChatReceiver, user, renderMessage } = useContext(userContext);

  const [state, setState] = useState("");
  const [inputError, setInputError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state) {
      const data = {
        userId: user.userId,
        conversationId: currentChatReceiver.conversationId,
        content: state,
        currentChatReceiverId: currentChatReceiver.userId,
      };
      axiosWithAuth()
        .post(`/api/messages`, data)
        .then((message) => {
          console.log(message.data);
          renderMessage(message.data);
        });

      setState("");
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  return (
    <Grid
      item
      container
      md={8}
      direction="column"
      className={classes.container}
      wrap="nowrap"
    >
      <Grid item className={classes.title}>
        <Typography variant="h3">{currentChatReceiver.username}</Typography>
        <MoreHoriz />
      </Grid>
      <Grid item className={classes.messageWindow}>
        {currentChatReceiver.messages.map((message) => {
          if (message.user.id === user.userId) {
            return <MsgSent key={message.id} {...message} />;
          } else {
            return <MsgReceived key={message.id} {...message} />;
          }
        })}
      </Grid>
      <Grid item>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Send a message"
            value={state}
            fullWidth
            variant="outlined"
            onChange={(e) => setState(e.target.value)}
            error={inputError}
          />
        </form>
      </Grid>
    </Grid>
  );
};

export default ConversationWindow;
