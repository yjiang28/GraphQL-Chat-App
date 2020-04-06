import { Fragment, useState, useEffect } from "react";
import {
	useMutation,
	useSubscription,
	useQuery,
	useApolloClient,
} from "@apollo/react-hooks";
import Router from "next/router";
import PropTypes from "prop-types";
import { Badge, IconButton, Menu, MenuItem } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Notification from "./Notification";
import { NOTIFICATIONS_QUERY } from "../../gqls/queries/notificationQueries";
import {
	CHANNELS_QUERY,
	CHANNELS_QUERY_FROM_CACHE,
} from "../../gqls/queries/channelQueries";
import {
	FRIEND_REQUEST_SUBSCRIPTION,
	CHANNEL_SUBSCRIPTION,
} from "../../gqls/subscriptions/notificationSubscription";

const NotificationButton = ({ me }) => {
	const client = useApolloClient();
	const [anchorEl, setAnchorEl] = useState(null);
	const [newNotif, setNewNotif] = useState(false);

	const { data, loading, error, refetch } = useQuery(NOTIFICATIONS_QUERY, {
		onCompleted: (data) => {
			if (
				data &&
				data.me &&
				data.me.notifications &&
				data.me.notifications.length > 0
			) {
				setNewNotif(true);
			}
		},
		onError: (e) => {
			console.log("NotificationButton: NOTIFICATIONS_QUERY:", e);
		},
		notifyOnNetworkStatusChange: true,
	});

	const { refetch: refetchChannels } = useQuery(CHANNELS_QUERY, {
		variables: { userId: me.id },
		onError: (e) => {
			console.log("NotificationButton: CHANNELS_QUERY:", e);
		},
	});

	useSubscription(FRIEND_REQUEST_SUBSCRIPTION, {
		variables: { userId: me.id },
		onSubscriptionData: ({ subscriptionData }) => {
			if (refetch) refetch();
		},
		onError: (e) => {
			console.log("NotificationButton: FRIEND_REQUEST_SUBSCRIPTION:", e);
		},
	});

	useSubscription(CHANNEL_SUBSCRIPTION, {
		variables: { userId: me.id },
		onSubscriptionData: ({ subscriptionData }) => {
			const { channel } = subscriptionData.data;
			const data = client.readQuery({
				query: CHANNELS_QUERY_FROM_CACHE,
			});
			const channels = [...data.channels];

			channels.unshift({
				...channel,
				users: [...channel.users.filter((user) => user.id !== me.id)],
			});

			console.log(channels);

			client.writeQuery({
				query: CHANNELS_QUERY_FROM_CACHE,
				data: {
					...data,
					channels,
				},
			});

			Router.push({
				pathname: "/chatroom",
				query: {
					channelId: channel.id,
				},
			});
		},
		onError: (e) => {
			console.log("NotificationButton: CHANNEL_SUBSCRIPTION:", e);
		},
	});

	const openMenu = (e) => {
		setNewNotif(false);
		setAnchorEl(e.currentTarget);
	};

	const closeMenu = () => {
		setAnchorEl(null);
	};

	const notifications = () => {
		if (loading) return <MenuItem>Loading... </MenuItem>;
		if (data && data.me && data.me.notifications) {
			const { notifications } = data.me;
			if (notifications.length === 0)
				return <MenuItem>No unread notifications</MenuItem>;
			else
				return notifications.map((notification) => (
					<Notification
						notification={notification}
						key={notification.id}
					/>
				));
		}
		if (error) return <MenuItem>Error: fetching notifications</MenuItem>;
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
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
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
	me: PropTypes.object.isRequired,
};

export default NotificationButton;
