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
  const [lastMessage, setLastMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { passMessages, conversations } = useContext(userContext);

  useEffect(() => {
    axiosWithAuth()
      .get(`/conversations/${conversationId}`)
      .then((conversations) => {
        if (conversations.data[0]) {
          const { photoURL, username } = conversations.data[0].user;
          setAvatar(photoURL);
          setUsername(username);
        }
      });
  }, [conversationId]);

  useEffect(() => {
    axiosWithAuth()
      .get(`/messages/conversation/${conversationId}`)
      .then((messages) => {
        if (messages.data[messages.data.length - 1]) {
          setLastMessage(messages.data[messages.data.length - 1].content);
        }
        setMessages(messages.data);
      });
  }, [conversationId, conversations]);

  const handleClick = () => {
    const data = {
      avatar: avatar,
      username: username,
      lastMessage: lastMessage,
    };
    passMessages(messages, data, conversationId);
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
