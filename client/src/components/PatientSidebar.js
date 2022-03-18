import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import SideDrawer from "./SideDrawer";
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
