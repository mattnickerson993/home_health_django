import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function PatientDistanceCard({ miles, duration }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Arrival Details
        </Typography>
        <Typography sx={{ mb: 1.5 }} variant="h5" component="div">
          {`Clinician is : ${miles} miles away`}
        </Typography>
        <Typography sx={{ mb: 1.5 }} variant="h5" color="text.secondary">
          {`Estimated arrival: ${duration} from now`}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Mark as Arrived</Button>
      </CardActions>
    </Card>
  );
}
