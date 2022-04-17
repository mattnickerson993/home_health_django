import React from "react";
import { Link, Navigate } from "react-router-dom";
import { api } from "../api";
import axios from "axios";
import isEmail from "validator/lib/isEmail";
import { useForm, Controller } from "react-hook-form";
import SEO from "../components/Seo";
// import { useSignUpStyles } from '../styles'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { headers } from "../config/config";
import { errorIcon, validIcon } from "../components/Icons";
import { Message } from "../components/Message";

const SignUp = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [accountCreated, setAccountCreated] = React.useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, touchedFields, isValid },
  } = useForm({ mode: "onBlur" });

  async function onSubmit(data) {
    setLoading(true);
    setError("");
    const {
      email,
      firstname,
      lastname,
      photo,
      group,
      password,
      confirmpassword,
    } = data;
    try {
      if (password !== confirmpassword) {
        setError("Passwords must match");
        return;
      }
      const formData = new FormData();
      formData.append("email", email);
      formData.append("first_name", firstname);
      formData.append("last_name", lastname);
      formData.append("password1", password);
      formData.append("password2", confirmpassword);
      formData.append("group", group);
      formData.append("photo", photo[0]);

      const res = await axios.post(api.auth.register, formData, headers);
      if (res.status !== 201) {
        setLoading(false);
        return;
      }
      setAccountCreated(true);
    } catch (err) {
      let message;
      if (err.response.data.email) {
        message = err.response.data.email.map((item) => item).join("");
      } else if (err.response.data.password) {
        message = err.response.data.password.map((item) => item).join("");
      } else {
        message = err.response.statusText;
      }
      setError(message);
      setLoading(false);
    }
  }

  if (accountCreated) {
    return <Navigate to="/login/" />;
  }

  return (
    <>
      <SEO title="Sign Up" />
      <Box
        sx={{
          margin: "auto",
          width: "70%",
          marginTop: (theme) => theme.spacing(4),
        }}
      >
        <article>
          <Card>
            <CardContent>
              <Typography variant="h2">Please Sign Up Below</Typography>
              <form onSubmit={handleSubmit(onSubmit)} action="">
                <TextField
                  name="email"
                  {...register("email", {
                    required: true,
                    minLength: 2,
                    maxLength: 30,
                    validate: (input) => isEmail(input),
                  })}
                  InputProps={{
                    endAdornment: errors.email
                      ? errorIcon
                      : touchedFields.email && validIcon,
                  }}
                  fullWidth
                  variant="filled"
                  label="Email"
                  margin="dense"
                  autoComplete="email"
                />
                <TextField
                  name="firstname"
                  {...register("firstname", {
                    required: true,
                    minLength: 2,
                    maxLength: 30,
                  })}
                  InputProps={{
                    endAdornment: errors.firstname
                      ? errorIcon
                      : touchedFields.firstname && validIcon,
                  }}
                  fullWidth
                  variant="filled"
                  label="First Name"
                  margin="dense"
                  autoComplete="firstname"
                />
                <TextField
                  name="lastname"
                  {...register("lastname", {
                    required: true,
                    minLength: 5,
                    maxLength: 30,
                  })}
                  InputProps={{
                    endAdornment: errors.lastname
                      ? errorIcon
                      : touchedFields.lastname && validIcon,
                  }}
                  fullWidth
                  variant="filled"
                  label="Last Name"
                  margin="dense"
                  autoComplete="lastname"
                />
                <Controller
                  control={control}
                  name={"group"}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                    formState,
                  }) => (
                    <FormControl
                      margin="dense"
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "50%",
                          xl: "60%",
                        },
                      }}
                      error={error}
                      color={"success"}
                    >
                      <InputLabel id="group-select-label">
                        Select Group
                      </InputLabel>
                      <Select onChange={onChange} value={value} onBlur={onBlur}>
                        <MenuItem value={"patient"}>Patient</MenuItem>
                        <MenuItem value={"clinician"}>Clinician</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <Fab
                  color="secondary"
                  size="small"
                  aria-label="add"
                  component="span"
                  variant="extended"
                  sx={{ margin: (theme) => theme.spacing(3) }}
                >
                  <input
                    name="photo"
                    type="file"
                    {...register("photo", {
                      required: true,
                    })}
                  />
                </Fab>

                <TextField
                  name="password"
                  {...register("password", {
                    required: true,
                    minLength: 5,
                  })}
                  InputProps={{
                    endAdornment: errors.password
                      ? errorIcon
                      : touchedFields.password && validIcon,
                  }}
                  fullWidth
                  variant="filled"
                  label="Password"
                  type="password"
                  margin="dense"
                  autoComplete="current-password"
                />
                <TextField
                  name="confirmpassword"
                  {...register("confirmpassword", {
                    required: true,
                    minLength: 5,
                  })}
                  InputProps={{
                    endAdornment: errors.confirmpassword
                      ? errorIcon
                      : touchedFields.confirmpassword && validIcon,
                  }}
                  fullWidth
                  variant="filled"
                  label="Confirm Password"
                  type="password"
                  margin="dense"
                  autoComplete="current-password-confirm"
                />
                <Button
                  disabled={!isValid || isSubmitting}
                  variant="contained"
                  fullWidth
                  color="primary"
                  type="submit"
                  endIcon={loading && <CircularProgress />}
                >
                  Sign up
                </Button>
              </form>
              {error && (
                <Box sx={{ marginTop: (theme) => theme.spacing(2) }}>
                  <Message severity={"error"} message={error} />
                </Box>
              )}
            </CardContent>
          </Card>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                margin: (theme) => theme.spacing(1),
                textDecoration: "none",
              }}
              variant="body2"
            >
              Already have an account?
            </Typography>
            <Box
              sx={{
                margin: (theme) => theme.spacing(1),
              }}
            >
              <Link
                styles={{
                  textDecoration: "none",
                }}
                to="/login"
              >
                <Button color="primary">Login</Button>
              </Link>
            </Box>
          </Card>
        </article>
      </Box>
    </>
  );
};

export default SignUp;
