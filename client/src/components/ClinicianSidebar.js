import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import StarBorder from "@mui/icons-material/StarBorder";
import PeopleOutline from "@mui/icons-material/PeopleOutline";
import useAuthState from "../hooks/useAuthState";
import Navbar from "./Navbar";
import SideDrawer from "./SideDrawer";
import PatientAptSchedule from "./PatientAptSchedule";
import AvailablePatients from "./clinician/AvailablePatients";
import { Beenhere, Chat } from "@mui/icons-material";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function ClinicianSidebar({ isAuthenticated, userDetails }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const sideBarFields = [
    { text: "Available Patients", icon: <PeopleOutline /> },
    { text: "Active Appointments", icon: <StarBorder /> },
    { text: "Past Appointments", icon: <Beenhere /> },
    { text: "Chat", icon: <Chat /> },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar
        auth={isAuthenticated}
        open={open}
        handleOpen={handleDrawerOpen}
      />
      <SideDrawer
        open={open}
        handleOpen={handleDrawerOpen}
        handleClose={handleDrawerClose}
        sideBarFields={sideBarFields}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <AvailablePatients />
      </Box>
    </Box>
  );
}
