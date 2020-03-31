import Error from "next/error";
import App from "../components/App";
import { CURRENT_USER_QUERY } from "../gqls/queries/userQueries";

const home = props => {
	const { data, error, loading, pathname, query = {} } = props;

	if (loading) return <div>loading</div>;
	if (error) return <Error statusCode={404} />;
	if (data) {
		return <App pathname={pathname} me={data.me} query={query} />;
	}
};

home.getInitialProps = async ({ apolloClient, pathname, query, ...props }) => {
	const { data, error, loading } = await apolloClient.query({
		query: CURRENT_USER_QUERY
	});
	return { apolloClient, pathname, query, data, error, loading };
};

export default home;
