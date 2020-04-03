import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useMutation, useQuery, useApolloClient } from "@apollo/react-hooks";
import {
	Paper,
	Typography,
	List,
	ListItem,
	withStyles,
} from "@material-ui/core";
import Channel from "./Channel";
import ChannelBanner from "./ChannelBanner";
import SearchForm from "./SearchForm";
import { DualBallLoader } from "../../shared/loaders";

const styles = (theme) => ({
	paper: {
		position: "relative",
		height: "100%",
		maxHeight: `calc(100vh - ${theme.navHeight}px)`,
		overflow: "hidden",
		padding: theme.spacing(0, 2),
	},
	channelsPaper: {
		height: `calc(100% - 2 * ${theme.navHeight}px)`,
		maxHeight: `calc(100% - 2 * ${theme.navHeight}px)`,
		overflowY: "auto",
		overflowX: "hidden",
	},
});

const ChannelPanel = ({ classes, me, query, loading, error, data }) => {
	const channelItems = () => {
		if (loading)
			return (
				<ListItem>
					<DualBallLoader aria-label={"Loading channels"} />
				</ListItem>
			);
		if (data && data.channels) {
			return data.channels.map((channel, idx) => (
				<Channel
					me={me}
					active={
						query.channelId
							? channel.id === query.channelId
							: idx === 0
					}
					channel={channel}
					key={channel.id}
				/>
			));
		}
		if (error) return <ListItem>Error: loading channels</ListItem>;
	};

	return (
		<Paper classes={{ root: classes.paper }} square>
			<ChannelBanner me={me} />
			<SearchForm me={me} />
			<Paper
				classes={{ root: classes.channelsPaper }}
				square
				elevation={0}
			>
				<List classes={{ root: classes.list }}>{channelItems()}</List>
			</Paper>
		</Paper>
	);
};

ChannelPanel.propTypes = {
	me: PropTypes.object.isRequired,
	data: PropTypes.object,
	loading: PropTypes.bool.isRequired,
	error: PropTypes.bool.isRequired,
};

export default withStyles(styles)(ChannelPanel);
