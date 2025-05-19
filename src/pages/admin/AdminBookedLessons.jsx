import { useState  , useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Typography , Button} from "@mui/material";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading";
import { useAdminLessons } from "../../hooks/useAdminLessons";
import { useSelector } from "react-redux";
import Moment from "moment";
import TextField from "@mui/material/TextField";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AdminBookedLessons() {
  const { token } = useSelector((state) => state.admin);
  const { t } = useTranslation();
  const { data, isLoading } = useAdminLessons(token);
  const [BookedLessons, setBookedLessons] = useState([]);
  const { lang } = Cookies.get("i18next") || "en";
  const columns = [
    { id: "Name", label: t("teacher"), minWidth: 150 },
    { id: "Email", label: t("student"), minWidth: 150 },
    { id: "price", label: t("price"), minWidth: 150 },
    { id: "Phone", label: t("currency"), minWidth: 150 },
    { id: "bookingDate", label: t("bookingDate"), minWidth: 150 },
    { id: "payment", label: t("payment"), minWidth: 150 },
    { id: "where", label: t("where"), minWidth: 150 },
    { id: "confirmTeacher", label: t("confirmTeacher"), minWidth: 150 },
    { id: "confirmStudent", label: t("confirmStudent"), minWidth: 150 },
    { id: "delete", label: t("delete"), minWidth: 50 },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (data?.data) {
      setBookedLessons(data.data);
    }
  }, [data]);

  // Added by eng.reem.shwky@gmail.com
  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/sessions/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (res.ok) {
        const json = await res.json();
        if (lang === "en") {
          enqueueSnackbar(json.msg.english, { variant: "success" });
        } else {
          enqueueSnackbar(json.msg.arabic, { variant: "success" });
        }
        setBookedLessons(BookedLessons.filter((c) => c.id !== id));
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    } catch (err) {
      console.log("error: ", err);
      enqueueSnackbar(t("somethingWentWrong"), { variant: "error" });
    }
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
          {t("bookedLessons")}
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
                {BookedLessons.length > 0 &&
                  BookedLessons
                    .filter(
                      (row) =>
                        `${
                          row.Teacher?.firstName +
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
                        `${
                          Moment(row.createdAt).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          ) || ""
                        }`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim()) ||
                        `${t(row?.typeOfPayment) || ""}`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim()) ||
                        `${t(row?.type + "_place") || ""}`
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
                        >
                          <TableCell align="center" onClick={() =>
                            navigate(`/admin/booked-lesson/${row.id}`)
                          }>
                            {row.Teacher?.firstName +
                              " " +
                              row.Teacher?.lastName || t("username")}
                          </TableCell>
                          <TableCell align="center" onClick={() =>
                            navigate(`/admin/booked-lesson/${row.id}`)
                          }>
                            {row.Student?.name || t("username")}
                          </TableCell>
                          <TableCell align="center" onClick={() =>
                            navigate(`/admin/booked-lesson/${row.id}`)
                          }>
                            {row?.totalPrice}
                          </TableCell>
                          <TableCell align="center" onClick={() =>
                            navigate(`/admin/booked-lesson/${row.id}`)
                          }>{row?.currency}</TableCell>
                          <TableCell align="center">
                            {Moment(row.createdAt).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}
                          </TableCell>
                          <TableCell align="center" onClick={() =>
                            navigate(`/admin/booked-lesson/${row.id}`)
                          }>
                            {t(row?.typeOfPayment)}
                          </TableCell>
                          <TableCell align="center" onClick={() =>
                            navigate(`/admin/booked-lesson/${row.id}`)
                          }>
                            {t(row?.type + "_place")}
                          </TableCell>
                          <TableCell align="center" onClick={() =>
                            navigate(`/admin/booked-lesson/${row.id}`)
                          }>
                            {row?.teacherAccept ? t("confirmed") : t("pending")}
                          </TableCell>
                          <TableCell align="center" onClick={() =>
                            navigate(`/admin/booked-lesson/${row.id}`)
                          }>
                            {row?.studentAccept ? t("confirmed") : t("pending")}
                          </TableCell>
                          <TableCell align="center">
                          <Button
                            color="error"
                            onClick={() => handleDelete(row.id)}
                          >
                            <DeleteIcon />
                          </Button>
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
            count={BookedLessons.length}
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
