import { forwardTo } from "prisma-binding";
import pubsub from "../pubsub";

const Query = {
	user: forwardTo("db"),
	users: forwardTo("db"),
	channel: forwardTo("db"),
	channels: forwardTo("db"),
	async me(parent, args, ctx, info) {
		if (!ctx.req.userId) return null;
		return await ctx.db.query.user({ where: { id: ctx.req.userId } }, info);
	},
	async searchUsers(parent, args, ctx, info) {
		if (!ctx.req.userId) return null;

		const { username } = args;
		const users = await ctx.db.query.users(
			{
				where: {
					username_starts_with: username.toLowerCase()
				}
			},
			"{id username}"
		);

		return users ? users : [];
	},
	async channels(parent, args, ctx, info) {
		if (!ctx.req.userId) return null;
		const { userId } = ctx.req;
		return await ctx.db.query.channels(
			{
				where: { users_some: { id: userId } },
				orderBy: "updatedAt_DESC"
			},
			"{id users{id username}}"
		);
	},
	async latestActiveChannel(parent, args, ctx, info) {
		if (!ctx.req.userId) return null;
		const { userId } = ctx.req;
		const channels = await ctx.db.query.channels(
			{
				where: { users_some: { id: userId } },
				orderBy: "updatedAt_ASC",
				first: 1
			},
			info
		);
		return channels[0];
	},
	async channelMessages(parent, args, ctx, info) {
		// get messages from the channel specified by args.id and sorted ascendingly by createdAt
		if (!ctx.req.userId) return null;
		const { channelId } = args;
		return await ctx.db.query.messages(
			{
				where: {
					channel: {
						id: channelId
					}
				},
				orderBy: "createdAt_ASC"
			},
			info
		);
	},
	messages: forwardTo("db")
};

export default Query;
