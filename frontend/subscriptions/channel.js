import gql from "graphql-tag";

const MESSAGE_SUBSCRIPTION = gql`
	subscription OnMessageArrived($userId: ID!) {
		message(userId: $userId) {
			id
			content
			channel {
				id
			}
			sender {
				id
			}
		}
	}
`;

export { MESSAGE_SUBSCRIPTION };
