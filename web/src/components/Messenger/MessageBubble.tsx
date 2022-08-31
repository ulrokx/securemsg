import { Box } from "@mui/material";
import { forwardRef } from "react";

interface MessageBubbleProps {
  message: string;
  isOwnMessage: boolean;
}

const MessageBubble = forwardRef(
  ({ isOwnMessage, message }: MessageBubbleProps, ref) => (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        marginBottom: "1rem",
      }}>
      <Box
        sx={{
          backgroundColor: isOwnMessage
            ? "primary.main"
            : "secondary.main",
          color: isOwnMessage
            ? "primary.contrastText"
            : "secondary.contrastText",
          padding: "1rem",
          borderRadius: "1rem",
          maxWidth: "50%",
          marginRight: isOwnMessage ? "0" : "1rem",
          marginLeft: isOwnMessage ? "1rem" : "0",
        }}>
        {message}
      </Box>
    </Box>
  )
);

MessageBubble.displayName = "MessageBubble";
export default MessageBubble;
