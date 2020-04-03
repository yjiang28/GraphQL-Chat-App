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
	withStyles,
} from "@material-ui/core";

import { processUsername } from "../../../scripts/utils";
import { ACTIVE_CHANNEL_QUERY } from "../../../gqls/queries/channelQueries";

const styles = (theme) => ({
	listItem: {
		borderRadius: theme.shape.borderRadius,
	},
	inline: {
		display: "inline",
	},
	username: {
		textTransform: "none",
		textOverflow: "ellipsis",
	},
});

const Channel = ({ classes, me, channel, active }) => {
	const client = useApolloClient();
	const { id, messages, users } = channel;
	const user = users.length === 0 ? me : users[0];
	const { username } = user;

	const handleClick = () => {
		Router.push({
			pathname: "/chatroom",
			query: { channelId: id },
		});
	};

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
					secondary={messages[messages.length - 1].content}
					classes={{ root: classes.username }}
				/>
			</ListItem>
		</Fragment>
	);
};

Channel.propTypes = {
	me: PropTypes.object.isRequired,
	channel: PropTypes.object.isRequired,
	active: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Channel);
