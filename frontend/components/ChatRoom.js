import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
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

const styles = theme => ({
	container: {
		height: "calc(100vh - 64px - 2px)",
		maxHeight: "calc(100vh - 64px - 2px)"
	}
});

const ChatRoom = ({ classes, query, me }) => {
	const [messages, setMessages] = useState([]);

	const { data, loading, refetch } = useQuery(LATEST_ACTIVE_CHANNEL_QUERY);

	useEffect(() => {
		if (data && data.latestActiveChannel) {
			Router.push({
				pathname: "/chatroom",
				query: {
					channelId: data.latestActiveChannel.id
				}
			});
		}
	}, [data]);

	return query && query.channelId ? (
		<Grid container spacing={0} classes={{ root: classes.container }}>
			<Grid item sm={4} md={3}>
				<ChannelsPanel me={me} channelId={query.channelId} />
			</Grid>
			<Grid item sm={8} md={9}>
				<MessagesPanel me={me} channelId={query.channelId} />
			</Grid>
		</Grid>
	) : null;
};

ChatRoom.propTypes = {
	query: PropTypes.object.isRequired,
	me: PropTypes.object.isRequired
};

export default withStyles(styles)(ChatRoom);
