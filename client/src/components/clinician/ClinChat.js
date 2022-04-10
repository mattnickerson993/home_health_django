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
import { ChatMessageContext, ClinicianAptContext } from "../../context";
import { getAptMessages, sendNewChatMsg } from "../../services/AptService";
import ChatMessage from "./ChatMessage";

const ClinChat = () => {
  const [newMessage, setNewMessage] = React.useState("");
  // apt context
  const { clinactiveapts } = React.useContext(ClinicianAptContext);
  const { clinschedapts, clin_inroute_apts, clin_arrived_apts } =
    clinactiveapts;
  // check which type of active apt is present if any
  const schedAptsPresent = clinschedapts && clinschedapts.length;
  const inRouteAptsPresent = clin_inroute_apts && clin_inroute_apts.length;
  const arrivedAptsPresent = clin_arrived_apts && clin_arrived_apts.length;

  // get correct apt_id for chat messages and logic regarding whether chat is displayed
  const apt_id = schedAptsPresent
    ? clinschedapts[0].id
    : inRouteAptsPresent
    ? clin_inroute_apts[0].id
    : arrivedAptsPresent
    ? clin_arrived_apts[0].id
    : null;

  // previous and updated chat messages
  const {
    clinicianChatMessages: { chatMessages },
  } = React.useContext(ChatMessageContext);

  // logic to autoscroll to bottom of chat
  const messageEndRef = React.useRef(null);

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function handleSubmit(msg) {
    if (apt_id) {
      await sendNewChatMsg(msg, apt_id);
    }
    setNewMessage("");
  }

  if (!apt_id) {
    return (
      <>
        <Box>
          Looks like you don't have an active appointment. Check back to chat
          when you do!
        </Box>
      </>
    );
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
