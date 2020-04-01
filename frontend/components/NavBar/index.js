import { Fragment, useState } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import { useMutation, useQuery, useApolloClient } from "@apollo/react-hooks";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  makeStyles
} from "@material-ui/core";
import ProfileButton from "./ProfileButton";
import NotificationButton from "./NotificationButton";
import { CURRENT_USER_QUERY } from "../../gqls/queries/userQueries";
import { SIGN_OUT_MUTATION } from "../../gqls/mutations/userMutations";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}));

const NavBar = ({ me }) => {
  const classes = useStyles();

  const client = useApolloClient();

  const [SignOut, _] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    onCompleted: data => {
      Router.push("/signin");
      client.resetStore();
    },
    onError: e => {
      console.log("NavBar: SIGN_OUT_MUTATION:", e);
    }
  });

  const logout = () => {
    SignOut();
  };

  const login = () => {
    Router.push("/signin");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          CHAT APP
        </Typography>
        {me && (
          <Fragment>
            <NotificationButton me={me} />
            <ProfileButton me={me} />
          </Fragment>
        )}
        <Button color="inherit" onClick={me ? logout : login}>
          {me ? "Logout" : "Login / Sign Up"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  me: PropTypes.object
};

export default NavBar;
