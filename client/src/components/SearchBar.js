import { Grid, TextField, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  search: {
    marginTop: 20,
    marginBottom: 20,
  },
}));

const SearchBar = () => {
  const classes = useStyles();

  return (
    <Grid item className={classes.search}>
      <Typography variant="h2" paragraph>
        Chats
      </Typography>
      <TextField variant="outlined" fullWidth />
    </Grid>
  );
};

export default SearchBar;
