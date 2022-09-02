import { Box, TextField, Button, BoxProps } from "@mui/material";
import React, { useState } from "react";

interface MessageBarProps {
  sendMessage: (message: string) => void;
  disabled?: boolean;
}

export const MessageBar = ({
  sendMessage,
  disabled,
}: MessageBarProps) => {
  const [message, setMessage] = useState("");
  const handleSendMessage: React.FormEventHandler<
    HTMLFormElement
  > = (e) => {
    if (message.length === 0) return;
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };
  return (
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
        disabled={disabled || message.length === 0}
        variant="contained"
        color="secondary"
        type="submit"
        sx={{ width: "200px" }}>
        Send
      </Button>
    </Box>
  );
};
