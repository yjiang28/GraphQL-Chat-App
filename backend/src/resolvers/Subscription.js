import pubsub, { withFilter } from "../pubsub";

const friendRequest = "FriendRequest";
const friendRequestAccepted = "FriendRequestAccepted";
const notificationTypes = {
	friendRequest,
	friendRequestAccepted,
};
const messageType = "newMessage";

const Subscription = {
	friendRequest: {
		subscribe: withFilter(
			() => pubsub.asyncIterator([friendRequest]),
			(payload, variables) =>
				payload.friendRequest.recipient.id == variables.userId
		),
	},
	channel: {
		subscribe: withFilter(
			() => pubsub.asyncIterator([friendRequestAccepted]),
			(payload, variables) =>
				payload.channel.users.reduce((acc, user) => {
					return acc || user.id == variables.userId;
				}, false)
		),
	},
	message: {
		subscribe: withFilter(
			() => pubsub.asyncIterator([messageType]),
			(payload, variables) =>
				payload.message.recipient.id == variables.userId ||
				payload.message.sender.id == variables.userId
		),
	},
};

export default Subscription;
export { notificationTypes, messageType };
