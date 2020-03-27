import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import {
	MenuItem,
	Button,
	Grid,
	Typography,
	withStyles
} from "@material-ui/core";

const styles = theme => ({
	button: {
		marginRight: theme.spacing(0)
	}
});

const SearchResult = ({ classes, email }) => {
	return (
		<MenuItem key={notification}>
			<Grid container justify="space-between" alignItems="center">
				<Grid item>
					<Typography>{email}</Typography>
				</Grid>
				<Grid item>
					<Button color="primary" variant="outlined">
						Add Friend
					</Button>
				</Grid>
			</Grid>
		</MenuItem>
	);
};

SearchResult.propTypes = {
	email: PropTypes.string.isRequired
};

export default withStyles(styles)(SearchResult);
