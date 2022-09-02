import { AddBoxSharp } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useState } from "react";
import {
  Channel,
  User,
  useSearchUsersLazyQuery,
} from "../../graphql/generated";
import { Sidebar } from "./Sidebar";
import { Chat } from "./Chat";
import { NewChannelChat } from "./NewChannel";

interface MessengerProps {
  channels: Channel[];
}

export const Messenger = ({ channels }: MessengerProps) => {
  const [selectedChannelId, setSelectedChannelId] = useState<
    string | null
  >(null);

  const handleCreateChannel = (
    members: User[],
    message: string
  ) => {
    console.log(members, message);
  };
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
        createChannel={() => setSelectedChannelId("new")}
        channels={channels}
        selectedChannelId={selectedChannelId}
        onSelect={handleSelect}
      />
      {selectedChannelId === "new" ? (
        <NewChannelChat createChannel={handleCreateChannel} />
      ) : selectedChannelId ? (
        <Chat channelId={selectedChannelId} />
      ) : (
        <Box sx={{ flex: 1 }} />
      )}
    </Box>
  );
};
