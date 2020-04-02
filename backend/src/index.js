require("dotenv").config({ path: "variables.env" });
import createServer from "./createServer";
import express from "express";
import http from "http";
import db from "./db";
import cookieParse from "cookie-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import { execute, subscribe } from "graphql";
import { importSchema } from "graphql-import";
import { SubscriptionServer } from "subscriptions-transport-ws";

const app = express();
app.use(cookieParse());

// decode the JWT to get user id on each request
app.use((req, res, next) => {
	const { token } = req.cookies;
	// const token =
	// 	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjazhoandmbDZ4aGpuMDkzNGZ4dHc3dG5hIiwiaWF0IjoxNTg1NzU4ODg5fQ.BjQ-J9Ib7NCWHLPYprJNRAu5gVAzTlcHDBIms-iasD4";
	if (token) {
		const { userId } = jwt.verify(token, process.env.APP_SECRET);
		// put the userId to further request
		req.userId = userId;
	}
	next();
});

app.use(
	cors({
		credentials: true,
		origin: process.env.FRONTEND_URL,
	})
);

const server = createServer();
server.applyMiddleware({
	app,
	cors: false,
});

// handle the web socket interface to the subscription service.
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: 4000 }, () => {
	// Both GraphQL and the subscription websocket share the same port, but under different protocols
	console.log(
		`🚀 Server ready at http://localhost:4000${server.graphqlPath}`
	);
	console.log(
		`🚀 Subscriptions ready at ws://localhost:4000${server.subscriptionsPath}`
	);
});
