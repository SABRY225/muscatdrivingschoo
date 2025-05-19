import React, { useState } from "react";
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
import { useSelector } from "react-redux";
import { useAdminTeachers } from "../../hooks/useAdminTeachers";
import LocalAtmIcon     from "@mui/icons-material/LocalAtm";
import { useNavigate }  from "react-router-dom";
import VisibilityIcon   from "@mui/icons-material/Visibility";
import DeleteIcon       from "@mui/icons-material/Delete";
import { useSnackbar }  from "notistack";
import EmailIcon        from "@mui/icons-material/Email";
import TextField        from "@mui/material/TextField";
import DoDisturbOnIcon  from "@mui/icons-material/DoDisturbOn";
import DoDisturbOffIcon from "@mui/icons-material/DoDisturbOff";
import BuildIcon        from "@mui/icons-material/Build";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import Cookies from "js-cookie";

export default function AdminTeachersAccount() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.admin);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const { lang } = Cookies.get("i18next") || "en";

  const columns = [
    { id: "",       label: t(""), minWidth: 10 },
    { id: "Name",   label: t("name"), minWidth: 150 },
    { id: "Email",  label: t("email"), minWidth: 150 },
    { id: "Phone",  label: t("phone"), minWidth: 150 },
    { id: "financialRecord", label: t("financialRecord"), minWidth: 150 },
  ];
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useAdminTeachers(token);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSuspend = async (id) => {
    closeSnackbar();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/suspend/teacher/${id}`,
        {
          method: "GET",
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
        window.location.reload();
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    } catch (err) {
      console.log("error: ", err);
      enqueueSnackbar(t("somethingWentWrong"), { variant: "error" });
    }
  };

  const handleUnSuspend = async (id) => {
    closeSnackbar();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/unsuspend/teacher/${id}`,
        {
          method: "GET",
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
        window.location.reload();
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

      {!isLoading ? (
        <Paper sx={{ width: "100%", padding: "20px" }}>
          <TableContainer
            sx={{
              maxHeight: 440,
            }}
          >
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
                  data.data
                    .filter(
                      (row) =>
                        `${row.firstName + " " + row.lastName || ""}`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim()) ||
                        `${row.email || ""}`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim()) ||
                        `${row.gender || ""}`
                          .toLowerCase()
                          .startsWith(searchInput.toLowerCase().trim()) ||
                        `${row.phone || ""}`
                          .toLowerCase()
                          .includes(searchInput.toLowerCase().trim())
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow hover role="checkbox" key={row.id + "demj"}>
                          <TableCell align="center">

{row?.isOnline =="1" ?
 <svg width="15" height="15">
    <circle r="5" cx="10" cy="10" fill="#F0CE01" stroke="lightgrey" stroke-width="1" stroke-dasharray="439.8" stroke-dashoffset="0"></circle>
  </svg>
  : 
  <svg width="15" height="15">
    <circle r="5" cx="10" cy="10" fill="#888" stroke="lightgrey" stroke-width="1" stroke-dasharray="439.8" stroke-dashoffset="0"></circle>
  </svg>
}
</TableCell>
                          <TableCell align="center">
                            {row.firstName + " " + row.lastName || ""}
                          </TableCell>
                          <TableCell align="center">{row.email}</TableCell>
                          <TableCell align="center">
                            {row.phone || ""}
                          </TableCell>
                          <TableCell align="center">
                            <Button onClick={() => navigate(`/admin/teacher/${row.id}/dues`) }
                              sx={{ minWidth: "10px" }}>
                            {t("view_account_statement")}
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
