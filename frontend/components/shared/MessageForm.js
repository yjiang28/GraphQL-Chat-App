import { useMutation, useQuery } from "@apollo/react-hooks";
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
    top: "auto",
    bottom: 0,
    width: "100%",
    margin: 0
  },
  message: {
    position: "relative",
    borderRadius: theme.shape.borderRadius * 3,
    backgroundColor: theme.palette.grey[200],
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    },
    flexGrow: 1
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%"
  }
});

const MessageInputField = ({ classes, channelId }) => {
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
    <AppBar position="absolute" color="inherit" className={classes.appBar}>
      <form onSubmit={sendMessage}>
        <Toolbar>
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

export default withStyles(styles)(MessageInputField);
