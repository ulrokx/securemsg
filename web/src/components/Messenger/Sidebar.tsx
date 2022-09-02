import { Stack } from "@mui/material";
import { Channel } from "../../graphql/generated";
import { SidebarItem } from "./SidebarItem";
import { SidebarTopper } from "./SidebarTopper";

interface SidebarProps {
  channels: Channel[];
  selectedChannelId: string | null;
  onSelect: (id: string) => void;
  createChannel: () => void;
}

export const Sidebar = ({
  channels,
  selectedChannelId,
  onSelect,
  createChannel,
}: SidebarProps) => {
  const createOnClick = (id: string) => () => {
    onSelect(id);
  };
  const handleCreateChannel = () => {
    createChannel();
  };
  return (
    <Stack
      sx={{
        width: "400px",
        minWidth: "400px",
      }}
      spacing={1}>
      <SidebarTopper createChannel={handleCreateChannel} />
      {selectedChannelId === "new" && (
        <SidebarItem
          name="New Channel..."
          preview="Add recipients in the right panel!"
          selected
          onClick={() => {}}
        />
      )}
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
