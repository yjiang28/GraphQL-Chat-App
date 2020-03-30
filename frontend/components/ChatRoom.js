import { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useSubscription, useQuery } from "@apollo/react-hooks";
import {
	Container,
	Paper,
	Grid,
	Typography,
	List,
	withStyles
} from "@material-ui/core";
import { ChannelsPanel, MessagesPanel } from "./shared";
import {
	CHANNEL_MESSAGES_QUERY,
	LATEST_ACTIVE_CHANNEL_QUERY
} from "../gqls/queries/channelQueries";
import { MESSAGE_SUBSCRIPTION } from "../gqls/subscriptions/channelSubscriptions";

const styles = theme => ({
	container: {
		margin: 0,
		height: `calc(100vh - 64px - ${theme.spacing(0.25)}px)`,
		padding: 0
	}
});

const ChatRoom = ({ classes, query, me }) => {
	const { channelId } = query;
	const [messages, setMessages] = useState([]);

	const { data, loading } = useSubscription(MESSAGE_SUBSCRIPTION, {
		variables: { userId: me.id },
		onSubscriptionData: ({ data }) => {
			const { message } = data.data;
			const { id, content, channel, sender } = message;
			if (channel.id == channelId && refetch) {
				refetch();
			}
		}
	});

	return (
		<Grid container spacing={0} className={classes.container}>
			<Grid item sm={4} md={3}>
				<ChannelsPanel />
			</Grid>
			<Grid item sm={8} md={9}>
				<MessagesPanel channelId={channelId} />
			</Grid>
		</Grid>
	);
};

ChatRoom.propTypes = {
	query: PropTypes.object.isRequired,
	me: PropTypes.object.isRequired
};

export default withStyles(styles)(ChatRoom);
