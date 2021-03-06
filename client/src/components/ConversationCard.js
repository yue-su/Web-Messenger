import React, { useContext, useEffect, useState } from "react";
import { Avatar, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { userContext } from "../providers/UsersProvider";

const useStyles = makeStyles(() => ({
  card: {
    margin: 10,
  },
  message: {
    paddingLeft: 20,
  },
  avatar: {
    width: 44,
    height: 44,
  },
}));

const ConversationCard = ({ conversationId }) => {
  const classes = useStyles();
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  // eslint-disable-next-line
  const [messages, setMessages] = useState([]);
  const { passMessages, incomingMsg } = useContext(userContext);

  /**
   * get the receiver's information including avatar, username and id.
   */
  useEffect(() => {
    (async () => {
      try {
        const conversations = await axiosWithAuth().get(
          `/api/conversations/${conversationId}`
        );
        if (conversations.data[0]) {
          const { photoURL, username, id } = conversations.data[0].user;
          setAvatar(photoURL);
          setUsername(username);
          setUserId(id);
        }

        const messages = await axiosWithAuth().get(
          `/api/messages/conversation/${conversationId}`
        );
        if (messages.data[0]) {
          setLastMessage(messages.data[0].content);
        }
        setMessages(messages.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [conversationId]);

  /**
   * handle incoming messages from socket server and compare with the conversationID
   * if it's matched, add to the messages
   */
  useEffect(() => {
    if (incomingMsg && incomingMsg.conversationId === conversationId) {
      setMessages((messages) => [incomingMsg, ...messages]);
      setLastMessage(incomingMsg.content);
    }
  }, [conversationId, incomingMsg]);

  /**
   * when the user click the card, it passes the message to the conversationWindow
   * here I called the API again just trying to sync messages from the server
   */
  const handleClick = async () => {
    const messages = await axiosWithAuth().get(
      `/api/messages/conversation/${conversationId}`
    );
    setMessages(messages.data);
    passMessages(messages.data, username, conversationId, userId);
    if (messages.data[0]) {
      setLastMessage(messages.data[0].content);
    }
  };

  return (
    <Grid
      item
      container
      className={classes.card}
      alignItems="center"
      onClick={handleClick}
    >
      <Avatar src={avatar} className={classes.avatar} />
      <Grid item className={classes.message}>
        <Typography variant="body1">{username}</Typography>
        <Typography variant="body2">{lastMessage}</Typography>
      </Grid>
    </Grid>
  );
};

export default ConversationCard;
