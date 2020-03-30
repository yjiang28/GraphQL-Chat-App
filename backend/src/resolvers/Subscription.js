import pubsub, { withFilter } from "../pubsub";

const friendRequest = "FriendRequest";
const friendRequestAccepted = "FriendRequestAccepted";
const notificationTypes = {
	friendRequest,
	friendRequestAccepted
};
const message = "newMessage";

const Subscription = {
	notification: {
		subscribe: withFilter(
			() => pubsub.asyncIterator([friendRequest, friendRequestAccepted]),
			(payload, variables) =>
				payload.notification.recipient.id == variables.userId
		)
	},
	message: {
		subscribe: withFilter(
			() => pubsub.asyncIterator(message),
			(payload, variables) =>
				payload.message.recipient.id == variables.userId ||
				payload.message.sender.id == variables.userId
		)
	}
};

export default Subscription;
export { notificationTypes, message };
