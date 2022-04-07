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

  const messageEndRef = React.useRef(null);

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function handleSubmit(msg) {
    console.log("msg", msg, "apt_id", apt_id);
    await sendNewChatMsg(msg, apt_id);
    setNewMessage("");
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
            <Box
              sx={{
                overflow: "hidden",
                overflowY: "scroll",
                maxHeight: "300px",
              }}
            >
              <List>
                {chatMessages &&
                  chatMessages.map((msg) => <ChatMessage msg={msg} />)}
                <div ref={messageEndRef} />
              </List>
              <Divider />
            </Box>
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
