import gql from "graphql-tag";

const SIGN_UP_MUTATION = gql`
	mutation SignUp($username: String!, $email: String!, $password: String!) {
		signUp(username: $username, email: $email, password: $password) {
			message
		}
	}
`;

const SIGN_IN_MUTATION = gql`
	mutation SignIn($email: String!, $password: String!) {
		signIn(email: $email, password: $password) {
			message
		}
	}
`;

const SIGN_OUT_MUTATION = gql`
	mutation SignOut {
		signOut {
			message
		}
	}
`;

export { SIGN_UP_MUTATION, SIGN_IN_MUTATION, SIGN_OUT_MUTATION };
