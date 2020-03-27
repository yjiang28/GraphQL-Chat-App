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
import { ChatHead, Message, MessageBar } from "./shared";
import {
	CHANNEL_QUERY,
	CHANNEL_MESSAGES_QUERY,
	LATEST_ACTIVE_CHANNEL_QUERY
} from "../queries/channel";
import { MESSAGE_SUBSCRIPTION } from "../subscriptions/channel";

const styles = theme => ({
	container: {
		margin: 0,
		height: `calc(100vh - 64px - ${theme.spacing(0.25)}px)`,
		padding: 0
	},
	padding: { padding: theme.spacing(0, 2) },
	paper: {
		height: "100%",
		maxHeight: "100%",
		overflowY: "auto",
		overflowX: "hidden",
		position: "relative"
	},
	messagePaper: {
		padding: theme.spacing(1, 2),
		height: `calc(100% - 64px)`,
		width: `calc(100% - 2*${theme.spacing(2)})`,
		maxWidth: `calc(100% - 2*${theme.spacing(2)})`,
		maxHeight: `calc(100% - 64px)`,
		overflowY: "auto",
		overflowX: "hidden",
		top: "0",
		left: 0,
		right: 0,
		bottom: "64",
		position: "absolute"
	},
	root: {
		width: "100%",
		backgroundColor: theme.palette.background.paper
	}
});

const ChatRoom = ({ classes, query, me }) => {
	const { channelId } = query;
	const [messages, setMessages] = useState([]);

	const {
		data: messagesQueryData,
		loading: messagesQueryLoading,
		refetch
	} = useQuery(CHANNEL_MESSAGES_QUERY, {
		variables: { channelId }
	});

	const { data: channelQueryData, loading: channelQueryLoading } = useQuery(
		CHANNEL_QUERY
	);

	const { data: messageSubscriptionData, loading } = useSubscription(
		MESSAGE_SUBSCRIPTION,
		{
			variables: { userId: me.id },
			onSubscriptionData: ({ subscriptionData }) => {
				const { message } = subscriptionData.data;
				const { id, content, channel, sender } = message;
				if (channel.id == channelId && refetch) {
					refetch();
				}
			}
		}
	);

	const messgageItems = () => {
		if (messagesQueryLoading) return null;
		if (messagesQueryData) {
			const messages = messagesQueryData.channelMessages;
			return messages.map(msg => (
				<Message message={msg} me={me} key={msg.id} />
			));
		}
	};

	const channelItems = () => {
		if (channelQueryLoading) return null;
		if (channelQueryData && channelQueryData.me) {
			const { channels } = channelQueryData.me;
			if (!channels || channels.length == 0)
				return (
					<Typography>You don't have anyone to chat with</Typography>
				);
			const { username } = channelQueryData.me;
			return channels.map(channel => {
				const user =
					channel.users[0].username != username
						? channel.users[0]
						: channel.users[1];
				return (
					<ChatHead user={user} channel={channel} key={channel.id} />
				);
			});
		}
	};

	return (
		<Grid container spacing={0} className={classes.container}>
			<Grid item xs={4}>
				<Paper className={`${classes.paper} ${classes.padding}`} square>
					<List className={classes.root}>{channelItems()}</List>
				</Paper>
			</Grid>
			<Grid item xs={8}>
				<Paper className={classes.paper} square>
					<Paper className={classes.messagePaper} square>
						<Grid container direction="column" spacing={2}>
							{messgageItems()}
						</Grid>
					</Paper>
					<MessageBar channelId={channelId} />
				</Paper>
			</Grid>
		</Grid>
	);
};

ChatRoom.propTypes = {
	query: PropTypes.string.isRequired,
	me: PropTypes.object.isRequired
};

export default withStyles(styles)(ChatRoom);
