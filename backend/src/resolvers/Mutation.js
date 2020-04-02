import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import faker from "faker";
import { UserInputError } from "apollo-server-express";
import { forwardTo } from "prisma-binding";
import pubsub from "../pubsub";
import { notificationTypes, messageType } from "./Subscription";

const admin = "administrator";
const { friendRequest, friendRequestAccepted } = notificationTypes;

const processUsername = (username) => {
	const res = username
		.toLowerCase()
		.split(" ")
		.reduce((acc, part) => {
			const letters = part.split("");
			letters[0] = letters[0].toUpperCase();
			acc.push(letters.join(""));
			return acc;
		}, [])
		.join(" ");
	return res;
};

const Mutation = {
	async signUp(parent, args, ctx, info) {
		const username = args.username.toLowerCase();
		const email = args.email.toLowerCase();
		const password = await bcrypt.hash(args.password, 6);

		const invalidArgs = [];
		if (await ctx.db.query.user({ where: { username } }))
			invalidArgs.push("username");
		if (await ctx.db.query.user({ where: { email } }))
			invalidArgs.push("email");
		if (invalidArgs.length > 0)
			throw new UserInputError("Duplicate registration info", {
				invalidArgs,
			});

		const avatar = faker.image.avatar();
		const user = await ctx.db.mutation.createUser(
			{
				data: {
					username,
					email,
					password,
					avatar,
					notifications: [],
					channels: [],
				},
			},
			{ id }
		);

		const channel = ctx.db.mutation.createChannel({
			data: {
				users: { connect: [{ username }] },
				messages: {
					create: [
						{
							sender: { connect: { username: admin } },
							recipient: { connect: { username } },
							content: "This is your space.",
						},
					],
				},
			},
		});

		// create the JSW token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		// set the JWT as a cookie on the response
		await ctx.res.cookie("token", token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
		});

		return { message: "Successfully signed up!" };
	},
	async signIn(parent, args, ctx, info) {
		const email = args.email.toLowerCase();
		const password = args.password;
		const user = await ctx.db.query.user(
			{ where: { email } },
			"{id password}"
		);

		if (!user)
			throw new UserInputError("No such email registered", {
				invalidArgs: ["email"],
			});

		const valid = await bcrypt.compare(password, user.password);
		if (!valid)
			throw new UserInputError("Incorrect Password", {
				invalidArgs: ["password"],
			});

		// create the JSW token
		const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
		// set the JWT as a cookie on the response
		await ctx.res.cookie("token", token, {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
		});

		return { message: "Successfully signed in!" };
	},
	async signOut(parent, args, ctx, info) {
		await ctx.res.clearCookie("token");
		return { message: "Successfully signed out!" };
	},
	async sendFriendRequest(parent, args, ctx, info) {
		if (!ctx.req.userId) {
			console.log("addFriend mutation: userId is required.");
			return null;
		}

		const { username: recipientUsername } = args;
		const { userId } = ctx.req;
		const { username: senderUsername } = await ctx.db.query.user(
			{ where: { id: userId } },
			"{username}"
		);

		const notification = await ctx.db.mutation.createNotification(
			{
				data: {
					sender: {
						connect: { username: senderUsername },
					},
					recipient: {
						connect: { username: recipientUsername.toLowerCase() },
					},
					type: friendRequest,
					content: `User ${senderUsername} sent you a friend request!`,
				},
			},
			info
		);

		pubsub.publish(friendRequest, {
			notification,
		});

		return notification;
	},
	async acceptFriendRequest(parent, args, ctx, info) {
		if (!ctx.req.userId) {
			console.log("acceptFriendRequest mutation: userId is required.");
			return null;
		}

		const { id } = args;

		const { sender, recipient } = await ctx.db.query.notification(
			{ where: { id } },
			"{sender{ id username } recipient{ id username}}"
		);

		const notificationToRecipient = await ctx.db.mutation.createNotification(
			{
				data: {
					sender: {
						connect: { id: sender.id },
					},
					recipient: {
						connect: { id: recipient.id },
					},
					type: friendRequestAccepted,
					content: `You became friends with ${processUsername(
						sender.username
					)}.`,
				},
			},
			"{id type content sender{id username} recipient{id username}}"
		);

		const notificationToSender = await ctx.db.mutation.createNotification(
			{
				data: {
					sender: {
						connect: { id: recipient.id },
					},
					recipient: {
						connect: { id: sender.id },
					},
					type: friendRequestAccepted,
					content: `You became friends with ${processUsername(
						recipient.username
					)}.`,
				},
			},
			"{id type content sender{id username} recipient{id username}}"
		);

		await ctx.db.mutation.deleteNotification({
			where: { id },
		});

		pubsub.publish(friendRequestAccepted, {
			notification: notificationToRecipient,
		});

		pubsub.publish(friendRequestAccepted, {
			notification: notificationToSender,
		});

		const channel = await ctx.db.mutation.createChannel(
			{
				data: {
					users: {
						connect: [{ id: recipient.id }, { id: sender.id }],
					},
					messages: {
						create: [
							{
								sender: { connect: { username: admin } },
								recipient: { connect: { id: recipient.id } },
								content:
									"This is the beginning of your conversation.",
							},
						],
					},
				},
			},
			info
		);

		return channel;
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

		const recipientId =
			users.length === 1
				? senderId
				: users[0].id == senderId
				? users[1].id
				: users[0].id;

		const newMessage = await ctx.db.mutation.createMessage(
			{
				data: {
					recipient: { connect: { id: recipientId } },
					sender: { connect: { id: senderId } },
					content: message,
					channel: { connect: { id: channelId } },
				},
			},
			info
		);
		pubsub.publish(messageType, { message: newMessage });
		return newMessage;
	},
};

export default Mutation;
