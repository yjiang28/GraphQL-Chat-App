import { Query } from "react-apollo";
import gql from "graphql-tag";

const CURRENT_USER_QUERY = gql`
	{
		me {
			id
			email
			username
			avatar
		}
	}
`;

const USER_QUERY = gql`
	query User($id: ID, $email: String, $username: String) {
		user(where: { id: $id, email: $email, username: $username }) {
			id
			username
			email
			avatar
		}
	}
`;

const SEARCH_USER_QUERY = gql`
	query SearchUsers($username: String!) {
		searchUsers(username: $username) {
			id
			username
			avatar
		}
	}
`;

export { CURRENT_USER_QUERY, USER_QUERY, SEARCH_USER_QUERY };
