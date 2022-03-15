import { Avatar, Card, CardHeader, IconButton, Tooltip } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { red } from "@mui/material/colors";
import { clinBookApt } from "../../services/AptService";
import { ClinicianAptContext } from "../../context";

const AptCard = ({ apt }) => {
  const { id: apt_id, patient, patient_address } = apt;
  const { dispatchClinicianApts } = React.useContext(ClinicianAptContext);

  async function bookApt(apt_id) {
    await clinBookApt(apt_id);
    dispatchClinicianApts({
      type: "REMOVE_APPOINTMENT",
      payload: { id: apt_id },
    });
  }

  return (
    <>
      <Card sx={{ maxWidth: 600 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
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
