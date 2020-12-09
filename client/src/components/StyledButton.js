import { Button } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const StyledButton = (props) => {
  const useStyles = makeStyles(() => ({
    button: {
      color: props.textColor,
      fontSize: 14,
      fontWeight: 600,
      width: 160,
      height: 56,
      textTransform: "none",
    },
  }));

  const classes = useStyles();

  return (
    <Button {...props} variant="contained" className={classes.button}>
      {props.text}
    </Button>
  );
};
export default StyledButton;
