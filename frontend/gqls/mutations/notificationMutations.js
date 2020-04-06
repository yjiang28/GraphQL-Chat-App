import gql from "graphql-tag";

const SEND_FRIEND_REQUEST_MUTATION = gql`
	mutation SendFriendRequest($username: String!) {
		sendFriendRequest(username: $username) {
			id
			type
			content
			recipient {
				id
				username
			}
		}
	}
`;

// id: notification id
const ACCEPT_FRIEND_REQUEST_MUTATION = gql`
	mutation AcceptFriendRequest($id: ID!) {
		acceptFriendRequest(id: $id) {
			id
			users {
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

export { SEND_FRIEND_REQUEST_MUTATION, ACCEPT_FRIEND_REQUEST_MUTATION };
