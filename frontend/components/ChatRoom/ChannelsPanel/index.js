import { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
	Paper,
	Typography,
	List,
	ListItem,
	withStyles
} from "@material-ui/core";
import Channel from "./Channel";
import ChannelBanner from "./ChannelBanner";
import SearchForm from "./SearchForm";
import { DualBallLoader } from "../../shared/loaders";
import { CHANNEL_QUERY } from "../../../gqls/queries/channelQueries";

const styles = theme => ({
	paper: {
		position: "relative",
		height: "100%",
		maxHeight: "100%",
		overflowY: "auto",
		overflowX: "hidden",
		padding: theme.spacing(0, 2)
	},
	list: {
		width: "100%",
		backgroundColor: theme.palette.background.paper
	}
});

const ChannelPanel = ({ classes, me, channelId }) => {
	const { data, loading, error } = useQuery(CHANNEL_QUERY, {
		onError: e => {
			console.log("ChannelPanel: CHANNEL_QUERY", e);
		}
	});

	const channelItems = () => {
		if (loading)
			return (
				<ListItem>
					<DualBallLoader aria-label={"Loading channels"} />
				</ListItem>
			);
		if (data && data.channels) {
			const { channels } = data;

			if (!channels || channels.length == 0)
				return (
					<Typography>You don't have anyone to chat with</Typography>
				);

			return channels.map(channel => {
				const { users } = channel;
				const user =
					users.length == 1
						? me
						: users[0].username == me.username
						? users[1]
						: users[0];
				return (
					<Channel
						me={me}
						user={user}
						active={channel.id === channelId}
						channel={channel}
						key={channel.id}
					/>
				);
			});
		}
		if (error) return <ListItem>Error: loading channels</ListItem>;
	};

	return (
		<Paper classes={{ root: classes.paper }} square>
			<ChannelBanner me={me} />
			<SearchForm me={me} />
			<List classes={{ root: classes.list }}>{channelItems()}</List>
		</Paper>
	);
};

ChannelPanel.propTypes = {
	me: PropTypes.object.isRequired,
	channelId: PropTypes.string.isRequired
};

export default withStyles(styles)(ChannelPanel);
