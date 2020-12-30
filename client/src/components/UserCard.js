import { Avatar, Grid, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { userContext } from "../pages/UsersProvider";
import MoreHoriz from "@material-ui/icons/MoreHoriz";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  container: {
    margin: 15,
  },
  name: {
    paddingLeft: 20,
  },
  avatar: {
    width: 44,
    height: 44,
  },
}));

const UserCard = () => {
  const classes = useStyles();
  const { user } = useContext(userContext);
  const { username, photoURL } = user;

  return (
    <Grid
      item
      container
      alignItems="center"
      justify="space-between"
      className={classes.container}
    >
      <Grid item container alignItems="center" xs={10}>
        <Avatar src={photoURL} alt={username} className={classes.avatar} />
        <Typography variant="h4" className={classes.name}>
          {username}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <MoreHoriz />
      </Grid>
    </Grid>
  );
};

export default UserCard;
