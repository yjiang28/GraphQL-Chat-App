import { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery, useApolloClient } from "@apollo/react-hooks";
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

const styles = theme => ({
	listItem: {
		borderRadius: theme.shape.borderRadius
	},
	inline: {
		display: "inline"
	},
	username: {
		textTransform: "none"
	}
});

const Channel = ({ classes, me, user, channel, active }) => {
	const client = useApolloClient();
	const { username } = user;
	const { id: channelId } = channel;

	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = () => {
		Router.push({
			pathname: "/chatroom",
			query: { channelId }
		});
		client.writeData({ data: { activeChannel: channel } });
	};

	const deleteContact = () => {};

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
						src="/static/images/avatar/1.jpg"
					/>
				</ListItemAvatar>
				<ListItemText
					primary={
						username == me.username
							? "Just You"
							: processUsername(username)
					}
					classes={{ root: classes.username }}
					disableTypography
				/>
				<ListItemSecondaryAction>
					<IconButton
						edge="end"
						aria-label="delete"
						onClick={e => {
							setAnchorEl(e.currentTarget);
						}}
					>
						<MoreHorizIcon />
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "center",
					horizontal: "right"
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
				open={Boolean(anchorEl)}
				onClose={() => {
					setAnchorEl(null);
				}}
			>
				<MenuItem onClick={deleteContact}>Delete</MenuItem>
			</Menu>
		</Fragment>
	);
};

Channel.propTypes = {
	user: PropTypes.object.isRequired,
	channel: PropTypes.object.isRequired
};

export default withStyles(styles)(Channel);
