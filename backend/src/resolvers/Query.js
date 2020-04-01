import { forwardTo } from "prisma-binding";
import pubsub from "../pubsub";

const Query = {
	async me(parent, args, ctx, info) {
		if (!ctx.req.userId) return null;
		return await ctx.db.query.user(
			{ where: { id: ctx.req.userId } },
			"{id username email avatar}"
		);
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
			info
		);

		return users ? users : [];
	},
	async channels(parent, args, ctx, info) {
		if (!ctx.req.userId) return null;
		const { userId } = ctx.req;
		const channels = await ctx.db.query.channels(
			{
				where: { users_some: { id: userId } },
				orderBy: "updatedAt_DESC"
			},
			"{id users{id username}}"
		);
		return channels;
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
	async latestChannelMessage(parent, args, ctx, info) {
		if (!ctx.req.userId) return null;
		const { userId } = ctx.req;
		const { channelId } = args;
		const messages = await ctx.db.query.messages(
			{
				where: {
					channel: { id: channelId },
					recipient: { id: userId }
				},
				orderBy: "createdAt_ASC",
				first: 1
			},
			info
		);

		return messages[0];
	},
	async channelMessages(parent, args, ctx, info) {
		if (!ctx.req.userId) return null;
		const { channelId } = args;
		return await ctx.db.query.messages(
			{
				where: { channel: { id: channelId } },
				orderBy: "createdAt_ASC"
			},
			info
		);
	}
};

export default Query;
