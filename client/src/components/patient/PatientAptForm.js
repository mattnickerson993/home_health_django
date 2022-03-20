import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { errorIcon, validIcon } from "../Icons";
import { useForm } from "react-hook-form";
import { createApt } from "../../services/AptService";

const PatientAptForm = ({ setForm, patientId }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, touchedFields, isValid },
  } = useForm({ mode: "onBlur" });

  async function onSubmit(data) {
    setLoading(true);
    setError("");
    const { patient_address } = data;
    const formData = {
      patient_address,
      patient: patientId,
    };
    createApt(formData);
    setTimeout(() => {
      setLoading(false);
      setForm(false);
    }, 2000);
  }
  return (
    <article>
      <Card>
        <CardContent>
          <Typography variant="h4">
            Please enter the address you want to receive treatment at below
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} action="">
            <TextField
              name="patient_address"
              {...register("patient_address", {
                required: true,
                minLength: 2,
                maxLength: 255,
              })}
              InputProps={{
                endAdornment: errors.patient_address
                  ? errorIcon
                  : touchedFields.patient_address && validIcon,
              }}
              fullWidth
              variant="filled"
              label="Address"
              margin="dense"
              autoComplete="address"
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
        </CardContent>
      </Card>
    </article>
  );
};

export default PatientAptForm;
