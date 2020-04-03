import { Query } from "react-apollo";
import gql from "graphql-tag";

const CHANNELS_QUERY = gql`
	query Channels($userId: ID!) {
		me {
			id
			channels(orderBy: updatedAt_DESC, first: 20) {
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
	}
`;

const CHANNELS_QUERY_FROM_CACHE = gql`
	{
		channels @client {
			id
			users {
				id
				username
				avatar
			}
			messages {
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

// const LATEST_CHANNEL_MESSAGE_QUERY = gql`
// 	query LatestChannelMessage($channelId: ID!) {
// 		latestChannelMessage(channelId: $channelId) {
// 			id
// 			content
// 		}
// 	}
// `;

// const LATEST_CHANNEL_MESSAGE_QUERY = gql`
// 	fragment Channel on Channels {
// 		id
// 		messages(last: 1) {
// 			id
// 			content
// 		}
// 	}
// `;

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
	CHANNELS_QUERY,
	CHANNELS_QUERY_FROM_CACHE,
	// LATEST_CHANNEL_MESSAGE_QUERY,
	ACTIVE_CHANNEL_QUERY,
	CHANNEL_MESSAGES_QUERY,
	LATEST_ACTIVE_CHANNEL_QUERY,
};
