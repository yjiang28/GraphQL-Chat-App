import React, { useState } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import { useMutation, useSubscription, useQuery } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Badge,
  Button,
  IconButton,
  InputBase,
  Toolbar,
  Typography
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { Notification, NotificationMenu, SearchResultMenu } from "./shared/";
import { CURRENT_USER_QUERY } from "../queries/user";
import { SIGNOUT_MUTATION } from "../mutations/user";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `fade(${theme.palette.common.white}, 0.15)`,
    "&:hover": {
      backgroundColor: `fade(${theme.palette.common.white}, 0.25)`
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto"
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch"
    }
  }
}));

const NavBar = ({ me }) => {
  const classes = useStyles();
  const [searchEmail, setSearchEmail] = useState("");
  const [notifEl, setNotifEl] = useState(null);
  const [searchEl, setSearchEl] = useState(null);
  const [newNotif, setNewNotif] = useState(false);

  const [SignOut, _] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });

  const openNotifMenu = e => {
    setNewNotif(false);
    setNotifEl(e.currentTarget);
  };

  const closeNotifMenu = () => {
    setNotifEl(null);
  };

  const submitSearch = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchEmail(formData.get("email"));
    setSearchEl(e.currentTarget);
  };

  const logout = () => {
    try {
      SignOut();
      Router.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  const login = () => {
    Router.push("/signin");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            ChatApp
          </Typography>
          <form className={classes.search} onSubmit={submitSearch}>
            <InputBase
              placeholder="Enter user email..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ "aria-label": "search" }}
              type="email"
              name="email"
            />
            <IconButton aria-label="search" color="inherit" type="submit">
              <SearchIcon />
            </IconButton>
          </form>
          <SearchResultMenu anchorEl={searchEl} />
          <IconButton
            aria-label={
              newNotif
                ? "No unread notifications"
                : "You have new notifications"
            }
            color="inherit"
            onClick={openNotifMenu}
          >
            <Badge variant="dot" color="secondary" invisible={!newNotif}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <NotificationMenu anchorEl={notifEl} onClose={closeNotifMenu} />
          <Button color="inherit" onClick={me ? logout : login}>
            {me ? "Logout" : "Login / Sign Up"}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

NavBar.propTypes = {
  me: PropTypes.object
};

export default NavBar;
