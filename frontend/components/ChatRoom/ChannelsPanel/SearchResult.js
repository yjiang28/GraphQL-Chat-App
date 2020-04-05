import { Fragment, useState, useEffect, forwardRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import {
	Avatar,
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Typography,
	Snackbar,
	withStyles,
} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { SEND_FRIEND_REQUEST_MUTATION } from "../../../gqls/mutations/notificationMutations";
import { NOTIFICATIONS_QUERY } from "../../../gqls/queries/notificationQueries";
import { processUsername } from "../../../scripts/utils";

const styles = (theme) => ({
	small: {
		width: theme.spacing(4),
		height: theme.spacing(4),
	},
});

const SearchResult = forwardRef(({ classes, user, me }, ref) => {
	const { username, avatar } = user;

	const [SendFriendRequest, _] = useMutation(SEND_FRIEND_REQUEST_MUTATION, {
		refetchQueries: [{ query: NOTIFICATIONS_QUERY }],
		onError: (e) => {
			console.log("SearchResult: SEND_FRIEND_REQUEST_MUTATION", e);
		},
	});

	const sendFriendRequest = () => {
		seSnackbar(true);
		SendFriendRequest({ variables: { username } });
	};

	const [snackbar, seSnackbar] = React.useState(false);

	const handleClose = () => {
		seSnackbar(false);
	};

	const displayedUsername = processUsername(username);

	return (
		<Fragment>
			<ListItem button>
				<ListItemAvatar>
					<Avatar
						alt={username}
						src={avatar}
						className={classes.small}
					/>
				</ListItemAvatar>
				<ListItemText primary={displayedUsername} />
				{username !== me.username && (
					<ListItemSecondaryAction>
						<IconButton
							edge="end"
							aria-label="add"
							onClick={sendFriendRequest}
						>
							<AddBoxIcon />
						</IconButton>
					</ListItemSecondaryAction>
				)}
			</ListItem>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={snackbar}
				onClose={handleClose}
				message={`Your friend request has been sent to ${displayedUsername}`}
			/>
		</Fragment>
	);
});

SearchResult.propTypes = {
	me: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchResult);
