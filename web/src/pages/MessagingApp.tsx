import { CircularProgress } from "@mui/material";
import { Messenger } from "../components/Messenger/Messenger";
import {
  Channel,
  useMessengerQuery,
} from "../graphql/generated";

const MessagingApp = () => {
  const { data, loading, error } = useMessengerQuery({
    variables: {
      pagination: {
        limit: 10,
        offset: 0,
      },
      messagesPagination: {
        limit: 1,
        offset: 0,
      },
    },
  });
  if (loading || !data) {
    return (
      <CircularProgress
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    );
  }
  return <Messenger channels={data?.channels as Channel[]} />;
};

export default MessagingApp;
