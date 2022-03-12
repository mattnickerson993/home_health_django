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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import useAuthState from "../hooks/useAuthState";
import Navbar from "./Navbar";
import SideDrawer from "./Drawer";
import PatientAptSchedule from "./PatientAptSchedule";
import { toast, ToastContainer } from "react-toastify";

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const notify = () => {
    toast("🦄 Wow so easy!");
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
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <PatientAptSchedule userDetails={userDetails} />
        </Box>
      </Box>
    </>
  );
}
