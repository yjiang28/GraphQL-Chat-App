import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

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
		user(id: $id, email: $email, username: $username) {
			id
			username
			email
		}
	}
`;

export { CURRENT_USER_QUERY, USER_QUERY };
