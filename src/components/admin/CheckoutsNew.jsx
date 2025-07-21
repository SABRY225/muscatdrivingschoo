import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import { useNewCheckouts } from "../../hooks/useCheckouts";
import Cookies from "js-cookie";
import axios from "axios";

export default function CheckoutsNew() {
  const { t } = useTranslation();
  const { lang } = Cookies.get("i18next") ;

const columns = [
  { id: "teacher_name", label: t("teacher"), minWidth: 150 },
  { id: "value", label: t("price"), minWidth: 100 },
  { id: "method", label: t("paymentMethod"), minWidth: 100 },
  { id: "details", label: t("details"), minWidth: 250 },
  { id: "actions", label: t("actions"), minWidth: 100 },
];

  const { token } = useSelector((state) => state.admin);
  let { data, isLoading } = useNewCheckouts(token);
  const [list, setList] = useState([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsRow, setDetailsRow] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (data) {
      setList(data?.data);
    }
  }, [data]);


async function handleAccept(id) {
  filterList(id);
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_KEY}api/v1/admin/checkout/accept/${id}/${Cookies.get("i18next")}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // أو Bearer ${token} إذا API يحتاج
        },
      }
    );

    // يمكنك التحقق من response.status أو response.data
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Request failed");
    }
  } catch (err) {
    console.error("Axios error:", err);
  }
}



async function handleReject(id) {
  filterList(id);
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_KEY}api/v1/admin/checkout/reject/${id}/${Cookies.get("i18next")}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // ← عدّل إذا API ما يحتاج Bearer
        },
      }
    );

    // تحقق من الاستجابة لو لزم
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Request failed");
    }

    console.log("Rejected successfully");
  } catch (err) {
    console.error("Axios error:", err.response?.data || err.message);
  }
}


  function filterList(id) {
    setList((pre) => pre.filter((item) => item.id !== id));
  }

  return (
    <Box>
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
                {list
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                     <TableRow hover role="checkbox" key={row.id}>
  <TableCell align="center">
    {row?.Teacher?.firstName + " " + row?.Teacher?.lastName}
  </TableCell>
  <TableCell align="center">{row?.value}</TableCell>
  <TableCell align="center">{t(row?.method)}</TableCell>
  <TableCell align="center">
    <Button variant="outlined" size="small" onClick={() => { setDetailsRow(row); setOpenDetails(true); }}>{t("showDetails")}</Button>
  </TableCell>
  <TableCell align="center">
    <Button color="success" onClick={() => handleAccept(row.id)}>
      <DoneIcon />
    </Button>
    <Button color="error" onClick={() => handleReject(row.id)}>
      <ClearIcon />
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
            count={data.data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          {/* Dialog for details */}
          <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="xs" fullWidth>
            <DialogTitle>{t("details")}</DialogTitle>
            <DialogContent>
              {detailsRow && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}><b>{t("paymentMethod")}: </b> {t(detailsRow.method)}</Typography>
                  {detailsRow.method === "phone" && (
                    <Typography variant="body2" sx={{ mb: 1 }}>{t("phoneNumber")}: {detailsRow.phoneNumber}</Typography>
                  )}
                  {detailsRow.method === "bank" && (
                    <>
                      <Typography variant="body2" sx={{ mb: 1 }}>{t("bankName")}: {detailsRow.bankName}</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>{t("accountNumber")}: {detailsRow.accountNumber}</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>{t("iban")}: {detailsRow.iban}</Typography>
                    </>
                  )}
                  <Box sx={{ mt: 2, p: 1, background: "#f8fafc", borderRadius: 2, boxShadow: "0 1px 6px #d6eaf8" }}>
                    <Typography variant="body2" sx={{ mb: 1, color: "#2980b9" }}><b>{t("The required amount")}: </b>{detailsRow?.value}{" "}{t("OMR")}</Typography>
                  </Box>
                  <Box sx={{ mt: 2, p: 1, background: "#f8fafc", borderRadius: 2, boxShadow: "0 1px 6px #d6eaf8" }}>
                    <Typography variant="body2" sx={{ mb: 1, color: "#2980b9" }}><b>{t("totalBalance")}: </b>{detailsRow?.Teacher?.totalAmount ?? "-"} {" "}{t("OMR")}</Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: "#27ae60" }}><b>{t("availableBalance")}: </b>{(detailsRow?.Teacher?.totalAmount - detailsRow?.Teacher?.dues )?? "-"} {" "}{t("OMR")}</Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: "#e67e22" }}><b>{t("withdrawnBalance")}: </b>{detailsRow?.Teacher?.dues ?? "-"}{" "}{t("OMR")}</Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDetails(false)}>{t("close")}</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      ) : (
        <Loading />
      )}
    </Box>
  );
}
