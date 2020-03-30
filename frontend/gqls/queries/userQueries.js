import { Query } from "react-apollo";
import gql from "graphql-tag";

const CURRENT_USER_QUERY = gql`
	{
		me {
			id
			email
			username
		}
	}
`;

const USER_QUERY = gql`
	query User($id: ID, $email: String, $username: String) {
		user(where: { id: $id, email: $email, username: $username }) {
			id
			username
			email
		}
	}
`;

export { CURRENT_USER_QUERY, USER_QUERY };
