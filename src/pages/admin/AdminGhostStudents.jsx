import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { useAdminGhostStudents } from "../../hooks/useAdminGhostStudents";

export default function AdminGhostStudents() {
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.admin);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, refetch } = useAdminGhostStudents(token);
  const [searchEmail, setSearchEmail] = useState("");

  const columns = [
    { id: "Name", label: t("name"), minWidth: 150 },
    { id: "Email", label: t("email"), minWidth: 150 },
    { id: "Gender", label: t("gender"), minWidth: 150 },
    { id: "Phone", label: t("phone"), minWidth: 150 },
    { id: "delete", label: t("delete"), minWidth: 150 },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/deleteStudent/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.ok) {
        enqueueSnackbar(t("Student Deleted Successfully"), {
          variant: "success",
          autoHideDuration: 4000,
        });
        refetch();
      } else {
        enqueueSnackbar(t("Failed to delete Student"), {
          variant: "error",
          autoHideDuration: 4000,
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(t("An error occurred while deleting Student"), {
        variant: "error",
        autoHideDuration: 4000,
      });
    }
  };

  useEffect(() => {
    if (!data) {
      refetch();
    }
  }, [data, refetch]);

  // فلترة حسب الإيميل
  const filteredData = data?.data?.filter((row) =>
    row.email?.toLowerCase().includes(searchEmail.toLowerCase())
  ) || [];

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
          {t("Ghost students")}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label={t("searchByEmail")}
          variant="outlined"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </Box>

      {!isLoading ? (
        <Paper sx={{ padding: "20px" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
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
                {filteredData.length > 0 ? (
                  filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow hover role="checkbox" key={row.id}>
                        <TableCell align="center">{row.name || ""}</TableCell>
                        <TableCell align="center">{row.email}</TableCell>
                        <TableCell align="center">{row.gender || ""}</TableCell>
                        <TableCell align="center">{row.phoneNumper || ""}</TableCell>
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
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {t("noResults")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredData.length}
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
