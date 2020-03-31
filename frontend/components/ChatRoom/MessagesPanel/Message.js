import { useMutation, useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import { withStyles, Grid, Paper, Typography } from "@material-ui/core";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import SendIcon from "@material-ui/icons/Send";

const styles = theme => ({
  paper: {
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

const Message = ({ classes, message, me }) => {
  const { id } = me;
  const fromMe = message.sender.id == id;

  return (
    <Grid item>
      <Grid
        container
        alignItems="flex-start"
        justify={fromMe ? "flex-end" : "flex-start"}
      >
        <Grid item>
          <div className={classes.paper}>
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
