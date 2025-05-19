import React, { useState , useEffect} from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import Cookies            from "js-cookie";
import { useAdminDeposits } from "../../hooks/useAdminDeposits";
import { useSelector } from "react-redux";
import Moment from "moment";
import FinancialRecords from "../../components/admin/FinancialRecords";

export default function AdminPayments() {
  const { t } = useTranslation();

  const columns = [
    { id: "Name",     label: t("student"),      minWidth: 150 },
    { id: "Gender",   label: t("price"),        minWidth: 150 },
    { id: "Phone",    label: t("currency"),     minWidth: 150 },
    { id: "View",     label: t("bookingPay"),   minWidth: 150 },
    { id: "delete",   label: t("delete"),       minWidth: 50  },
  ];

  const [page, setPage]                    = React.useState(0);
  const [rowsPerPage, setRowsPerPage]      = React.useState(10);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { token } = useSelector((state) => state.admin);
  const { data, isLoading }               = useAdminDeposits(token);
  const [ DepositsData, setDepositsData ] = useState([]);
  const { lang }                          = Cookies.get("i18next") || "en";
  const [pdf, setPdf]                     = useState(null);
  
  useEffect(() => {
    if (data?.data) {
      setDepositsData(data?.data);
    }else{
      console.log("Not Found data");
    }
  }, [data]);
  
  async function handleDownloadFile() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/wallets/pdf`,
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

  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/wallets/${id}`,
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
        setDepositsData(DepositsData.filter((c) => c.id !== id));
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
          {t("Balancechargeoperations")}
        </Typography>
        <Button variant="contained" onClick={handleDownloadFile}>
          {t("download")}
        </Button>
      </Box>
      {pdf && (
        <embed
          src={URL.createObjectURL(pdf)}
          type="application/pdf"
          width="100%"
          height="600px"
        />
      )}
      {!isLoading ? (
        <Paper sx={{ width: "100%", padding: "20px" }}>
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
                {DepositsData.length > 0 ?
                  DepositsData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow hover role="checkbox" key={row.id + "demj"}>
                          <TableCell align="center">
                            {row.Student?.name || t("username")}
                          </TableCell>
                          <TableCell align="center">{row?.price}</TableCell>
                          <TableCell align="center">
                            {row?.currency || ""}
                          </TableCell>
                          <TableCell align="center">
                            {Moment(row.createdAt).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}
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
                    })
                    : <TableRow>
                      <TableCell align="center" colSpan={5}>
                      <p>{t("DepositsData_notfound")}</p>
                      </TableCell>
                    </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={[].length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Loading />
      )}
      <FinancialRecords />
    </AdminLayout>
  );
}
