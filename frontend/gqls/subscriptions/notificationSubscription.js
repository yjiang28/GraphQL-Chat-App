import gql from "graphql-tag";

// const NOTIFICATION_SUBSCRIPTION = gql`
// 	subscription Notification($userId: ID!) {
// 		notification(userId: $userId) {
// 			id
// 		}
// 	}
// `;

const FRIEND_REQUEST_SUBSCRIPTION = gql`
	subscription FriendRequest($userId: ID!) {
		friendRequest(userId: $userId) {
			id
			type
			content
		}
	}
`;

export { FRIEND_REQUEST_SUBSCRIPTION };
