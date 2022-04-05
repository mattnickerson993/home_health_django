import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ArchiveIcon from "@mui/icons-material/Archive";

import {
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { getClinApts, getClinPastApts } from "../../services/AptService";
import { Box } from "@mui/system";
import TablePaginationActions from "../TablePaginationActions";

const PastAptsTable = ({ apts }) => {
  const [open, setOpen] = React.useState(false);
  const [idTracker, setIdTracker] = React.useState(0);

  // styles and theme
  // sorting
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("last_name");
  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, apts.length - page * rowsPerPage);

  // sorting functions
  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  // pagination functions

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {apts && (
        <>
          <TableContainer component={Paper}>
            <Toolbar className={""}>
              <Typography
                className={""}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                {"Past Appointments"}
              </Typography>
            </Toolbar>
            <Table className={""} aria-label="simple table">
              <TableHead style={{}}>
                <TableRow hover>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "last_name"}
                      direction={orderBy === "last_name" ? order : "asc"}
                      onClick={createSortHandler("last_name")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "date_time"}
                      direction={orderBy === "date_time" ? order : "asc"}
                      onClick={createSortHandler("date_time")}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "status"}
                      direction={orderBy === "status" ? order : "asc"}
                      onClick={createSortHandler("status")}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Archive/Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(apts, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((appointment) => (
                    <TableRow hover key={appointment.id}>
                      <TableCell component="th" scope="row">
                        {`${appointment.last_name}, ${appointment.first_name} `}
                      </TableCell>
                      <TableCell>{`${new Date(
                        appointment.date_time
                      ).toLocaleDateString()}`}</TableCell>
                      <TableCell>{`${new Date(
                        appointment.date_time
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}`}</TableCell>
                      <TableCell>{appointment.status}</TableCell>
                      <TableCell>
                        {appointment.status === "Pending" && (
                          <Button variant="contained" color="primary">
                            Send Email
                          </Button>
                        )}
                        {appointment.status === "Sent" && (
                          <Chip avatar={<EmailIcon />} label="Email Sent" />
                        )}
                        {appointment.status === "Confirmed" && (
                          <Link
                            to={`/appointments/detail/${appointment.id}/`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <Button variant="contained" color="secondary">
                              View Details
                            </Button>
                          </Link>
                        )}
                        {appointment.status === "Complete" && (
                          <Chip
                            color="secondary"
                            icon={<CheckCircleIcon />}
                            label="Completed"
                          />
                        )}
                        {appointment.status === "Feedback" && (
                          <Link
                            to={`/appointments/doctor/review/${appointment.id}/`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            <Button
                              color="primary"
                              endIcon={<FeedbackIcon />}
                              variant="contained"
                            >
                              {" "}
                              View Feedback
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                      <TableCell>
                        {appointment.status === "Feedback" ? (
                          <Tooltip title="Archive">
                            <IconButton
                              onClick={() => {
                                setIdTracker(appointment.id);
                                setOpen(true);
                              }}
                              className={""}
                            >
                              <ArchiveIcon></ArchiveIcon>
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => {
                                setIdTracker(appointment.id);
                                setOpen(true);
                              }}
                              className={""}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={6}
                    count={apts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default PastAptsTable;
