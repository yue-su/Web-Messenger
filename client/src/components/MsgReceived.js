import React from "react";
import { Avatar, Box, Typography } from "@material-ui/core";
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
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: "8px 15px",
    marginTop: 5,
    color: "#91A3C0",
    backgroundColor: "#F4F6FA",
  },
}));

const MsgReceived = () => {
  const classes = useStyles();

  return (
    <Box display="flex" m={3} justifyContent="flex-end">
      <Box mr={2}>
        <Typography variant="body2" align="right">
          santiage 10:55
        </Typography>
        <Box className={classes.message}>
          <Typography>Share photo of your city, please</Typography>
        </Box>
      </Box>
      <Avatar className={classes.avatar} />
    </Box>
  );
};

export default MsgReceived;
