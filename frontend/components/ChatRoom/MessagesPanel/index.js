import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
	useMutation,
	useQuery,
	useSubscription,
	useApolloClient,
} from "@apollo/react-hooks";
import { Paper, Grid, Typography, List, withStyles } from "@material-ui/core";
import Message from "./Message";
import MessageBanner from "./MessageBanner";
import MessageForm from "./MessageForm";
import { DualBallLoader } from "../../shared/loaders";
import {
	CHANNEL_QUERY,
	CHANNEL_MESSAGES_QUERY,
	ACTIVE_CHANNEL_QUERY,
	LATEST_CHANNEL_MESSAGE_QUERY,
} from "../../../gqls/queries/channelQueries";
import { MESSAGE_SUBSCRIPTION } from "../../../gqls/subscriptions/channelSubscriptions";

const styles = (theme) => ({
	container: {
		position: "relative",
		height: "100%",
		maxHeight: `calc(100vh - ${theme.navHeight}px)`,
		overflow: "hidden",
	},
	messagesPaper: {
		padding: theme.spacing(2),
		height: `calc(100% - 2 * ${theme.navHeight}px)`,
		maxHeight: `calc(100% - 2 * ${theme.navHeight}px)`,
		overflowY: "auto",
		overflowX: "hidden",
	},
});

const scrollToBottom = (messagesEndRef) => {
	messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
};

const MessagesPanel = ({ classes, me, channel }) => {
	const client = useApolloClient();
	const messagesEndRef = useRef();

	const { refetch } = useQuery(ACTIVE_CHANNEL_QUERY, {
		onError: (e) => {
			console.log("MessagesPanel: ACTIVE_CHANNEL_QUERY:", e);
		},
	});

	const { refetch: channelsRefetch } = useQuery(CHANNEL_QUERY, {
		onError: (e) => {
			console.log("MessagesPanel: CHANNEL_QUERY:", e);
		},
	});

	const { refetch: latestChannelMessageRefetch } = useQuery(
		LATEST_CHANNEL_MESSAGE_QUERY,
		{
			variables: { channelId: channel.id },
			onError: (e) => {
				console.log("MessagesPanel: LATEST_CHANNEL_MESSAGE_QUERY: ", e);
			},
		}
	);

	useSubscription(MESSAGE_SUBSCRIPTION, {
		variables: { userId: me.id },
		onSubscriptionData: ({ subscriptionData }) => {
			const { message } = subscriptionData.data;

			const updatedActiveChannel = { ...channel };
			updatedActiveChannel.messages.push(message);

			client.writeData({
				data: { activeChannel: updatedActiveChannel },
			});
			if (channel.id === message.channel.id) {
				refetch();
				latestChannelMessageRefetch();
				scrollToBottom(messagesEndRef);
			} else if (channelsRefetch) channelsRefetch();
		},
		onError: (e) => {
			console.log("MessagesPanel: MESSAGE_SUBSCRIPTION:", e);
		},
	});

	useEffect(() => {
		scrollToBottom(messagesEndRef);
	}, []);

	const messgageItems = () => {
		const { messages, users } = channel;
		const user =
			users.length === 0
				? me
				: users[0].username === me.username
				? users[1]
				: users[0];
		return messages.map((msg) => (
			<Message message={msg} me={me} key={msg.id} />
		));
	};

	return (
		<Paper classes={{ root: classes.container }} square>
			<MessageBanner me={me} channel={channel} />
			<Paper
				classes={{ root: classes.messagesPaper }}
				square
				elevation={0}
			>
				<Grid container direction="column" spacing={2}>
					{messgageItems()}
					<Grid item ref={messagesEndRef} />
				</Grid>
			</Paper>
			<MessageForm channel={channel} />
		</Paper>
	);
};

MessagesPanel.propTypes = {
	me: PropTypes.object.isRequired,
	channel: PropTypes.object.isRequired,
};

export default withStyles(styles)(MessagesPanel);
