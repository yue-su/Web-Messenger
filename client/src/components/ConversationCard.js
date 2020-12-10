import React from "react";
import { Avatar, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

const ConversationCard = ({ username, photoURL }) => {
  const classes = useStyles();

  return (
    <Grid item container className={classes.card} alignItems="center">
      <Avatar src={photoURL} alt={username} className={classes.avatar} />
      <Grid item className={classes.message}>
        <Typography>{username}</Typography>
        <Typography variant="body2">message...</Typography>
      </Grid>
    </Grid>
  );
};

export default ConversationCard;
