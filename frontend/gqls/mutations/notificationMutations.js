import gql from "graphql-tag";

const SEND_FRIEND_REQUEST_MUTATION = gql`
	mutation SendFriendRequest($username: String!) {
		sendFriendRequest(username: $username) {
			id
			content
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
			}
		}
	}
`;

export { SEND_FRIEND_REQUEST_MUTATION, ACCEPT_FRIEND_REQUEST_MUTATION };
