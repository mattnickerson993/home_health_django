import { Alert, Stack } from "@mui/material";

export const Message = ({ message, severity, variant }) => {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity={severity}>{message}</Alert>
    </Stack>
  );
};
