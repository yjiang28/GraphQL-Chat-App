import { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import {
	Paper,
	Avatar,
	IconButton,
	Grid,
	Typography,
	List,
	Menu,
	MenuItem,
	withStyles,
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import Message from "./Message";
import MessageForm from "./MessageForm";
import { ACTIVE_CHANNEL_QUERY } from "../../../gqls/queries/channelQueries";
import { processUsername } from "../../../scripts/utils";

const styles = (theme) => ({
	container: {
		position: "relative",
		height: theme.navHeight,
		padding: theme.spacing(1, 2),
		borderLeft: "none",
		borderRight: "none",
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
	},
});

const MessageBanner = ({ classes, me, channel }) => {
	const [recipient, setRecipient] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	useEffect(() => {
		if (channel) {
			const { users } = channel;
			if (users.length == 0) setRecipient(me);
			else setRecipient(users[0]);
		}
	}, [channel]);

	return (
		<Paper classes={{ root: classes.container }} square variant="outlined">
			<Grid
				container
				spacing={2}
				justify="space-between"
				alignItems="center"
			>
				<Grid item>
					<Grid
						container
						spacing={2}
						justify="flex-start"
						alignItems="center"
					>
						<Grid item>
							<IconButton>
								<Avatar
									alt={
										recipient
											? processUsername(
													recipient.username
											  )
											: ""
									}
									src={recipient ? recipient.avatar : ""}
								/>
							</IconButton>
						</Grid>
						<Grid item>
							<Typography>
								{recipient
									? processUsername(recipient.username)
									: ""}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
				<Grid item>
					<IconButton
						edge="end"
						aria-label="delete"
						onClick={(e) => {
							setAnchorEl(e.currentTarget);
						}}
					>
						<MoreHorizIcon />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						getContentAnchorEl={null}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "right",
						}}
						keepMounted
						transformOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						open={Boolean(anchorEl)}
						onClose={() => {
							setAnchorEl(null);
						}}
					>
						<MenuItem>Delete</MenuItem>
					</Menu>
				</Grid>
			</Grid>
		</Paper>
	);
};

MessageBanner.propTypes = {
	me: PropTypes.object.isRequired,
	channel: PropTypes.object,
};

export default withStyles(styles)(MessageBanner);
