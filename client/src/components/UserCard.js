import { Avatar, Button, Grid, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { userContext } from "../providers/UsersProvider";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();

  const handleClick = (e) => {
    localStorage.clear();
    history.push("/");
  };

  return (
    <Grid
      item
      container
      alignItems="center"
      justify="space-between"
      className={classes.container}
    >
      <Grid item container alignItems="center" xs={8}>
        <Avatar src={photoURL} alt={username} className={classes.avatar} />
        <Typography variant="h4" className={classes.name}>
          {username}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Button onClick={handleClick} variant="contained">
          Logout
        </Button>
      </Grid>
    </Grid>
  );
};

export default UserCard;
