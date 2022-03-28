import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
const PatientChatMessage = ({ msg }) => {
  const {
    content,
    created_at,
    author: { photo_url },
  } = msg;

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="headshot" src={photo_url} />
        </ListItemAvatar>
        <ListItemText
          primary={`${content}`}
          secondary={
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {`${new Date(created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}`}
            </Typography>
          }
        />
      </ListItem>
    </>
  );
};

export default PatientChatMessage;
