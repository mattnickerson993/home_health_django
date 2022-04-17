import {
  Button,
  Grow,
  Hidden,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { AuthContext } from "../context";
import { Navigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import ChevronRight from "@mui/icons-material/ChevronRight";

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
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
            <ChevronRight />
          </IconButton>

          <Typography variant="h6" sx={{ marginLeft: "1em" }}>
            Home Health
          </Typography>
          <Hidden only={["xs", "sm"]}>
            <Typography variant="h6" sx={{ marginLeft: "1em" }}>
              • Same Treatment | From Your Home
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
                onClick={handlelogout}
              >
                Logout
              </MenuItem>
            </Menu>
          </Hidden>
          <Hidden only={"xs"}>
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
