import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import { List, ListItem, withStyles } from "@material-ui/core";
import { SearchResult } from "./";
import { USER_QUERY, SEARCH_USER_QUERY } from "../../gqls/queries/userQueries";

const styles = theme => ({
	root: {
		position: "absolute",
		top: theme.spacing(9),
		bottom: 0,
		left: 0,
		right: 0,
		width: "calc(100% - 2px)",
		zIndex: 1000,
		padding: theme.spacing(1, 2),
		background: "white"
	}
});

const SearchResultList = ({ classes, username }) => {
	const { data, loading, refetch } = useQuery(SEARCH_USER_QUERY, {
		variables: { username: username.toLowerCase() }
	});

	useEffect(() => {
		if (username && refetch) refetch();
	}, [username]);

	const results = () => {
		if (loading) return <ListItem>Loading...</ListItem>;
		if (data && data.searchUsers && data.searchUsers.length > 0) {
			return data.searchUsers.map(user => (
				<SearchResult username={user.username} key={user.id} />
			));
		}
		return <ListItem>No result found</ListItem>;
	};

	return <List classes={{ root: classes.root }}>{results()}</List>;
};

SearchResultList.propTypes = {
	username: PropTypes.string.isRequired
};

export default withStyles(styles)(SearchResultList);
