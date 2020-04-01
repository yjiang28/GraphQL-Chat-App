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
  error_message = false
}) => {
  return (
    <Grid item xs={12}>
      {display_error && (
        <Typography classes={{ root: classes.error_message }}>
          {error_message ? `${error_message}` : ""}
        </Typography>
      )}
      <TextField
        required={required}
        disabled={disabled}
        autoComplete="off"
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
  type: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  error_message: PropTypes.bool
};

export default withStyles(styles)(TextInputField);
