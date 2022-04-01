import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function DistanceCard({ miles, duration }) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Travel Details
        </Typography>
        <Typography sx={{ mb: 1.5 }} variant="h5" component="div">
          {`Distance to go: ${miles} miles`}
        </Typography>
        <Typography sx={{ mb: 1.5 }} variant="h5" color="text.secondary">
          {`Time remaining: ${duration}`}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Mark as Arrived</Button>
      </CardActions>
    </Card>
  );
}
