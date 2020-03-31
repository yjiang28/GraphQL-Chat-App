import { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery } from "@apollo/react-hooks";
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

const styles = theme => ({
	listItem: {
		borderRadius: theme.shape.borderRadius
	},
	inline: {
		display: "inline"
	}
});

const Channel = ({ classes, me, user, channel, active }) => {
	const { username } = user;
	const { id: channelId } = channel;

	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = () => {
		Router.push({
			pathname: "/chatroom",
			query: { channelId }
		});
	};

	const deleteContact = () => {};

	return (
		<Fragment>
			<ListItem
				component={Button}
				alignItems="flex-start"
				classes={{ root: classes.listItem }}
				onClick={handleClick}
				selected={active}
			>
				<ListItemAvatar>
					<Avatar alt={username} src="/static/images/avatar/1.jpg" />
				</ListItemAvatar>
				<ListItemText
					primary={username == me.username ? "Just You" : username}
					secondary={"Let's chat!"}
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
