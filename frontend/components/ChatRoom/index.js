import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import {
	useMutation,
	useSubscription,
	useQuery,
	useApolloClient
} from "@apollo/react-hooks";
import {
	Container,
	Paper,
	Grid,
	Typography,
	List,
	withStyles
} from "@material-ui/core";
import ChannelsPanel from "./ChannelsPanel";
import MessagesPanel from "./MessagesPanel";
import {
	CHANNEL_MESSAGES_QUERY,
	LATEST_ACTIVE_CHANNEL_QUERY,
	ACTIVE_CHANNEL_QUERY
} from "../../gqls/queries/channelQueries";

const styles = theme => ({
	container: {
		height: `calc(100vh - ${theme.navHeight}px - 2px)`,
		maxHeight: `calc(100vh - ${theme.navHeight}px - 2px)`
	}
});

const ChatRoom = ({ classes, query, me }) => {
	const client = useApolloClient();
	const [messages, setMessages] = useState([]);

	useQuery(LATEST_ACTIVE_CHANNEL_QUERY, {
		onCompleted: data => {
			if (data && data.latestActiveChannel) {
				client.writeData({
					data: { activeChannel: data.latestActiveChannel }
				});
				Router.push({
					pathname: "/chatroom",
					query: {
						channelId: data.latestActiveChannel.id
					}
				});
			}
		},
		onError: e => {
			console.log("ChatRoom: LATEST_ACTIVE_CHANNEL_QUERY:", e);
		}
	});

	const { data } = useQuery(ACTIVE_CHANNEL_QUERY, {
		onError: e => {
			console.log("ChatRoom: ACTIVE_CHANNEL_QUERY:", e);
		}
	});

	return data && data.activeChannel ? (
		<Grid container spacing={0} classes={{ root: classes.container }}>
			<Grid item sm={4} md={3}>
				<ChannelsPanel me={me} channelId={data.activeChannel.id} />
			</Grid>
			<Grid item sm={8} md={9}>
				<MessagesPanel me={me} channel={data.activeChannel} />
			</Grid>
		</Grid>
	) : null;
};

ChatRoom.propTypes = {
	query: PropTypes.object.isRequired,
	me: PropTypes.object.isRequired
};

export default withStyles(styles)(ChatRoom);
