import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
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
	CHANNELS_QUERY,
	CHANNELS_QUERY_FROM_CACHE,
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

const MessagesPanel = ({ classes, me, query, loading, error, data }) => {
	const client = useApolloClient();
	const messagesEndRef = useRef();
	const [channel, setChannel] = useState(null);

	const { refetch: channelsRefetch } = useQuery(CHANNELS_QUERY, {
		variables: { userId: me.id },
		onError: (e) => {
			console.log("MessagesPanel: CHANNELS_QUERY:", e);
		},
	});

	useSubscription(MESSAGE_SUBSCRIPTION, {
		variables: { userId: me.id },
		onSubscriptionData: ({ subscriptionData }) => {
			if (channel) {
				const { message } = subscriptionData.data;

				if (
					channel.id === message.channel.id &&
					me.id !== message.sender.id
				) {
					const data = client.readQuery({
						query: CHANNELS_QUERY_FROM_CACHE,
					});
					const channels = [...data.channels];
					channels
						.filter((c) => c.id === channel.id)[0]
						.messages.push({ ...message });

					client.writeQuery({
						query: CHANNELS_QUERY_FROM_CACHE,
						data: {
							...data,
							channels: [...channels],
						},
					});
					scrollToBottom(messagesEndRef);
				}
			}
		},
		onError: (e) => {
			console.log("MessagesPanel: MESSAGE_SUBSCRIPTION:", e);
		},
	});

	useEffect(() => {
		if (data && data.channels) {
			if (query.channelId)
				setChannel(
					data.channels.filter(
						(channel) => channel.id === query.channelId
					)[0]
				);
			else setChannel(data.channels[0]);
		}
	}, [query, data]);

	useEffect(() => {
		if (channel) scrollToBottom(messagesEndRef);
	}, [channel]);

	const messgageItems = () => {
		if (loading)
			return (
				<Grid item>
					<DualBallLoader aria-label={"Loading channels"} />
				</Grid>
			);
		if (data && data.channels) {
			const channel = data.channels.filter(
				(channel) => channel.id === query.channelId
			)[0];
			const { messages, users } = channel;
			const user =
				users.length === 0
					? me
					: users[0].username === me.username
					? users[1]
					: users[0];
			return messages.map((msg, idx) => (
				<Message message={msg} me={me} key={idx} />
			));
		}
		if (error) return <Grid item>Error: loading messages</Grid>;
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
			<MessageForm me={me} channel={channel} />
		</Paper>
	);
};

MessagesPanel.propTypes = {
	me: PropTypes.object.isRequired,
	query: PropTypes.object.isRequired,
	data: PropTypes.object,
	loading: PropTypes.bool,
	error: PropTypes.bool,
};

export default withStyles(styles)(MessagesPanel);
