import { useState } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Paper, Typography, List, withStyles } from "@material-ui/core";
import { Channel, SearchForm } from "./";
import { CHANNEL_QUERY } from "../../gqls/queries/channelQueries";

const styles = theme => ({
	paper: {
		position: "relative",
		height: "100%",
		maxHeight: "100%",
		overflowY: "auto",
		overflowX: "hidden",
		padding: theme.spacing(1, 2)
	},
	root: {
		width: "100%",
		backgroundColor: theme.palette.background.paper
	}
});

const ChannelPanel = ({ classes }) => {
	const { data, loading } = useQuery(CHANNEL_QUERY);

	const channelItems = () => {
		if (loading) return null;
		if (data && data.me) {
			const { channels, username } = data.me;
			if (!channels || channels.length == 0)
				return (
					<Typography>You don't have anyone to chat with</Typography>
				);

			return channels.map(channel => {
				const user =
					channel.users[0].username != username
						? channel.users[0]
						: channel.users[1];
				return (
					<Channel user={user} channel={channel} key={channel.id} />
				);
			});
		}
	};

	return (
		<Paper className={classes.paper} square>
			<SearchForm />
			<List className={classes.root}>{channelItems()}</List>
		</Paper>
	);
};

export default withStyles(styles)(ChannelPanel);
