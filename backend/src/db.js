// this file connects to the remote prisma db and gives us the ability to query it with JS
require("dotenv").config({ path: "variables.env" });
import { Prisma } from "prisma-binding";

const db = new Prisma({
	typeDefs: "src/generated/prisma.graphql",
	endpoint: process.env.PRISMA_ENDPOINT,
	secret: process.env.PRISMA_SECRET,
	debug: false
});

export default db;
