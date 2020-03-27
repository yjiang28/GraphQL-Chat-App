import { Query } from "react-apollo";
import gql from "graphql-tag";

const NOTIFICATIONS_QUERY = gql`
  {
    me {
      id
      notifications {
        id
        userGame {
          id
        }
        content
        type
      }
    }
  }
`;

export { NOTIFICATIONS_QUERY };
