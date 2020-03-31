import { Fragment, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  InputBase,
  IconButton,
  Toolbar,
  withStyles
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import SearchResultList from "./SearchResultList";

const styles = theme => ({
  appBar: {
    top: 0,
    left: 0,
    width: "calc(100% - 2px)",
    margin: 0,
    boxShadow: "none"
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1, 0)
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[200],
    width: "100%",
    padding: theme.spacing(0, 2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  inputRoot: {
    width: "100%",
    borderRadius: theme.shape.borderRadius,
    color: "inherit",
    backgroundColor: theme.palette.grey[200]
  },
  inputInput: {
    transition: theme.transitions.create("width"),
    width: "100%"
  }
});

const SearchForm = ({ classes, me }) => {
  const [focused, setFocused] = useState(false);
  const [username, setUsername] = useState("");
  const ref = useRef();

  const handleChange = e => {
    setUsername(e.currentTarget.value);
  };

  return (
    <Fragment>
      <AppBar
        position="relative"
        color="inherit"
        classes={{ root: classes.appBar }}
        ref={ref}
      >
        <Toolbar classes={{ root: classes.toolBar }}>
          <div className={classes.search}>
            <InputBase
              placeholder="Search Messenger"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              name="username"
              inputProps={{ "aria-label": "Search Messenger" }}
              value={username}
              onChange={handleChange}
            />
            <IconButton edge="end" aria-label="search">
              <SearchIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {username && <SearchResultList username={username} me={me} />}
    </Fragment>
  );
};

SearchForm.propTypes = {
  me: PropTypes.object.isRequired
};

export default withStyles(styles)(SearchForm);
