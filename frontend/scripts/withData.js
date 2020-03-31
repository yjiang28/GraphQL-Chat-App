import withApollo from "next-with-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink, creatHttpLink } from "apollo-link-http";
import { SchemaLink } from "apollo-link-schema";
import { onError } from "apollo-link-error";
import { ApolloLink, Observable, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { endpoint, subscriptionEndpoint } from "../config";

function createClient({ headers }) {
	const cache = new InMemoryCache();

	// Helper function to get data from the cache
	const getState = query => {
		return cache.readQuery({ query }).state;
	};

	// Helper function to write data back to the cache
	const writeState = state => {
		return cache.writeData({ data: { state } });
	};

	// initial apollo local state
	const initState = () => {
		const state = {
			appState: {
				me: {},
				game: {}
			},
			__typename: "State"
		};

		writeState(state);
	};

	const request = operation => {
		operation.setContext({
			headers
		});
	};

	const requestLink = new ApolloLink(
		(operation, forward) =>
			new Observable(observer => {
				let handle;
				Promise.resolve(operation)
					.then(oper => {
						request(oper);
						handle = forward(operation).subscribe({
							next: observer.next.bind(observer),
							error: observer.error.bind(observer),
							complete: observer.complete.bind(observer)
						});
					})
					.catch(observer.error.bind(observer));

				return () => {
					if (handle) handle.unsubscribe();
				};
			})
	);

	const httpLink = new HttpLink({
		uri: endpoint,
		credentials: "include"
	});

	// Create a WebSocket link
	const wsLink = process.browser
		? new WebSocketLink(
				new SubscriptionClient(subscriptionEndpoint, {
					reconnect: true
				})
		  )
		: null;

	// using the ability to split links to send data to each link
	// depending on what kind of operation is being sent
	const link = process.browser
		? split(
				// split based on operation type
				({ query }) => {
					const definition = getMainDefinition(query);
					return (
						definition.kind === "OperationDefinition" &&
						definition.operation === "subscription"
					);
				},
				wsLink,
				httpLink
		  )
		: httpLink;

	return new ApolloClient({
		link: ApolloLink.from([requestLink, link]),
		cache,
		resolvers: {},
		ssrMode: typeof window === "undefined" // Disables forceFetch on the server (so queries are only run once)
	});
}

export default withApollo(createClient, { getDataFromTree: "ssr" });
