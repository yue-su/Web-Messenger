import { Avatar, Box, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  search: {
    marginTop: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  message: {
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: "8px 15px",
    marginTop: 5,
    backgroundColor: "#3a8dff",
  },
}));

const MsgSent = () => {
  const classes = useStyles();

  return (
    <Box display="flex" m={3}>
      <Avatar className={classes.avatar} />
      <Box ml={2}>
        <Typography variant="body2">santiage 10:55</Typography>
        <Box className={classes.message}>
          <Typography color="secondary">Where are you from</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MsgSent;
