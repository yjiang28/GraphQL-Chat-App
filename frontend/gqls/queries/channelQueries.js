import { Query } from "react-apollo";
import gql from "graphql-tag";

const CHANNEL_QUERY = gql`
	{
		channels {
			id
			users {
				id
				username
				avatar
			}
			messages {
				id
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

const LATEST_CHANNEL_MESSAGE_QUERY = gql`
	query LatestChannelMessage($channelId: ID!) {
		latestChannelMessage(channelId: $channelId) {
			id
			content
		}
	}
`;

const ACTIVE_CHANNEL_QUERY = gql`
	{
		activeChannel @client {
			id
			users {
				id
				username
				avatar
			}
			messages {
				id
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

const CHANNEL_MESSAGES_QUERY = gql`
	query ChannelMessages($channelId: ID!) {
		channelMessages(channelId: $channelId) {
			id
			sender {
				id
				username
			}
			recipient {
				id
				username
			}
			content
			createdAt
		}
	}
`;

const LATEST_ACTIVE_CHANNEL_QUERY = gql`
	{
		latestActiveChannel {
			id
			users {
				id
				username
				avatar
			}
			messages {
				id
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

export {
	CHANNEL_QUERY,
	LATEST_CHANNEL_MESSAGE_QUERY,
	ACTIVE_CHANNEL_QUERY,
	CHANNEL_MESSAGES_QUERY,
	LATEST_ACTIVE_CHANNEL_QUERY
};
