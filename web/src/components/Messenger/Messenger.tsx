import { AddBoxSharp } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useState } from "react";
import { Channel } from "../../graphql/generated";
import { Sidebar } from "./Sidebar";
import { Chat } from "./Chat";

interface MessengerProps {
  channels: Channel[];
}

export const Messenger = ({ channels }: MessengerProps) => {
  const [selectedChannelId, setSelectedChannelId] = useState<
    string | null
  >(null);
  const handleSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
  };
  return (
    <Box
      sx={{
        display: "flex",
        height: "80vh",
      }}>
      <Sidebar
        channels={channels}
        selectedChannelId={selectedChannelId}
        onSelect={handleSelect}
      />
      {selectedChannelId ? (
        <Chat channelId={selectedChannelId} />
      ) : (
        <></>
      )}
    </Box>
  );
};
