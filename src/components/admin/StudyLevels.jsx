import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Dialog } from "@mui/material";
import { useLevels } from "../../hooks/useLevels";
import Loading from "../../components/Loading";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import UpdateStudyLevel from "./UpdateStudyLevel";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";

export default function StudyLevels() {
  const { t } = useTranslation();
  const columns = [
    { id: "name_course", label: t("titleAr"), minWidth: 150 },
    { id: "name_subject", label: t("titleEn"), minWidth: 150 },
    { id: "update", label: t("update"), minWidth: 50 },
    { id: "delete", label: t("delete"), minWidth: 50 },
  ];
  const { token } = useSelector((state) => state.admin);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { data, isLoading } = useLevels();
  const [levels, setLevels] = useState([]);
  const { lang } = Cookies.get("i18next") || "en";
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (data) {
      setLevels(data?.data);
    }
  }, [data]);

  /** handle open dialog */
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // Added by Abdelwahab
  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/level/${id}`,
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
        setLevels(levels.filter((level) => level.id !== id));
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
              <TableBody>
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
                {levels
                  ?.filter(
                    (row) =>
                      `${row.titleAR || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim()) ||
                      `${row.titleEN || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" key={row.id + "demj"}>
                        <TableCell align="center">{row.titleAR}</TableCell>
                        <TableCell align="center">{row.titleEN}</TableCell>
                        <TableCell align="center">
                          <Button onClick={() => setOpen(row.id)}>
                            <EditIcon />
                          </Button>
                          <Dialog open={open === row.id} onClose={handleClose}>
                            <UpdateStudyLevel
                              setLevels={setLevels}
                              level={row}
                              handleClose={handleClose}
                            />
                          </Dialog>
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
            count={levels.length}
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
