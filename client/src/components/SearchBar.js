import { Avatar, Grid, TextField, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { userContext } from "../providers/UsersProvider";

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

const SearchBar = () => {
  const classes = useStyles();
  const [state, setState] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { user, renderMessages, cleanChat } = useContext(userContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setState("");
  };

  const handleClick = (currentChatReceiverId, currentChatReceiverUsername) => {
    //if user click himself, return an error
    if (currentChatReceiverId === user.userId) {
      console.log("can't talk to your self");
    } else {
      console.log(user.userId);
      console.log(currentChatReceiverId);

      axiosWithAuth()
        .post(`/conversations`, {
          userIdOne: user.userId,
          userIdTwo: currentChatReceiverId,
        })
        .then((res) => {
          console.log(res.data.message);
        });
      setState("");
      cleanChat();
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
              onClick={() => handleClick(user.id, user.username)}
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
