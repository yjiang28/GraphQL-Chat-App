import { useState, forwardRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import {
	MenuItem,
	Button,
	Grid,
	Typography,
	withStyles
} from "@material-ui/core";
import { NOTIFICATIONS_QUERY } from "../../gqls/queries/notificationQueries";
import { CHANNEL_QUERY } from "../../gqls/queries/channelQueries";
import { ACCEPT_FRIEND_REQUEST_MUTATION } from "../../gqls/mutations/notificationMutations";

const styles = theme => ({
	buttons: {
		marginLeft: theme.spacing(2)
	},
	buttonRoot: {
		marginRight: theme.spacing(1)
	},
	buttonOutlined: {
		fontSize: 12
	}
});

const Notification = forwardRef(({ classes, notification }, ref) => {
	const { id, type, content } = notification;

	const [AcceptFriendRequest, _] = useMutation(
		ACCEPT_FRIEND_REQUEST_MUTATION,
		{
			refetchQueries: [
				{
					query: NOTIFICATIONS_QUERY
				},
				{
					query: CHANNEL_QUERY
				}
			]
		}
	);

	const acceptFriendRequest = () => {
		try {
			AcceptFriendRequest({ variables: { id } });
		} catch (e) {
			console.log("Notification", e);
		}
	};

	return (
		<MenuItem>
			<Grid container justify="space-between" alignItems="center">
				<Grid item>
					<Typography>{content}</Typography>
				</Grid>
				{type === "FriendRequest" && (
					<Grid item classes={{ root: classes.buttons }}>
						<Button
							size="small"
							variant="outlined"
							color="inherit"
							classes={{
								root: classes.buttonRoot,
								outlined: classes.buttonOutlined
							}}
						>
							Ignore
						</Button>
						<Button
							size="small"
							variant="outlined"
							color="inherit"
							classes={{
								outlined: classes.buttonOutlined
							}}
							onClick={acceptFriendRequest}
						>
							Accept
						</Button>
					</Grid>
				)}
			</Grid>
		</MenuItem>
	);
});

Notification.propTypes = {
	notification: PropTypes.object.isRequired
};

export default withStyles(styles)(Notification);
