import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Dialog  } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useParentsForStudent } from "../../hooks/useParentsForStudent";
import Loading from "../Loading";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import { DisplaySettings } from "@mui/icons-material";

export default function ParentTable() {
  const { t } = useTranslation();

  const columns = [
    //{ id: "id",       label: t("id"),       minWidth: 150 },
    { id: "parent_name",     label: t("name"),     minWidth: 150 },
    { id: "email",     label: t("email"),     minWidth: 150 },
    //{ id: "update",   label: t("update"),   minWidth: 150 },
    //{ id: "delete",   label: t("delete"),   minWidth: 150 },
  ];
  const [page, setPage]               = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { student }                   = useSelector((state) => state.student);
  const { token }                     = useSelector((state) => state.student);
  const { data, isLoading }           = useParentsForStudent(student?.id , token);
  const [ParentStudent , setParentsForStudents] = useState([]);
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
      setParentsForStudents(data.data);
console.log(data.data);

      if (lang === "en") {
        enqueueSnackbar(data.msg.english, { variant: "success" });
      } else {
        enqueueSnackbar(data.msg.arabic, { variant: "success" });
      }

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
        `${process.env.REACT_APP_API_KEY}api/v1/admin/student/${id}`,
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
        setParentsForStudents(ParentStudent.filter((c) => c.id !== id));
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
        <Paper sx={{ width: "100%", padding: "20px", marginTop : "20px" }}>
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
                {ParentStudent
                  ?.filter(
                    (row) =>
                      `${row.id || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim()) ||
                      `${row.name || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" key={row.id + "demj"}>
                        <TableCell align="center">{row.Parent.name}</TableCell>
                        <TableCell align="center">{row.Parent.email}</TableCell>
                        
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          
        </Paper>
      ) : (
        <Loading />
      )}
    </Box>
  );
}
