import { Box, Grid, Hidden, Typography } from "@material-ui/core";
import React from "react";
import backgroundImage from "../images/bg-img.png";
import chat from "../images/chat.svg";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  sideBar: {
    backgroundImage: `linear-gradient(rgba(58, 141, 255, 0.85), rgba(134, 185, 255, 0.85) ),url(${backgroundImage})`,
    backgroundSize: "cover",
  },
}));

const SideBar = () => {
  const classes = useStyles();

  return (
    <Hidden smDown="true">
      <Grid
        item
        container
        className={classes.sideBar}
        xs={0}
        md={5}
        justify="center"
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
      </Grid>
    </Hidden>
  );
};

export default SideBar;
