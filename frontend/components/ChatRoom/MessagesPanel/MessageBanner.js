import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import {
	Paper,
	Avatar,
	IconButton,
	Grid,
	Typography,
	List,
	withStyles
} from "@material-ui/core";
import Message from "./Message";
import MessageForm from "./MessageForm";
import { ACTIVE_CHANNEL_QUERY } from "../../../gqls/queries/channelQueries";
import { processUsername } from "../../../scripts/utils";

const styles = theme => ({
	container: {
		position: "relative",
		height: theme.navHeight,
		padding: theme.spacing(1, 2),
		borderLeft: "none",
		borderRight: "none",
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center"
	}
});

const MessageBanner = ({ classes, me }) => {
	const [recipient, setRecipient] = useState("");
	const { data } = useQuery(ACTIVE_CHANNEL_QUERY, {
		onError: e => {
			console.log("MessageBanner: ACTIVE_CHANNEL_QUERY:", e);
		}
	});

	useEffect(() => {
		if (data && data.activeChannel) {
			const { users } = data.activeChannel;
			if (users.length == 1) setRecipient(processUsername(me.username));
			else {
				setRecipient(
					processUsername(
						users[0].username === me.username
							? users[1].username
							: users[0].username
					)
				);
			}
		}
	}, [data]);

	return recipient ? (
		<Paper classes={{ root: classes.container }} square variant="outlined">
			<Grid
				container
				spacing={2}
				justify="flex-start"
				alignItems="center"
			>
				<Grid item>
					<IconButton>
						<Avatar alt={recipient} src="" />
					</IconButton>
				</Grid>
				<Grid item>
					<Typography>{recipient}</Typography>
				</Grid>
			</Grid>
		</Paper>
	) : null;
};

MessageBanner.propTypes = {
	me: PropTypes.object,
	channelId: PropTypes.string
};

export default withStyles(styles)(MessageBanner);
