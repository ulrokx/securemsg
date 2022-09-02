import {
  Autocomplete,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { throttle } from "lodash";
import { useEffect, useMemo, useState } from "react";
import {
  User,
  useSearchUsersQuery,
} from "../../graphql/generated";
import { MessageBar } from "./MessageBar";

interface NewChannelProps {
  createChannel: (members: User[], message: string) => void;
}

export const NewChannelChat = ({
  createChannel,
}: NewChannelProps) => {
  const { data, loading, previousData, networkStatus, refetch } =
    useSearchUsersQuery({
      variables: {
        username: "",
      },
    });
  const [members, setMembers] = useState<User[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const updateOptions = async () => {
    await refetch({
      username: inputValue,
    });
  };
  const debouncedSearchUsers = useMemo(
    () => throttle(updateOptions, 300),
    [inputValue]
  );
  const handleInputChange = (
    event: React.SyntheticEvent,
    value: string
  ) => {
    setInputValue(value);
    debouncedSearchUsers();
  };
  const handleCreateChannel = (message: string) => {
    createChannel(members, message);
  };
  useEffect(() => {
    if (!open) {
      refetch({ username: "" });
    }
  }, [open]);
  return (
    <Box
      sx={{
        width: "100%",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
      }}>
      <Autocomplete
        onInputChange={handleInputChange}
        loading={loading}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        options={
          loading && previousData
            ? previousData?.searchUsers
            : !!data?.searchUsers
            ? data.searchUsers
            : []
        }
        isOptionEqualToValue={(option, value) =>
          option.id === value.id
        }
        autoHighlight
        filterOptions={(o) => o}
        getOptionLabel={(option) => (option as User).username}
        value={members}
        onChange={(event, value) => setMembers(value as User[])}
        multiple
        renderInput={(params) => (
          <TextField
            {...params}
            label="Recipients"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress
                      color="inherit"
                      size={20}
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <Box sx={{ mt: "auto" }}>
        <MessageBar
          sendMessage={handleCreateChannel}
          disabled={!(members.length >= 1)}
        />
      </Box>
    </Box>
  );
};
