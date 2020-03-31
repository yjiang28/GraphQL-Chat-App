import { useMutation, useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import {
  withStyles,
  AppBar,
  Toolbar,
  InputBase,
  IconButton
} from "@material-ui/core";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import SendIcon from "@material-ui/icons/Send";
import { SEND_MESSAGE_MUTATION } from "../../gqls/mutations/channelMutations";

const styles = theme => ({
  appBar: {
    width: "100%",
    margin: 0
  },
  toolBar: {
    padding: theme.spacing(1, 4)
  },
  message: {
    position: "relative",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    },
    flexGrow: 1
  },
  inputRoot: {
    height: theme.spacing(5),
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    color: "inherit",
    backgroundColor: theme.palette.grey[300]
  },
  inputInput: {
    transition: theme.transitions.create("width"),
    width: "100%"
  }
});

const MessageForm = ({ classes, channelId }) => {
  const [SendMessage, _] = useMutation(SEND_MESSAGE_MUTATION);

  const sendMessage = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const message = formData.get("message");
    e.target.reset();
    try {
      await SendMessage({
        variables: { channelId, message }
      });
    } catch (e) {
      console.log("MessageForm", e);
    }
  };

  return (
    <AppBar
      position="relative"
      color="default"
      classes={{ root: classes.appBar }}
    >
      <form onSubmit={sendMessage}>
        <Toolbar classes={{ root: classes.toolBar }}>
          <IconButton edge="start" color="primary">
            <KeyboardIcon />
          </IconButton>
          <div className={classes.message}>
            <InputBase
              placeholder="Type a message…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              name="message"
              inputProps={{ "aria-label": "message" }}
              fullWidth
              multiline
            />
          </div>
          <IconButton type="submit" edge="end" color="primary">
            <SendIcon />
          </IconButton>
        </Toolbar>
      </form>
    </AppBar>
  );
};

MessageForm.propTypes = {
  channelId: PropTypes.string.isRequired
};

export default withStyles(styles)(MessageForm);
