import { useState, Fragment } from "react";
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
		borderRadius: 2 * theme.shape.borderRadius
	},
	inline: {
		display: "inline"
	}
});

const ChatHead = ({ classes, user, channel }) => {
	const { username } = user;
	const { id: channelId } = channel;

	const [anchorEl, setAnchorEl] = useState(null);

	const deleteContact = () => {};

	return (
		<Fragment>
			<ListItem
				component={Button}
				alignItems="flex-start"
				className={classes.listItem}
				onClick={() => {
					Router.push({
						pathname: "/chatroom",
						query: { channelId }
					});
				}}
			>
				<ListItemAvatar>
					<Avatar alt={username} src="/static/images/avatar/1.jpg" />
				</ListItemAvatar>
				<ListItemText primary={username} secondary={"Let's chat!"} />
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
					vertical: "top",
					horizontal: "right"
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				open={Boolean(anchorEl)}
				onClose={() => {
					setAnchorEl(null);
				}}
			>
				<MenuItem onClick={deleteContact}>Delete this contact</MenuItem>
			</Menu>
		</Fragment>
	);
};

ChatHead.propTypes = {
	user: PropTypes.object.isRequired,
	channel: PropTypes.object.isRequired
};

export default withStyles(styles)(ChatHead);
