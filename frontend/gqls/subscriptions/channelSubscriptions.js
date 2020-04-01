import gql from "graphql-tag";

const MESSAGE_SUBSCRIPTION = gql`
	subscription Message($userId: ID!) {
		message(userId: $userId) {
			id
			channel {
				id
			}
		}
	}
`;

export { MESSAGE_SUBSCRIPTION };
