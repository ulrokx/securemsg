import { gql } from "@apollo/client";
import {
  Box,
  Button,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import {
  ReactEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "../../context/AuthContext";
import {
  ChannelDocument,
  useChannelQuery,
  useSendMessageMutation,
} from "../../graphql/generated";
import MessageBubble from "./MessageBubble";

interface ChatProps {
  channelId: string;
}

export const Chat = ({ channelId }: ChatProps) => {
  const { data, loading, error } = useChannelQuery({
    variables: {
      id: channelId,
    },
  });
  const [message, setMessage] = useState("");
  useEffect(() => {
    setMessage("");
  }, [channelId]);
  const [sendMessage] = useSendMessageMutation({
    update(cache, { data }) {
      const response = data?.sendMessage!;
      cache.modify({
        id: `Channel:${channelId}`,
        fields: {
          messages(existingMessages = [], { readField }) {
            const newMessageRef = cache.writeFragment({
              data: response,
              fragment: gql`
                fragment NewMessage on Message {
                  id
                  text
                  createdAt
                }
              `,
            });

            return [...existingMessages, newMessageRef];
          },
        },
      });
    },
  });
  const { user } = useAuth();
  const topMessageRef = useRef<HTMLDivElement>(null);
  const channel = data?.channel;
  const handleSendMessage: ReactEventHandler<HTMLFormElement> = (
    e
  ) => {
    e.preventDefault();
    sendMessage({
      variables: {
        input: {
          channelId,
          text: message,
        },
      },
    });
    topMessageRef.current?.scrollIntoView();
    setMessage("");
  };
  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }
  if (loading || !channel) {
    return <LinearProgress />;
  }
  if (channelId === null) {
    return (
      <Typography>Select a channel to start chatting</Typography>
    );
  }
  return (
    <Box
      sx={{
        width: "100%",
        height: "70vh",
      }}>
      <Typography variant="h4">{channel.name}</Typography>
      <Box
        sx={{
          height: "100%",
          overflowY: "scroll",
          display: "flex",
          flexDirection: "column-reverse",
        }}>
        {channel.messages.map((message, i) => (
          <MessageBubble
            ref={i === 0 ? topMessageRef : undefined}
            key={message.id}
            message={message.text}
            isOwnMessage={message.user.id == user?.id}
          />
        ))}
      </Box>
      <Box
        sx={{ display: "flex" }}
        component="form"
        onSubmit={handleSendMessage}>
        <TextField
          variant="outlined"
          label="Message"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          sx={{ width: "200px" }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};
