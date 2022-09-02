import { Add } from "@mui/icons-material";
import { Box, IconButton, TextField } from "@mui/material";

interface SidebarTopperProps {
  createChannel: () => void;
}

export const SidebarTopper = ({
  createChannel,
}: SidebarTopperProps) => {
  const handleCreateChannel = () => {
    createChannel();
  };
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      columnGap="2rem"
      width="100%">
      <TextField fullWidth />
      <IconButton size="large" onClick={handleCreateChannel}>
        <Add />
      </IconButton>
    </Box>
  );
};
