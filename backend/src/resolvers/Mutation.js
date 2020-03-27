import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server-express";
import { forwardTo } from "prisma-binding";
import pubsub from "../pubsub";
import { NotificationTypes, MessageArrived } from "./Subscription";

const Mutation = {
	async signUp(parent, args, ctx, info) {
		const username = args.username.toLowerCase();
		const email = args.email.toLowerCase();
		const password = await bcrypt.hash(args.password, 6);
		let invalidArgs = [];
		if (await ctx.db.query.user({ where: { username } }))
			invalidArgs.push("username");
		if (await ctx.db.query.user({ where: { email } }))
			invalidArgs.push("email");
		if (invalidArgs.length > 0)
			throw new UserInputError("Duplicate registration info", {
				invalidArgs
			});

		const user = await ctx.db.mutation.createUser(
			{
				data: {
					username,
					email,
					password,
					notifications: [],
					channels: []
				}
			},
			info
		);
		// create the JSW token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		// set the JWT as a cookie on the response
		ctx.res.cookie("token", token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 30 // 1 month
		});

		return user;
	},
	async signIn(parent, args, ctx, info) {
		const email = args.email.toLowerCase();
		const password = args.password;
		const user = await ctx.db.query.user({ where: { email } });
		if (!user)
			throw new UserInputError("No such email registered", {
				invalidArgs: ["email"]
			});
		const valid = await bcrypt.compare(password, user.password);
		if (!valid)
			throw new UserInputError("Incorrect Password", {
				invalidArgs: ["password"]
			});
		// create the JSW token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		// set the JWT as a cookie on the response
		ctx.res.cookie("token", token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 30 // 1 month
		});

		return user;
	},
	signOut(parent, args, ctx, info) {
		ctx.res.clearCookie("token");
		return { message: "Successfully signed out!" };
	},
	async sendMessage(parent, args, ctx, info) {
		if (!ctx.req.userId) {
			console.log("sendMessage mutation: userId is required.");
			return null;
		}
		const { userId: senderId } = ctx.req;
		const { channelId, message } = args;

		const { users } = await ctx.db.query.channel(
			{ where: { id: channelId } },
			`{users{id}}`
		);
		const recipientId = users[0].id == senderId ? users[1].id : users[0].id;

		const newMessage = await ctx.db.mutation.createMessage(
			{
				data: {
					recipient: { connect: { id: recipientId } },
					sender: { connect: { id: senderId } },
					content: message,
					channel: { connect: { id: channelId } }
				}
			},
			`{id channel{id} recipient{id} sender{id} content}`
		);

		pubsub.publish(onMessageArrived, { message: newMessage });
		return newMessage;
	}
};

export default Mutation;
