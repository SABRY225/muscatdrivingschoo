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
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
// Added by Abdelwahab
import EmailIcon from "@mui/icons-material/Email";
import TextField from "@mui/material/TextField";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import DoDisturbOffIcon from "@mui/icons-material/DoDisturbOff";
import BuildIcon from "@mui/icons-material/Build";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import Cookies from "js-cookie";

export default function AdminTeachers() {
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
    { id: "Gender", label: t("gender"), minWidth: 150 },
    { id: "Phone", label: t("phone"), minWidth: 150 },
    { id: "View", label: t("view"), minWidth: 150 },
    // Added by Abdelwahab
    { id: "financialRecord", label: t("financialRecord"), minWidth: 150 },
    { id: "message", label: t("instant_messaging"), minWidth: 150 },
    { id: "edit", label: t("update"), minWidth: 150 },
    { id: "suspend", label: t("actions"), minWidth: 150 },
    { id: "delete", label: t("delete"), minWidth: 150 },
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

  async function handleDownloadFile() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/allTeachersPDF`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  }

  const handleDelete = (id) => {
    try {
      fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/deleteTeacher/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );
      closeSnackbar();
      enqueueSnackbar("Teacher Deleted Successfully", {
        variant: "warning",
        autoHideDuration: 4000,
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // Added by Abdelwahab
 const handleCreateMessage = async (teacher) => {
    const addFrind=(async () => {
      await fetch(`${process.env.REACT_APP_API_KEY}api/v1/chat/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({
          user1Id: teacher?.id, user1Type:"teacher", user2Id:1, user2Type:"admin"
        })
      });
    })
    addFrind();
    navigate(`/admin/messages`);
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
          {t("teachers")}
        </Typography>
        <Button variant="contained" onClick={handleDownloadFile}>
          {t("download")}
        </Button>
      </Box>

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
                            {row.gender || ""}
                          </TableCell>
                          <TableCell align="center">
                            {row.phone || ""}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              color="secondary"
                              onClick={() =>
                                navigate(`/admin/teacher/${row.id}`)
                              }
                            >
                              <VisibilityIcon />
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() =>
                                navigate(`/admin/teacher/${row.id}/dues`)
                              }
                              sx={{ minWidth: "10px" }}
                            >
                              <LocalAtmIcon />
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              color="success"
                              onClick={() => handleCreateMessage(row)}
                            >
                              <EmailIcon />
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() =>
                                navigate("/admin/edit/teacher/" + row.id)
                              }
                              sx={{ minWidth: "10px" }}
                              color="info"
                            >
                              <BuildIcon />
                            </Button>
                          </TableCell>

                          <TableCell align="center">
                            {row.isSuspended ? (
                              <Button
                                onClick={() => handleUnSuspend(row.id)}
                                sx={{ minWidth: "10px" }}
                                color="warning"
                                title={t("unsuspend")}
                              >
                                <DoDisturbOffIcon />
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleSuspend(row.id)}
                                sx={{ minWidth: "10px" }}
                                color="error"
                                title={t("suspend")}
                              >
                                <DoDisturbOnIcon />
                              </Button>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              onClick={() => handleDelete(row.id)}
                              sx={{ minWidth: "10px" }}
                              color="error"
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
      <Box sx={{ marginY: 5 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/admin/new/teacher")}
          sx={{ fontSize: 20 }}
        >
          {t("create_new_account")}
        </Button>
      </Box>
    </AdminLayout>
  );
}
