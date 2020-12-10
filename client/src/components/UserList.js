import { Grid } from "@material-ui/core";
import React, { useContext } from "react";
import { userContext } from "../providers/UsersProvider";
import ConversationCard from "./ConversationCard";

const UserList = () => {
  const { userList } = useContext(userContext);
  return (
    <Grid item container spacing={2}>
      {userList.map((user) => (
        <ConversationCard key={user.id} {...user} />
      ))}
    </Grid>
  );
};

export default UserList;
