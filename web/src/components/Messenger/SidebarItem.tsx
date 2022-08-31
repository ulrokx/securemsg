import { Box, Paper, Typography } from "@mui/material";

export interface SidebarItemProps {
  name: string;
  preview: string;
  onClick: () => void;
  selected: boolean;
}

export const SidebarItem = ({
  name,
  preview,
  onClick,
  selected,
}: SidebarItemProps) => {
  return (
    <Paper
      elevation={1}
      sx={{
        backgroundColor: selected
          ? "primary.main"
          : "transparent",
        transition: "background-color 0.2s ease-in-out",
      }}>
      <Box p={2} onClick={onClick}>
        <Typography
          variant="h6"
          color={selected ? "white" : "black"}
          sx={{ userSelect: "none" }}>
          {name}
        </Typography>
        <Typography
          variant="body1"
          color={selected ? "white" : "black"}
          sx={{ userSelect: "none" }}>
          {preview}
        </Typography>
      </Box>
    </Paper>
  );
};
