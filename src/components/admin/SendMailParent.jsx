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
import Loading      from "../Loading";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import MailIcon from "@mui/icons-material/Mail";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useParents } from "../../hooks/useParents";

export default function SendMailParent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const columns = [
    { id: "image",            label: t("image"),    minWidth: 100 },
    { id: "name",             label: t("name"),     minWidth: 150 },
    { id: "email",            label: t("email"),    minWidth: 150 },
    { id: "mobile",           label: t("phone"),    minWidth: 150 },
    { id: "button_send_mail", label: t("button_send_mail"), minWidth: 50 },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { data, isLoading }           = useParents();
  const [Parents, setParents]         = useState([]);

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
      setParents(data.data);
    }
  }, [data]);

  /** handle open dialog */
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
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
                {Parents
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
                        <TableCell align="center">
                        <Avatar
                            sx={{ width: "85px", height: "85px" }}
                            src={`${process.env.REACT_APP_API_KEY}images/${row.image}`}
                        />
                        </TableCell>
                        <TableCell align="center">{row.name} </TableCell>
                        <TableCell align="center">{row.email} </TableCell>
                        <TableCell align="center">{row.phone} </TableCell>
                        
                        <TableCell align="center">
                        <Button onClick={() => navigate(`/admin/mail-form/${row.email}`)}>
                            <MailIcon />
                        </Button>

                        <Button onClick={() => navigate(`/admin/whatsapp-form/${row.phone}`)}>
                            <WhatsAppIcon />
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
            count={Parents?.length}
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
