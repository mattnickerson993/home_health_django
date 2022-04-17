import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const navMap = {
  "Available Patients": "/",
  "Active Appointments": "/clinician_active_apts",
  "Past Appointments": "/clinician_past_apts",
  Chat: "/clinician_chat",
  "Schedule Appointment": "/",
  "My Appointments": "/patient_my_apts",
  "My Past Appointments": "/patient_my_past_apts",
  "Patient Chat": "patient_chat",
};

const SideDrawer = ({ open, handleClose, sideBarFields }) => {
  const theme = useTheme();
  const [active, setActive] = React.useState();
  let navigate = useNavigate();
  function handleClick(text) {
    setActive(text);
    const loc = navMap[text];
    navigate(`${loc}`);
  }

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {sideBarFields.map((field, index) =>
          field.text === active ? (
            <ListItemButton
              onClick={() => handleClick(field.text)}
              selected
              button
              key={field.text}
            >
              <ListItemIcon>{field.icon}</ListItemIcon>
              <ListItemText primary={field.text} />
            </ListItemButton>
          ) : (
            <ListItemButton
              onClick={() => handleClick(field.text)}
              button
              key={field.text}
            >
              <ListItemIcon>{field.icon}</ListItemIcon>
              <ListItemText primary={field.text} />
            </ListItemButton>
          )
        )}
      </List>
      <Divider />
    </Drawer>
  );
};

export default SideDrawer;
