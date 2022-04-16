import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { api } from "../api";
import axios from "axios";
import { headers } from "../config/config";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context";
import { Card } from "@mui/material";

export default function LogIn() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { state, dispatch } = React.useContext(AuthContext);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const res = await axios.post(
      api.auth.login,
      JSON.stringify({
        email: data.get("email"),
        password: data.get("password"),
      }),
      headers
    );
    console.log(res, res.status);

    if (res.status !== 200) {
      console.log("error");
      setLoading(false);
      return;
    }
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: res.data,
    });
    setLoggedIn(true);
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: 100,
              alignItems: "center",
              justifyContent: "center",
              minWidth: 345,
            }}
          >
            <Typography
              sx={{
                margin: (theme) => theme.spacing(1),
                textDecoration: "none",
              }}
              variant="body2"
            >
              Need an account?
            </Typography>
            <Link
              styles={{
                textDecoration: "none",
              }}
              to="/register"
            >
              <Button color="primary">Register</Button>
            </Link>
          </Card>
        </Box>
      </Container>
    </>
  );
}
