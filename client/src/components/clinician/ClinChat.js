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
import { ClinicianAptContext } from "../../context";

const ClinChat = () => {
  const {
    clinicianApts: { appointments },
  } = React.useContext(ClinicianAptContext);
  console.log("apts", appointments);
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
            <List sx={{ width: "100%" }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>H</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Brunch this weekend?"
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      9:30 pm
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>M</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Summer BBQ"
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      10:30am
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>W</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Oui Oui"
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      8:20pm
                    </Typography>
                  }
                />
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
