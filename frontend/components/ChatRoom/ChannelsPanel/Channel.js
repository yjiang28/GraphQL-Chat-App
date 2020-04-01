import { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import Router from "next/router";
import {
	ListItem,
	ListItemAvatar,
	Avatar,
	Button,
	ListItemText,
	IconButton,
	ListItemSecondaryAction,
	Menu,
	MenuItem,
	withStyles
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { processUsername } from "../../../scripts/utils";
import {
	LATEST_CHANNEL_MESSAGE_QUERY,
	ACTIVE_CHANNEL_QUERY
} from "../../../gqls/queries/channelQueries";

const styles = theme => ({
	listItem: {
		borderRadius: theme.shape.borderRadius
	},
	inline: {
		display: "inline"
	},
	username: {
		textTransform: "none",
		textOverflow: "ellipsis"
	}
});

const Channel = ({ classes, me, user, channel, active }) => {
	const client = useApolloClient();
	const [anchorEl, setAnchorEl] = useState(null);

	const { username } = user;
	const { id: channelId } = channel;

	const { data, loading } = useQuery(LATEST_CHANNEL_MESSAGE_QUERY, {
		variables: { channelId },
		onError: e => {
			console.log("Channel: LATEST_CHANNEL_MESSAGE_QUERY: ", e);
		}
	});

	const { refetch } = useQuery(ACTIVE_CHANNEL_QUERY, {
		onError: e => {
			console.log("MessagesPanel: ACTIVE_CHANNEL_QUERY:", e);
		}
	});

	const handleClick = () => {
		Router.push({
			pathname: "/chatroom",
			query: { channelId }
		});
		client.writeData({ data: { activeChannel: channel } });
		if (refetch) refetch();
	};

	const deleteChannel = () => {};

	return (
		<Fragment>
			<ListItem
				component={Button}
				alignItems="center"
				classes={{ root: classes.listItem }}
				onClick={handleClick}
				selected={active}
			>
				<ListItemAvatar>
					<Avatar
						alt={
							username == me.username
								? "Just You"
								: processUsername(username)
						}
						src={user.avatar}
					/>
				</ListItemAvatar>
				<ListItemText
					primary={
						username == me.username
							? "Just You"
							: processUsername(username)
					}
					secondary={data ? data.latestChannelMessage.content : ""}
					classes={{ root: classes.username }}
				/>
				{/*<ListItemSecondaryAction>
					<IconButton
						edge="end"
						aria-label="delete"
						onClick={e => {
							setAnchorEl(e.currentTarget);
						}}
					>
						<MoreHorizIcon />
					</IconButton>
				</ListItemSecondaryAction>**/}
			</ListItem>
			<Menu
				anchorEl={anchorEl}
				getContentAnchorEl={null}
				anchorOrigin={{
					vertical: "center",
					horizontal: "right"
				}}
				keepMounted
				transformOrigin={{
					vertical: "center",
					horizontal: "left"
				}}
				open={Boolean(anchorEl)}
				onClose={() => {
					setAnchorEl(null);
				}}
			>
				<MenuItem onClick={deleteChannel}>Delete</MenuItem>
			</Menu>
		</Fragment>
	);
};

Channel.propTypes = {
	me: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
	channel: PropTypes.object.isRequired,
	active: PropTypes.bool.isRequired
};

export default withStyles(styles)(Channel);
