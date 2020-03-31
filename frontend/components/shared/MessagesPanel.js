import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import { Paper, Grid, Typography, List, withStyles } from "@material-ui/core";
import { Message, MessageForm } from "./";
import { CHANNEL_MESSAGES_QUERY } from "../../gqls/queries/channelQueries";
import { MESSAGE_SUBSCRIPTION } from "../../gqls/subscriptions/channelSubscriptions";

const styles = theme => ({
	container: {
		height: "100%",
		maxHeight: `calc(100vh - ${theme.spacing(8)}px)`,
		overflowY: "auto",
		overflowX: "hidden"
	},
	messagesPaper: {
		padding: theme.spacing(4),
		height: `calc(100% - ${theme.spacing(8)}px)`,
		maxHeight: `calc(100% - ${theme.spacing(8)}px)`,
		overflowY: "auto",
		overflowX: "hidden"
	}
});

const MessagesPanel = ({ classes, me, channelId }) => {
	const { data, loading, refetch } = useQuery(CHANNEL_MESSAGES_QUERY, {
		variables: { channelId }
	});

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

	const messgageItems = () => {
		if (loading) return <div>Loading...</div>;
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
			<Paper classes={{ root: classes.messagesPaper }} square>
				<Grid container direction="column" spacing={2}>
					{messgageItems()}
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
