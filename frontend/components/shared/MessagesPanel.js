import { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useSubscription, useQuery } from "@apollo/react-hooks";
import { Paper, Grid, Typography, List, withStyles } from "@material-ui/core";
import { Message, MessageForm } from "./";
import { CHANNEL_MESSAGES_QUERY } from "../../gqls/queries/channelQueries";
import { MESSAGE_SUBSCRIPTION } from "../../gqls/subscriptions/channelSubscriptions";

const styles = theme => ({
	container: {
		position: "relative",
		paddingTop: theme.spacing(1),
		height: "100%",
		maxHeight: "100%",
		overflowY: "auto",
		overflowX: "hidden"
	},
	messagesPaper: {
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
	}
});

const MessagesPanel = ({ classes, channelId }) => {
	const { data, loading, refetch } = useQuery(CHANNEL_MESSAGES_QUERY, {
		variables: { channelId }
	});

	const messgageItems = () => {
		if (loading) return null;
		if (data) {
			const messages = data.channelMessages;
			return messages.map(msg => (
				<Message message={msg} me={me} key={msg.id} />
			));
		}
	};

	return (
		<Paper className={classes.container} square>
			<Paper className={classes.messagesPaper} square>
				<Grid container direction="column" spacing={2}>
					{messgageItems()}
				</Grid>
			</Paper>
			<MessageForm channelId={channelId} />
		</Paper>
	);
};

export default withStyles(styles)(MessagesPanel);
