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
import { SEND_FRIEND_REQUEST_MUTATION } from "../../gqls/mutations/notificationMutations";
import { NOTIFICATIONS_QUERY } from "../../gqls/queries/notificationQueries";
const styles = theme => ({});

const SearchResult = forwardRef(({ classes, username }, ref) => {
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
		<ListItem>
			<ListItemAvatar>
				<Avatar alt={username} src="/static/images/avatar/1.jpg" />
			</ListItemAvatar>
			<ListItemText primary={username} />
			<ListItemSecondaryAction>
				<IconButton
					edge="end"
					aria-label="add"
					onClick={sendFriendRequest}
				>
					<AddBoxIcon />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
});

SearchResult.propTypes = {
	username: PropTypes.string.isRequired
};

export default withStyles(styles)(SearchResult);
