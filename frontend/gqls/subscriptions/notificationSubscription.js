import gql from "graphql-tag";

const FRIEND_REQUEST_SUBSCRIPTION = gql`
	subscription FriendRequest($userId: ID!) {
		friendRequest(userId: $userId) {
			id
		}
	}
`;

const CHANNEL_SUBSCRIPTION = gql`
	subscription Channel($userId: ID!) {
		channel(userId: $userId) {
			id
			users(where: { id_not: $userId }) {
				id
				username
				avatar
			}
			messages(orderBy: createdAt_ASC, last: 20) {
				sender {
					id
					username
				}
				recipient {
					id
					username
				}
				content
			}
		}
	}
`;

export { FRIEND_REQUEST_SUBSCRIPTION, CHANNEL_SUBSCRIPTION };
