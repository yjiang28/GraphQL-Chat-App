import { Fragment, useState, useRef } from "react";
import {
  AppBar,
  InputBase,
  IconButton,
  Toolbar,
  withStyles
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { SearchResultList } from "./";

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
    padding: theme.spacing(1, 0, 1, 0)
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey[200],
    width: `calc(100% - ${theme.spacing(6)}px)`
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    padding: theme.spacing(2),
    transition: theme.transitions.create("width"),
    width: "100%"
  }
});

const SearchForm = ({ classes }) => {
  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [result, setResult] = useState(null);
  const ref = useRef();

  const handleChange = e => {
    setUsername(e.currentTarget.value);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const submit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setUsername(formData.get("username"));
    setAnchorEl(e.currentTarget);
  };

  return (
    <Fragment>
      <AppBar
        position="relative"
        color="inherit"
        className={classes.appBar}
        ref={ref}
      >
        <form onSubmit={submit}>
          <Toolbar className={classes.toolBar}>
            <div className={classes.search}>
              <InputBase
                placeholder="Search"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                name="username"
                inputProps={{ "aria-label": "message" }}
              />
            </div>
            <IconButton type="submit" edge="end" aria-label="search">
              <SearchIcon />
            </IconButton>
          </Toolbar>
        </form>
      </AppBar>
      <SearchResultList username={username} />
    </Fragment>
  );
};

export default withStyles(styles)(SearchForm);
