import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import { Menu, MenuItem } from "@material-ui/core";
import { SearchResult } from "./";
import { USER_QUERY } from "../../queries/User";

const SearchResultMenu = ({ anchorEl, email }) => {
	const { data, loading, refetch } = useQuery(USER_QUERY);

	useEffect(() => {
		if (refetch) refetch();
	}, [email]);

	return (
		<Menu
			anchorEl={anchorEl}
			elevation={0}
			getContentAnchorEl={null}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "center"
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "center"
			}}
			keepMounted
			open={Boolean(anchorEl)}
		>
			{email ? <SearchResultItem email={email} /> : null}
		</Menu>
	);
};

SearchResultMenu.propTypes = {
	anchorEl: PropTypes.object,
	email: PropTypes.string.isRequired
};

export default SearchResultMenu;
