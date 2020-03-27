import { PubSub, withFilter } from "graphql-subscriptions";
const pubsub = new PubSub();

export default pubsub;
export { withFilter };
