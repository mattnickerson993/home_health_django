import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {
  AppBar,
  Avatar,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Chat } from "@mui/icons-material";
import { ChatMessageContext } from "../../context";
import { getAptMessages, sendNewChatMsg } from "../../services/AptService";
import ChatMessage from "./ChatMessage";

const ClinChat = () => {
  const [newMessage, setNewMessage] = React.useState("");

  const {
    clinicianChatMessages: { chatMessages },
    dispatchClinicianChatMessages,
  } = React.useContext(ChatMessageContext);
  const apt_id = chatMessages?.[0]?.appointment?.id;

  async function handleSubmit(msg) {
    await sendNewChatMsg(msg, apt_id);
  }
  return (
    <>
      <Paper
        sx={{
          p: 2,
          margin: "auto",
          maxWidth: 700,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <Typography sx={{ marginRight: "5px" }} variant="h5">
                Chat
              </Typography>
              <Chat />
            </Box>
          </Grid>
        </Grid>
        <Grid container className={"blah"}>
          <Grid item xs={12}>
            <List sx={{ width: "100%", maxHeight: "100%", overflow: "auto" }}>
              {chatMessages &&
                chatMessages.map((msg) => <ChatMessage msg={msg} />)}
            </List>
            <Divider />
          </Grid>
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={11}>
              <TextField
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                id="outlined-message"
                label="Message"
                fullWidth
              />
            </Grid>
            <Grid xs={1} align="right">
              <Fab color="primary" aria-label="add">
                <SendIcon onClick={() => handleSubmit(newMessage)} />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
export default ClinChat;
