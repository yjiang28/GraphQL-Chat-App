import { Query } from "react-apollo";
import gql from "graphql-tag";

const NOTIFICATIONS_QUERY = gql`
	{
		me {
			id
			notifications {
				id
				type
				content
			}
		}
	}
`;

export { NOTIFICATIONS_QUERY };
