import { useState } from "react";
import {
	MenuItem,
	Button,
	Grid,
	Typography,
	withStyles
} from "@material-ui/core";
import PropTypes from "prop-types";

const styles = theme => ({
	button: {
		marginRight: theme.spacing(0)
	}
});

const Notification = ({ classes, notification }) => {
	return (
		<MenuItem key={notification}>
			<Grid container justify="space-between" alignItems="center">
				<Grid item>
					<Typography>{notification.content}</Typography>
				</Grid>
			</Grid>
		</MenuItem>
	);
};

Notification.propTypes = {
	notification: PropTypes.object.isRequired
};

export default withStyles(styles)(Notification);
