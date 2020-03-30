import PropTypes from "prop-types";
import { withStyles, TextField, Grid, Typography } from "@material-ui/core";

const styles = theme => ({
  error_message: {
    margin: 0,
    padding: 0,
    color: theme.palette.secondary.main
  }
});

const TextInputField = ({
  classes,
  name,
  type,
  label,
  value,
  required = true,
  disabled = false,
  multiline = false,
  display_error = false,
  error_message
}) => {
  return (
    <Grid item xs={12}>
      {display_error &&
        (error_message ? (
          <Typography className={classes.error_message}>
            {error_message}
          </Typography>
        ) : (
          <Typography className={classes.error_message}>&nbsp;</Typography>
        ))}
      <TextField
        required={required}
        disabled={disabled}
        fullWidth
        variant="outlined"
        label={label ? label : name}
        type={type ? type : "text"}
        value={value}
        name={name}
        multiline={multiline}
      />
    </Grid>
  );
};

TextInputField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  error_message: PropTypes.string
};

export default withStyles(styles)(TextInputField);
