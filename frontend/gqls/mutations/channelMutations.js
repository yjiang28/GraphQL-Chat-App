import gql from "graphql-tag";

const SEND_MESSAGE_MUTATION = gql`
	mutation SendMessage($channelId: ID!, $message: String!) {
		sendMessage(channelId: $channelId, message: $message) {
			id
			channel {
				id
			}
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
`;

export { SEND_MESSAGE_MUTATION };
