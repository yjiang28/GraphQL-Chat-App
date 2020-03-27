import App from "../components/App";
import { CURRENT_USER_QUERY } from "../components/queries/User";

const home = props => {
	const { apolloClient, data, error, loading, pathname, query } = props;
	if (loading) return null;
	if (data) return <App pathname={pathname} me={data.me} query={query} />;
};

home.getInitialProps = async ({ apolloClient, pathname, query, ...props }) => {
	const { data, error, loading } = await apolloClient.query({
		query: CURRENT_USER_QUERY
	});
	return { apolloClient, pathname, query, data, error, loading };
};

export default home;
