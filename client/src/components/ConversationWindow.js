import { Grid, TextField, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import MsgReceived from "./MsgReceived";
import MsgSent from "./MsgSent";
import { userContext } from "../providers/UsersProvider";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const useStyles = makeStyles(() => ({
  container: {
    height: "100vh",
  },
  messageWindow: {
    flexGrow: 1,
    overflowY: "scroll",
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
  const {
    currentConversationId,
    currentTalkto,
    currentMessages,
    user,
    socket,
    renderMessage,
  } = useContext(userContext);

  const [state, setState] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      userId: user.userId,
      conversationId: currentConversationId,
      content: state,
    };
    axiosWithAuth()
      .post(`/messages`, data)
      .then((message) => {
        renderMessage(message.data);
        socket.emit("sentMessage", {
          message: message.data,
          userTo: currentTalkto,
        });
      });

    setState("");
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
        <Typography variant="h3">{currentTalkto}</Typography>
        <MoreHoriz />
      </Grid>
      <Grid item className={classes.messageWindow}>
        {currentMessages.map((message) => {
          //console.log(message);
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
            value={state}
            fullWidth
            variant="outlined"
            onChange={(e) => setState(e.target.value)}
          />
        </form>
      </Grid>
    </Grid>
  );
};

export default ConversationWindow;
