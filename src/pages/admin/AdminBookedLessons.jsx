import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading";
import { useAdminLessons } from "../../hooks/useAdminLessons";
import { useSelector } from "react-redux";
import Moment from "moment";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function AdminBookedLessons() {
  const { token } = useSelector((state) => state.admin);
  const { t } = useTranslation();
  const { data, isLoading } = useAdminLessons(token);
  console.log(data);
  
  const columns = [
    { id: "id", label: t("Invoice number"), minWidth: 150 },
    { id: "Name", label: t("teacher"), minWidth: 150 },
    { id: "Email", label: t("student"), minWidth: 150 },
    { id: "session_number", label: t("Session number"), minWidth: 150 },
    { id: "price", label: t("price"), minWidth: 150 },
    { id: "Phone", label: t("currency"), minWidth: 150 },
    { id: "bookingDate", label: t("bookingDate"), minWidth: 150 },
    { id: "payment", label: t("payment"), minWidth: 150 },
    { id: "Type", label: t("Type"), minWidth: 150 },
    { id: "confirm", label: t("Confirm Payment"), minWidth: 150 },
    { id: "actions", label: t("actions"), minWidth: 150 },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

    const printPDF = (session) => {
        navigate(`/invoice-admin/${session.id}/${session.createdAt}/${session.Student?.name}/${session.Student?.email}/${session.Student?.phoneNumber}/${session.Teacher?.firstName}/${session.Teacher?.lastName}/${session.Teacher?.phone}/${session.Teacher?.email}/${session.price}/${session.currency}`)
    };


  return (
    <AdminLayout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          marginTop: "20px",
        }}
      >
        <Typography sx={{ fontSize: "20px", fontWeight: "500" }}>
          {t("Booking")}
        </Typography>
      </Box>
      {!isLoading ? (
        <Paper sx={{ width: "100%", padding: "20px" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <TextField
              sx={{ m: 1, width: "90%" }}
              label={t("search")}
              variant="outlined"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Table stickyHeader aria-label="sticky table">
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={"center"}
                    style={{ top: 57, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
              <TableBody>
                {data?.data.length > 0 &&
                  data?.data
                    .filter(
                      (row) =>
                        `${row.Teacher?.firstName +
                          " " +
                          row.Teacher?.lastName || t("username")
                          }`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim()) ||
                        `${row.Student?.name || t("username")}`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim()) ||
                        `${row?.totalPrice || ""}`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim()) ||
                        `${row.currency || ""}`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim()) ||
                        `${Moment(row.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        ) || ""
                          }`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim()) ||
                        `${t(row?.typeOfPayment) || ""}`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim()) ||
                        `${t(row?.type) || ""}`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim())
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          sx={{ cursor: "pointer" }}
                          hover
                          key={row.id + "demj"}
                          // onClick={() =>
                          //   navigate(`/admin/booked-lesson/${row.id}`)
                          // }
                        >
                          <TableCell align="center" >
                            NIV-{row.id}
                          </TableCell  >
                          <TableCell align="center" onClick={() =>
                            navigate(`/admin/booked-lesson/${row.id}`)
                          }>
                            {row.Teacher?.firstName +
                              " " +
                              row.Teacher?.lastName || t("username")}
                          </TableCell  >
                          <TableCell align="center" onClick={() =>
                            navigate(`/admin/booked-lesson/${row.id}`)
                          }>
                            {row.Student?.name || t("username")}
                          </TableCell >
                          <TableCell align="center">
                            {row?.period}
                          </TableCell>
                          <TableCell align="center">
                            {row?.totalPrice}
                          </TableCell>
                          <TableCell align="center">{row?.currency}</TableCell>
                          <TableCell align="center">
                            {Moment(row.createdAt).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {t(row?.typeOfPayment)}
                          </TableCell>
                          <TableCell align="center">
                            {t(row?.type)}
                          </TableCell>
                          <TableCell align="center">
                            {row?.isPaid ? t("confirmed") : t("pending")}
                          </TableCell>
                          <TableCell align="center">
                            <div className="flex space-x-2 justify-between">
                              <Button
                                onClick={() => printPDF(row)}
                                className="bg-green-500 text-white w-28 py-2 rounded"
                                variant="outlined"
                              >
                                {t("open")}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={data?.data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Loading />
      )}
    </AdminLayout>
  );
}
