import { useMutation, useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import { withStyles, Avatar, Grid, Paper, Typography } from "@material-ui/core";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import SendIcon from "@material-ui/icons/Send";

const styles = theme => ({
  message: {
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 2),
    display: "inline-block",
    maxWidth: 500,
    height: "auto",
    overflow: "auto",
    clear: "both"
  }
});

const admin = "administrator";

const Message = ({ classes, message, me }) => {
  const { username } = me;

  const sender =
    message.sender.username === admin
      ? admin
      : message.sender.username === username
      ? username
      : message.sender.username;

  return (
    <Grid item>
      <Grid
        container
        alignItems="flex-start"
        justify={
          sender === admin
            ? "center"
            : sender === username
            ? "flex-end"
            : "flex-start"
        }
      >
        <Grid item>
          <div className={sender === admin ? "" : classes.message}>
            <Typography display="inline">{message.content}</Typography>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
};

Message.propTypes = {
  message: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired
};

export default withStyles(styles)(Message);
