import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import SideDrawer from "./SideDrawer";
import { Outlet } from "react-router-dom";
import { Beenhere, Chat } from "@mui/icons-material";
import StarBorder from "@mui/icons-material/StarBorder";
import PeopleOutline from "@mui/icons-material/PeopleOutline";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
export default function PatientSidebar({ isAuthenticated, userDetails }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const sideBarFields = [
    { text: "Schedule Appointment", icon: <PeopleOutline /> },
    { text: "My Appointments", icon: <StarBorder /> },
    { text: "My Past Appointments", icon: <Beenhere /> },
    { text: "Patient Chat", icon: <Chat /> },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
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
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
