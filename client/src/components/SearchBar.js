import {
  Avatar,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { userContext } from "../providers/UsersProvider";
import Alert from "./Alert";

const useStyles = makeStyles(() => ({
  search: {
    marginTop: 20,
    marginBottom: 20,
  },
  searchResult: {
    position: "absolute",
    zIndex: "10",
    backgroundColor: "#f8f9f0",
    width: 300,
  },
  user: {
    padding: 10,
  },
}));

const errorInit = {
  duplicate: false,
  sameId: false,
};

const SearchBar = () => {
  const classes = useStyles();
  const [state, setState] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { user, createNewConversation } = useContext(userContext);
  const [error, setError] = useState(errorInit);

  const handleSubmit = (e) => {
    e.preventDefault();
    setState("");
  };

  const handleClick = (currentChatReceiverId) => {
    //if user click himself, return an error
    if (currentChatReceiverId === user.userId) {
      setError({ ...error, sameId: true });
    } else {
      const users = [user.userId, currentChatReceiverId].sort().join("to");
      console.log(users);
      axiosWithAuth()
        .post(`/conversations`, {
          senderId: user.userId,
          receiverId: currentChatReceiverId,
          users: users,
        })
        .then((res) => {
          createNewConversation(res.data[0]);
        })
        .catch((err) => {
          setError({ ...error, duplicate: true });
        });
      setState("");
      setError(errorInit);
    }
  };

  useEffect(() => {
    axiosWithAuth()
      .get(`/users`)
      .then((users) => {
        if (state === "") {
          setSearchResult([]);
        } else {
          const filteredUser = users.data.data.filter((user) =>
            user.username.includes(state)
          );
          setSearchResult(filteredUser);
        }
      });
  }, [state]);

  return (
    <Grid item className={classes.search}>
      <Typography variant="h2" paragraph>
        Chats
      </Typography>
      <Snackbar open={error.duplicate} autoHideDuration={2000}>
        <Alert severity="warning">
          Conversation of this user already existed
        </Alert>
      </Snackbar>
      <Snackbar open={error.sameId} autoHideDuration={2000}>
        <Alert severity="warning">
          Can't talk to yourself, feature not supported
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit}>
        <TextField
          onChange={(e) => setState(e.target.value)}
          variant="outlined"
          value={state}
          fullWidth
        />
      </form>
      <Grid container direction="column" className={classes.searchResult}>
        {searchResult.map((user) => {
          return (
            <Grid
              item
              key={user.id}
              container
              alignItems="center"
              className={classes.user}
              onClick={() => handleClick(user.id)}
            >
              <Avatar src={user.photoURL}></Avatar>
              <Typography>{user.username}</Typography>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default SearchBar;
