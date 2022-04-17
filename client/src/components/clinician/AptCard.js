import { Avatar, Card, CardHeader, IconButton, Tooltip } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { red } from "@mui/material/colors";
import { clinBookApt } from "../../services/AptService";

const AptCard = ({ apt }) => {
  const { id: apt_id, patient, patient_address } = apt;

  async function bookApt(apt_id) {
    await clinBookApt(apt_id);
  }

  return (
    <>
      <Card sx={{ maxWidth: 600, minWidth: 275 }}>
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: red[500] }}
              aria-label="headshot"
              src={patient.photo}
            >
              R
            </Avatar>
          }
          action={
            <Tooltip title="Book Appointment" arrow>
              <IconButton onClick={() => bookApt(apt_id)} aria-label="settings">
                <AddIcon />
              </IconButton>
            </Tooltip>
          }
          title={`${patient.first_name} ${patient.last_name}`}
          subheader={`${patient_address}`}
        />
      </Card>
    </>
  );
};

export default AptCard;
