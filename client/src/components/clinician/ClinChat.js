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
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Chat } from "@mui/icons-material";

const ClinChat = () => {
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
            <Typography variant="h5">Chat</Typography>
            <Chat />
          </Grid>
        </Grid>
        <Grid container justifyContent={"flex-start"} className={"blah"}>
          <Grid item xs={12}>
            <List className={"blah"}>
              <ListItem key="1">
                <Grid container>
                  <Grid item xs={12}>
                    <Box>
                      <Avatar>H</Avatar>
                      <ListItemText
                        align="right"
                        primary="Hey man, What's up ?"
                      ></ListItemText>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      align="right"
                      secondary="09:30"
                    ></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem key="2">
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText
                      align="left"
                      primary="Hey, Iam Good! What about you ?"
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText align="left" secondary="09:31"></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem key="3">
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText
                      align="right"
                      primary="Cool. i am good, let's catch up!"
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      align="right"
                      secondary="10:30"
                    ></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
            <Divider />
          </Grid>
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={11}>
              <TextField id="outlined-message" label="Message" fullWidth />
            </Grid>
            <Grid xs={1} align="right">
              <Fab color="primary" aria-label="add">
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
export default ClinChat;
