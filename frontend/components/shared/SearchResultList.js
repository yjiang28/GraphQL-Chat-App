import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import { List, withStyles } from "@material-ui/core";
import { SearchResult } from "./";
import { USER_QUERY } from "../../gqls/queries/userQueries";

const styles = theme => ({
	root: {
		position: "absolute",
		background: "white",
		top: theme.spacing(9),
		left: 0,
		width: "calc(100% - 2px)",
		zIndex: 1000
	}
});

const SearchResultList = ({ classes, anchorEl, onClose, username }) => {
	const { data, loading, refetch } = useQuery(USER_QUERY, {
		variables: { username: username.toLowerCase() }
	});

	useEffect(() => {
		if (refetch) refetch();
	}, [username]);

	return (
		<List classes={{ root: classes.root }}>
			{data && data.user ? (
				<SearchResult username={data.user.username} />
			) : null}
		</List>
	);
};

SearchResultList.propTypes = {
	username: PropTypes.string
};

export default withStyles(styles)(SearchResultList);
