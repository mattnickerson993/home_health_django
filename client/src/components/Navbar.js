import {
  Avatar,
  Button,
  Grow,
  Hidden,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import InfoIcon from "@mui/icons-material/Info";
import ArchiveIcon from "@mui/icons-material/Archive";
import { AuthContext } from "../context";
import { Navigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";

const drawerWidth = 240;

const MyAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Navbar = ({ auth, open, handleOpen }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { dispatch } = React.useContext(AuthContext);
  const [loggedIn, setLoggedIn] = React.useState(auth ? true : false);
  const theme = useTheme();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  function handleDropMenuClick(path) {
    return;
  }
  function handlelogout() {
    dispatch({
      type: "LOGOUT",
    });
    setLoggedIn(false);
  }
  if (!loggedIn) {
    return <Navigate to="login" />;
  }

  return (
    <MyAppBar position="fixed" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleOpen}
            edge="start"
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ marginLeft: "1em" }}>
            Home Health
          </Typography>
          <Hidden only={["xs", "sm"]}>
            <Typography variant="h6" sx={{ marginLeft: "1em" }}>
              • Questions Answered | Patient Satisfied
            </Typography>
          </Hidden>
        </div>
        <div>
          <Hidden only={["sm", "md", "lg", "xl"]}>
            <IconButton onClick={handleClick}>
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu"
              anchorEl={anchorEl}
              keepMounted
              TransitionComponent={Grow}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PopoverClasses={{
                paper: {
                  width: "50%",
                },
              }}
            >
              <MenuItem
                sx={{
                  root: {
                    justifyContent: "center",
                  },
                }}
                onClick={() => handleDropMenuClick("/about/")}
              >
                About
              </MenuItem>
              <MenuItem
                sx={{
                  root: {
                    justifyContent: "center",
                  },
                }}
                onClick={() => handleDropMenuClick("/archive/")}
              >
                Archive
              </MenuItem>
              <MenuItem
                sx={{
                  root: {
                    justifyContent: "center",
                  },
                }}
                onClick={handlelogout}
              >
                Logout
              </MenuItem>
            </Menu>
          </Hidden>
          <Hidden only={"xs"}>
            <Tooltip title="About">
              <IconButton onClick={() => console.log("complete me")}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Archives">
              <IconButton
                sx={{ marginRight: "1em" }}
                onClick={() => console.log("complete me")}
              >
                <ArchiveIcon />
              </IconButton>
            </Tooltip>
            {auth ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={handlelogout}
              >
                Logout
              </Button>
            ) : (
              <Link
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                }}
                to="/login/"
              >
                <Button variant="contained" color="secondary">
                  Login
                </Button>
              </Link>
            )}
          </Hidden>
        </div>
      </Toolbar>
    </MyAppBar>
  );
};

export default Navbar;
