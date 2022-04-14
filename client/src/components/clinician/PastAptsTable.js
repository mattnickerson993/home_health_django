import React from "react";
import {
  Paper,
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
  Typography,
} from "@mui/material";

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
            <Toolbar
              sx={{
                paddingLeft: (theme) => theme.spacing(2),
                paddingRight: (theme) => theme.spacing(1),
                marginTop: (theme) => theme.spacing(2),
              }}
            >
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h6"
                id="tableTitle"
                component="div"
              >
                {"Past Appointments"}
              </Typography>
            </Toolbar>
            <Table sx={{ minWidth: 500 }} aria-label="paginated table">
              <TableHead
                sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
              >
                <TableRow hover>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "last_name"}
                      direction={orderBy === "last_name" ? order : "asc"}
                      onClick={createSortHandler("last_name")}
                    >
                      Patient Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "email"}
                      direction={orderBy === "email" ? order : "asc"}
                      onClick={createSortHandler("email")}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "start_time"}
                      direction={orderBy === "start_time" ? order : "asc"}
                      onClick={createSortHandler("start_time")}
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
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(apts, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((appointment) => (
                    <TableRow hover key={appointment.id}>
                      <TableCell component="th" scope="row">
                        {`${appointment.patient.last_name}, ${appointment.patient.first_name} `}
                      </TableCell>
                      <TableCell scope="row">
                        {`${appointment.patient.email}`}
                      </TableCell>
                      <TableCell>{`${
                        appointment.start_time
                          ? new Date(
                              appointment.start_time
                            ).toLocaleDateString()
                          : new Date(
                              appointment.canceled_at
                            ).toLocaleDateString()
                      }`}</TableCell>
                      <TableCell>{`${
                        appointment.start_time
                          ? new Date(appointment.start_time).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )
                          : new Date(
                              appointment.canceled_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                      }`}</TableCell>
                      <TableCell>{appointment.status}</TableCell>
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
                    colSpan={5}
                    count={apts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
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
