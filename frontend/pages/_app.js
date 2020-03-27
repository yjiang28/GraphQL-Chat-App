import { ApolloProvider } from "react-apollo";
import withData from "../scripts/withData";

const MyApp = props => {
	const { Component, apollo, pageProps } = props;

	return (
		<ApolloProvider client={apollo}>
			<Component {...pageProps} client={apollo} />
		</ApolloProvider>
	);
};

MyApp.getInitialProps = async ({ Component, ctx, apollo }) => {
	let pageProps = {};
	if (Component.getInitialProps) {
		pageProps = await Component.getInitialProps(ctx);
	}
	// exposes the query to the user
	pageProps.query = ctx.query;

	return { pageProps };
};

export default withData(MyApp);
