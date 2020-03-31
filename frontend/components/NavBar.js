import React, { useState } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  makeStyles
} from "@material-ui/core";
import { NotificationButton } from "./shared/";
import { CURRENT_USER_QUERY } from "../gqls/queries/userQueries";
import { SIGN_OUT_MUTATION } from "../gqls/mutations/userMutations";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}));

const NavBar = ({ me }) => {
  const classes = useStyles();
  const [SignOut, _] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });

  const logout = async () => {
    try {
      await SignOut();
      Router.push("/signin");
    } catch (e) {
      console.log("NavBar", e);
    }
  };

  const login = () => {
    Router.push("/signin");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          ChatApp
        </Typography>
        {me && <NotificationButton me={me} />}
        <Button color="inherit" onClick={me ? logout : login}>
          {me ? "Logout" : "Login / Sign Up"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  me: PropTypes.object.isRequired
};

export default NavBar;
