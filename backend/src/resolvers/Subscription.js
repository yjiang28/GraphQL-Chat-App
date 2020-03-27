import pubsub, { withFilter } from "../pubsub";

const FriendRequestArrived = "FriendRequestArrived";
const FriendRequestAccepted = "FriendRequestAccepted";
const MessageArrived = "MessageArrived";

const NotificationTypes = {
	FriendRequestArrived,
	FriendRequestAccepted
};

const Subscription = {
	notification: {
		subscribe: withFilter(
			() =>
				pubsub.asyncIterator([
					FriendRequestArrived,
					FriendRequestAccepted
				]),
			(payload, variables) => {
				return (
					payload.notification.userGame.user.id != variables.userId &&
					payload.notification.recipients.filter(
						r => r.id == variables.userId
					).length > 0
				);
			}
		)
	}
};

export default Subscription;
export { NotificationTypes, MessageArrived };
