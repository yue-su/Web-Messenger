import { Box, Typography } from "@material-ui/core";
import React from "react";
import backgroundImage from "../images/bg-img.png";
import chat from "../images/chat.svg";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  sideBar: {
    backgroundImage: `linear-gradient(rgba(58, 141, 255, 0.85), rgba(134, 185, 255, 0.85) ),url(${backgroundImage})`,
  },
}));

const SideBar = () => {
  const classes = useStyles();

  return (
    <Box
      width="425px"
      minHeight="700px"
      className={classes.sideBar}
      textAlign="center"
      display="flex"
      justifyContent="center"
      position="relative"
    >
      <Box
        position="absolute"
        top="200px"
        width="269px"
        height="186px"
        display="flex"
        justifyContent="space-between"
        flexDirection="column"
      >
        <img src={chat} alt="chat_logo" />
        <Box height="80px" color="white">
          <Typography variant="h1" gutterBottom>
            Converse with anyone
          </Typography>
          <Typography variant="h1">with any language</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SideBar;
