import { ApolloServer } from "apollo-server-express";
import { importSchema } from "graphql-import";
import Mutation from "./resolvers/Mutation";
import Query from "./resolvers/Query";
import Subscription from "./resolvers/Subscription";
import db from "./db";

// create the apollo server
const createServer = () => {
	return new ApolloServer({
		typeDefs: importSchema(__dirname + "/schema.graphql"),
		resolvers: {
			Mutation,
			Query,
			Subscription,
			Node: {
				__resolveType() {
					return null;
				}
			}
		},
		resolverValidationOptions: {
			requireResolversForResolveType: false
		},
		cors: {
			origin: "*", // <- allow request from all domains
			credentials: true
		}, // <- enable CORS response for requests with credentials (cookies, http authentication)
		context: req => {
			if (req.connection) {
				return req.connection.context;
			} else return { ...req, db };
		}
	});
};

export default createServer;
