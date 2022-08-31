import { Stack } from "@mui/material";
import { Channel } from "../../graphql/generated";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  channels: Channel[];
  selectedChannelId: string | null;
  onSelect: (id: string) => void;
}

export const Sidebar = ({
  channels,
  selectedChannelId,
  onSelect,
}: SidebarProps) => {
  const createOnClick = (id: string) => () => {
    onSelect(id);
  };
  return (
    <Stack
      sx={{
        width: "400px",
      }}
      spacing={1}>
      {channels.map((channel) => (
        <SidebarItem
          selected={channel.id === selectedChannelId}
          key={channel.id}
          name={channel.name || "Unnamed Channel"}
          onClick={createOnClick(channel.id)}
          preview={channel.messages?.at(-1)?.text || ""}
        />
      ))}
    </Stack>
  );
};
