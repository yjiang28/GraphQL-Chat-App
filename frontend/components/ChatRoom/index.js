import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import {
	useMutation,
	useSubscription,
	useQuery,
	useApolloClient,
} from "@apollo/react-hooks";
import {
	Container,
	Paper,
	Grid,
	Typography,
	List,
	withStyles,
} from "@material-ui/core";
import ChannelsPanel from "./ChannelsPanel";
import MessagesPanel from "./MessagesPanel";
import {
	CHANNELS_QUERY,
	CHANNELS_QUERY_FROM_CACHE,
} from "../../gqls/queries/channelQueries";

const styles = (theme) => ({
	container: {
		height: `calc(100vh - ${theme.navHeight}px - 2px)`,
		maxHeight: `calc(100vh - ${theme.navHeight}px - 2px)`,
	},
});

// Save to cache the 20 latest updated channels of user: {id users messages}
// Save to cache the active channel: {id users messages}
const ChatRoom = ({ classes, query, me }) => {
	const client = useApolloClient();

	const {
		data,
		refetch,
		loading: loadingFromCache,
		error: cacheError,
	} = useQuery(CHANNELS_QUERY_FROM_CACHE, {
		variables: { userId: me.id },
		onCompleted: (data) => {
			if (data && data.channels && !query.channelId) {
				Router.push({
					pathname: "/chatroom",
					query: {
						channelId: data.channels[0].id,
					},
				});
			}
		},
		onError: (e) => {
			console.log("ChannelPanel: CHANNELS_QUERY_FROM_CACHE", e);
		},
	});

	const { loading: loadingFromServer, error: serverError } = useQuery(
		CHANNELS_QUERY,
		{
			variables: { userId: me.id },
			onCompleted: (data) => {
				client.writeData({ data: { channels: data.me.channels } });
				refetch();
			},
			onError: (e) => {
				console.log("ChannelPanel: CHANNELS_QUERY", e);
			},
		}
	);

	return query.channelId ? (
		<Grid container spacing={0} classes={{ root: classes.container }}>
			<Grid item sm={4} md={3}>
				<ChannelsPanel
					me={me}
					query={query}
					loading={loadingFromServer || loadingFromCache === true}
					error={cacheError || serverError === true}
					data={data}
				/>
			</Grid>
			<Grid item sm={8} md={9}>
				<MessagesPanel
					me={me}
					query={query}
					loading={loadingFromServer || loadingFromCache === true}
					error={cacheError || serverError === true}
					data={data}
				/>
			</Grid>
		</Grid>
	) : null;
};

ChatRoom.propTypes = {
	query: PropTypes.object.isRequired,
	me: PropTypes.object.isRequired,
};

export default withStyles(styles)(ChatRoom);
