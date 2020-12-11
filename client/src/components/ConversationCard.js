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

const cardInitialValue = {
  avatar: "",
  username: "",
  lastMessage: "",
};

const ConversationCard = ({ conversationId }) => {
  const classes = useStyles();
  const [card, setCard] = useState(cardInitialValue);
  const [messages, setMessages] = useState([]);
  const { passMessages } = useContext(userContext);

  useEffect(() => {
    axiosWithAuth()
      .get(`/conversations/${conversationId}`)
      .then((conversations) => {
        const userTwo = conversations.data[0].user;
        setCard({
          ...card,
          avatar: userTwo.photoURL,
          username: userTwo.username,
        });
      });
  }, []);

  useEffect(() => {
    axiosWithAuth()
      .get(`/messages/conversation/${conversationId}`)
      .then((messages) => {
        if (messages.data[0]) {
          setCard({
            ...card,
            lastMessage: messages.data[0].content,
          });
        }
        setMessages(messages.data);
      });
  }, []);

  const handleClick = () => {
    passMessages(messages, card, conversationId);
    console.log(messages);
  };

  return (
    <Grid
      item
      container
      className={classes.card}
      alignItems="center"
      onClick={handleClick}
    >
      <Avatar src={card.avatar} className={classes.avatar} />
      <Grid item className={classes.message}>
        <Typography variant="body1">{card.username}</Typography>
        <Typography variant="body2">{card.lastMessage}</Typography>
      </Grid>
    </Grid>
  );
};

export default ConversationCard;
