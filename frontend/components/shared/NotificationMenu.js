import { useState, useEffect } from "react";
import { useMutation, useSubscription, useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import { Menu, MenuItem } from "@material-ui/core";
import { Notification } from "./";
import { NOTIFICATIONS_QUERY } from "../../queries/Notification";

const NotificationMenu = ({ anchorEl, onClose }) => {
	const { data, loading, refetch } = useQuery(NOTIFICATIONS_QUERY);

	const notificationItems = () => {
		if (loading) return <MenuItem>Loading...</MenuItem>;
		if (data && data.me && data.me.notifications) {
			const { notifications } = data.me;
			if (notifications.length === 0)
				return <MenuItem>No unread notifications</MenuItem>;
			else
				return notifications.map(notification => (
					<Notification
						notification={notification}
						key={notification.id}
					/>
				));
		} else return <MenuItem>No unread notifications</MenuItem>;
	};

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
			onClose={onClose}
		>
			{notificationItems()}
		</Menu>
	);
};

export default NotificationMenu;
