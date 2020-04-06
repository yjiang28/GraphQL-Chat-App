import gql from "graphql-tag";

const SEND_MESSAGE_MUTATION = gql`
	mutation SendMessage($channelId: ID!, $message: String!) {
		sendMessage(channelId: $channelId, message: $message) {
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

const DELETE_CHANNEL_MUTATION = gql`
	mutation DeleteChannel($channelId: ID!) {
		deleteChannel(where: { id: $channelId }) {
			id
		}
	}
`;

export { SEND_MESSAGE_MUTATION, DELETE_CHANNEL_MUTATION };
