import React, { useState , useEffect } from "react";
import { useAdminFinancialRecords } from "../../hooks/useAdminFinancialRecords";
import { useTranslation } from "react-i18next";
import {
  Box,  Paper,  Table,  TableBody,          TableCell,
  TableContainer, TablePagination,    TableRow,
  Typography,     Button
} from "@mui/material";
import moment from "moment";
import { useSnackbar } from "notistack";
import Loading from "../Loading";
import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";

export default function FinancialRecordsData() {
  const { t }           = useTranslation();
  const columns = [
    { id: "student",  label: t("student"),      minWidth: 150 },
    { id: "teacher",  label: t("teacher"),      minWidth: 150 },
    { id: "price",    label: t("price"),        minWidth: 150 },
    { id: "currency", label: t("currency"),     minWidth: 150 },
    { id: "date",     label: t("bookingPay"),   minWidth: 150 },
    { id: "delete",   label: t("delete"),       minWidth: 50  },
  ];
  const [page, setPage]               = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { lang } = Cookies.get("i18next") || "en";
  
  const { token } = useSelector((state) => state.admin);

  const { data, isLoading }        = useAdminFinancialRecords(token);
  const [ FinancialRecordsData, setDataFinancial ] =  useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (data?.data) {
      console.log("get DATA");
      console.log(data);
      setDataFinancial(data.data);
    }else{
      console.log("Not Found data");
    }
  }, [data]);

  // Added by eng.reem.shwky@gmail.com
  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/financialRecords/${id}`,
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
        setDataFinancial(FinancialRecordsData.filter((c) => c.id !== id));
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    } catch (err) {
      console.log("error: ", err);
      enqueueSnackbar(t("somethingWentWrong"), { variant: "error" });
    }
  };

  return (
    <>
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
          {t("paymentOperations")}
        </Typography>
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
                { FinancialRecordsData?.length > 0 ?
                  FinancialRecordsData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow hover role="checkbox" key={row.id + "demj"}>
                          <TableCell align="center">
                            {row.Student?.name || t("username")}
                          </TableCell>
                          <TableCell align="center">
                            {row.Teacher?.firstName +
                              " " +
                              row.Teacher?.lastName || t("username")}
                          </TableCell>
                          <TableCell align="center">{row?.amount}</TableCell>
                          <TableCell align="center">
                            {row?.currency || ""}
                          </TableCell>
                          <TableCell align="center">
                            {moment(row.createdAt).format(
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
                  : 
                  <TableRow>
                      <TableCell align="center" colSpan={7}>
                      <p>{t("financial_records_notfound")}</p>
                      </TableCell>
                    </TableRow>
                  }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={FinancialRecordsData?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Loading />
      )}
    </>
  );
};

