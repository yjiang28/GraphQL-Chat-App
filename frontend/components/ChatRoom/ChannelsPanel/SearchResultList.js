import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import { List, ListItem, ListItemText, withStyles } from "@material-ui/core";
import SearchResult from "./SearchResult";
import { DualBallLoader } from "../../shared/loaders";
import {
	USER_QUERY,
	SEARCH_USER_QUERY,
} from "../../../gqls/queries/userQueries";

const styles = (theme) => ({
	root: {
		position: "absolute",
		top: theme.spacing(15),
		bottom: 0,
		left: 0,
		right: 0,
		width: "calc(100% - 2px)",
		zIndex: 1000,
		padding: theme.spacing(1, 2),
		background: "white",
	},
});

const SearchResultList = ({ classes, username, me }) => {
	const { data, loading, refetch, error } = useQuery(SEARCH_USER_QUERY, {
		variables: { username },
		onError: (e) => {
			console.log("SearchResultList: SEARCH_USER_QUERY:", e);
		},
	});

	useEffect(() => {
		if (username && refetch) refetch();
	}, [username]);

	const results = () => {
		if (loading)
			return (
				<ListItem>
					<DualBallLoader aria-label="Loading search results" />
				</ListItem>
			);
		if (data && data.searchUsers && data.searchUsers.length > 0) {
			return data.searchUsers.map((user) => (
				<SearchResult user={user} key={user.id} me={me} />
			));
		}
		return (
			<ListItem>
				<ListItemText primary="No matched user found." />
			</ListItem>
		);
	};

	return <List classes={{ root: classes.root }}>{results()}</List>;
};

SearchResultList.propTypes = {
	me: PropTypes.object.isRequired,
	username: PropTypes.string.isRequired,
};

export default withStyles(styles)(SearchResultList);
