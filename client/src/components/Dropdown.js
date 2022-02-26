import React from "react";
import { FormControl, InputAdornment, InputLabel, MenuItem, Select } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { HighlightOff } from "@mui/icons-material";
import { errorIcon, validIcon } from "./Icons";


const options = [
  {
    label: "Patient",
    value: "patient",
  },
  {
    label: "Clinician",
    value: "clinician",
  },
];


export const FormInputDropdown= ({name, control, label, errors, touchedFields}) => {

  const generateSelectOptions = () => {
    return options.map((option) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      );
    });
  };


  return <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{ required: true }}
      render={({ 
          field: { onChange, onBlur, value },
          fieldState: { error }
        }) => (
        <Select 
            onChange={onChange} 
            value={value}
            >
            {console.log('errors', errors)} 
            {console.log('touched fields', touchedFields)}
          {generateSelectOptions()}
        </Select>
      )}
    />
};