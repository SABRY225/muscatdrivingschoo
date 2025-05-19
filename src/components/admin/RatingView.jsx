import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Dialog ,Avatar  } from "@mui/material";
import { useTranslation } from "react-i18next";
import Loading from "../Loading";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import { useRates } from "../../hooks/useRates";

export default function RatingView() {
  const { t } = useTranslation();

  const columns = [
    { id: "comment",         label: t("comment"),       minWidth: 100 },
    { id: "rating",          label: t("rating"),        minWidth: 150 },
    { id: "teacher_name",    label: t("teacher_name"),  minWidth: 150 },
    { id: "student_name",    label: t("student_name"),  minWidth: 150 },
    { id: "delete",          label: t("actions"),       minWidth: 50 },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { data, isLoading }     = useRates();
  const [RatesList, setRates] = useState([]);

  const { token } = useSelector((state) => state.admin);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { lang } = Cookies.get("i18next") || "en";

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (data?.data) {
      console.log(data);

      setRates(data.data);
    }
  }, [data]);

  /** handle open dialog */
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // Added by eng.reem.shwky@gmail.com
  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/deleteRates/${id}`,
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
        setRates(RatesList.filter((c) => c.id !== id));
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    } catch (err) {
      console.log("error: ", err);
      enqueueSnackbar(t("somethingWentWrong"), { variant: "error" });
    }
  };
  return (
    <Box>
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
                {RatesList
                  ?.filter(
                    (row) =>
                      `${row.comment || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim()) ||
                      `${row.rating || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" key={row.id + "demj"}>
                        <TableCell align="center">{row.comment}</TableCell>
                        <TableCell align="center">{row.rating} </TableCell>
                        <TableCell align="center">{row.Teacher?.firstName}</TableCell>
                        <TableCell align="center">{row.Student?.name}</TableCell>
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
            count={RatesList?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Loading />
      )}
    </Box>
  );
}
