import { Query } from "react-apollo";
import gql from "graphql-tag";

const CHANNEL_QUERY = gql`
	{
		me {
			id
			channels {
				id
				users {
					id
					username
				}
			}
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
		}
	}
`;

export {
	CHANNEL_QUERY,
	ACTIVE_CHANNEL_QUERY,
	CHANNEL_MESSAGES_QUERY,
	LATEST_ACTIVE_CHANNEL_QUERY
};
