import { forwardTo } from "prisma-binding";
import pubsub from "../pubsub";
const admin = "administrator";

const Query = {
	async me(parent, args, ctx, info) {
		if (!ctx.req.userId) return null;
		return await ctx.db.query.user({ where: { id: ctx.req.userId } }, info);
	},
	async notifications(parent, args, ctx, info) {
		if (!ctx.req.userId) return null;
		const { userId } = ctx.req;
		const notifications = await ctx.db.query.notifications(
			{
				where: { recipient: { id: userId } },
				orderBy: "createdAt_DESC"
			},
			info
		);

		return notifications;
	},
	async searchUsers(parent, args, ctx, info) {
		if (!ctx.req.userId) return null;

		const { username } = args;
		const users = await ctx.db.query.users(
			{
				where: {
					username_starts_with: username.toLowerCase(),
					username_not: admin
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
			info
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
					channel: { id: channelId }
				},
				orderBy: "createdAt_DESC",
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
