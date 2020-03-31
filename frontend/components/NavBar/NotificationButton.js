import { Fragment, useState, useEffect } from "react";
import { useMutation, useSubscription, useQuery } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import { Badge, IconButton, Menu, MenuItem } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Notification from "./Notification";
import { NOTIFICATIONS_QUERY } from "../../gqls/queries/notificationQueries";
import { CHANNEL_QUERY } from "../../gqls/queries/channelQueries";
import { NOTIFICATION_SUBSCRIPTION } from "../../gqls/subscriptions/notificationSubscription";

const NotificationButton = ({ me }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [newNotif, setNewNotif] = useState(false);
	const { data, loading, refetch } = useQuery(NOTIFICATIONS_QUERY);
	const { refetch: refetchChannels } = useQuery(CHANNEL_QUERY);

	useSubscription(NOTIFICATION_SUBSCRIPTION, {
		variables: { userId: me.id },
		onSubscriptionData: ({ subscriptionData }) => {
			if (refetch) refetch();
			if (
				subscriptionData.data.notification.type ===
				"FriendRequestAccepted"
			)
				refetchChannels();
		}
	});

	const openMenu = e => {
		setNewNotif(false);
		setAnchorEl(e.currentTarget);
	};

	const closeMenu = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		if (data && data.me && data.me.notifications.length > 0)
			setNewNotif(true);
	}, [data]);

	const notifications = () => {
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
		}
		return <MenuItem>No unread notifications</MenuItem>;
	};

	return (
		<Fragment>
			<IconButton
				aria-label={
					newNotif
						? "No unread notifications"
						: "You have new notifications"
				}
				color="inherit"
				onClick={openMenu}
			>
				<Badge variant="dot" color="secondary" invisible={!newNotif}>
					<NotificationsIcon />
				</Badge>
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				elevation={0}
				getContentAnchorEl={null}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={closeMenu}
			>
				{notifications()}
			</Menu>
		</Fragment>
	);
};

NotificationButton.propTypes = {
	me: PropTypes.object.isRequired
};

export default NotificationButton;
