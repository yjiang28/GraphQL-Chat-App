import gql from "graphql-tag";

const NOTIFICATION_SUBSCRIPTION = gql`
	subscription Notification($userId: ID!) {
		notification(userId: $userId) {
			id
		}
	}
`;

export { NOTIFICATION_SUBSCRIPTION };
