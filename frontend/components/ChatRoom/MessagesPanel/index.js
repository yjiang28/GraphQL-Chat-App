import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import { Paper, Grid, Typography, List, withStyles } from "@material-ui/core";
import Message from "./Message";
import MessageBanner from "./MessageBanner";
import MessageForm from "./MessageForm";
import { DualBallLoader } from "../../shared/loaders";
import { CHANNEL_MESSAGES_QUERY } from "../../../gqls/queries/channelQueries";
import { MESSAGE_SUBSCRIPTION } from "../../../gqls/subscriptions/channelSubscriptions";

const styles = theme => ({
	container: {
		position: "relative",
		height: "100%",
		maxHeight: `calc(100vh - ${theme.navHeight}px)`,
		overflow: "hidden"
	},
	messagesPaper: {
		padding: theme.spacing(2),
		height: `calc(100% - 2 * ${theme.navHeight}px)`,
		maxHeight: `calc(100% - 2 * ${theme.navHeight}px)`,
		overflowY: "auto",
		overflowX: "hidden"
	}
});

const scrollToBottom = messagesEndRef => {
	messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
};

const MessagesPanel = ({ classes, me, channelId }) => {
	const { data, loading, refetch } = useQuery(CHANNEL_MESSAGES_QUERY, {
		variables: { channelId }
	});
	const messagesEndRef = useRef();

	const { error } = useSubscription(MESSAGE_SUBSCRIPTION, {
		variables: { userId: me.id },
		onSubscriptionData: ({ subscriptionData }) => {
			const { message } = subscriptionData.data;
			const { id, content, channel, sender } = message;
			if (channel.id == channelId && refetch) {
				refetch();
			}
		}
	});
	if (error) console.log(error);

	useEffect(() => {
		if (channelId && refetch) refetch();
	}, [channelId]);

	useEffect(() => {
		scrollToBottom(messagesEndRef);
	}, [data]);

	const messgageItems = () => {
		if (loading)
			return (
				<Grid item>
					<DualBallLoader aria-label="Loading messages" />
				</Grid>
			);
		if (data && data.channelMessages) {
			const messages = data.channelMessages;
			return messages.map(msg => (
				<Message message={msg} me={me} key={msg.id} />
			));
		}
		return <div>Error...</div>;
	};

	return (
		<Paper classes={{ root: classes.container }} square>
			<MessageBanner me={me} />
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
			<MessageForm channelId={channelId} />
		</Paper>
	);
};

MessagesPanel.propTypes = {
	me: PropTypes.object.isRequired,
	channelId: PropTypes.string.isRequired
};

export default withStyles(styles)(MessagesPanel);
