import { useState, useEffect, forwardRef } from "react";
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
	withStyles
} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { SEND_FRIEND_REQUEST_MUTATION } from "../../../gqls/mutations/notificationMutations";
import { NOTIFICATIONS_QUERY } from "../../../gqls/queries/notificationQueries";
import { processUsername } from "../../../scripts/utils";

const styles = theme => ({
	small: {
		width: theme.spacing(4),
		height: theme.spacing(4)
	}
});

const SearchResult = forwardRef(({ classes, user, me }, ref) => {
	const { username, avatar } = user;

	const [SendFriendRequest, _] = useMutation(SEND_FRIEND_REQUEST_MUTATION, {
		refetchQueries: [
			{
				query: NOTIFICATIONS_QUERY
			}
		]
	});

	const sendFriendRequest = async () => {
		const data = await SendFriendRequest({ variables: { username } });
	};

	return (
		<ListItem button>
			<ListItemAvatar>
				<Avatar alt={username} src={avatar} className={classes.small} />
			</ListItemAvatar>
			<ListItemText primary={processUsername(username)} />
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
	);
});

SearchResult.propTypes = {
	me: PropTypes.object.isRequired,
	user: PropTypes.string.isRequired
};

export default withStyles(styles)(SearchResult);
