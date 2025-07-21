import React from "react";
import { Box, Button, TextField , Paper , Avatar , Table, TableBody , TableCell, TableContainer ,TablePagination , TableRow  } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loading      from "../../Loading";
import { useAdminStudentFinancialRecords }     from "../../../hooks/useAdminStudentFinancialRecords";

export default function View() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const columns = [
    { id: "id",             label: t("id"),         minWidth: 20 },
    { id: "image",          label: t("image"),      minWidth: 100 },
    { id: "name",           label: t("name"),       minWidth: 150 },
    { id: "amount",         label: t("amount"),     minWidth: 50 },
    { id: "actions",        label: t("actions"),    minWidth: 50  },
  ];
  const { token } = useSelector((state) => state.admin);
  const [page, setPage]               = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const {data, isLoading}             = useAdminStudentFinancialRecords(token);
  const [FinancialRecords, setFinancialRecords] = useState([]);
  const [total , setTotal]            = useState(0);
  
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
      const alldata = data?.data;
      let amount_total_cal = 0;
      for(var x =0; x< alldata.length ; x++){
        const getrow = alldata[x];
        for(var j=0;j< getrow.FinancialRecords.length;j++){
          amount_total_cal += parseFloat(getrow.FinancialRecords[j].amount);
        }
      }
      setTotal(amount_total_cal);      
      setFinancialRecords(data.data);
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
        `${process.env.REACT_APP_API_KEY}api/v1/admin/careerdepartment/${id}`,
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
        setFinancialRecords(FinancialRecords.filter((c) => c.id !== id));
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
    <Box>
      {!isLoading ? (
        <Paper sx={{ padding: "20px" }}>
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
                    style={{ top: 57, minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
              <TableBody>
                {FinancialRecords.length> 0 ?
                FinancialRecords
                  ?.filter(
                    (row) =>
                      `${row.name || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim()) ||
                      `${row.email || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim()) ||
                    `${row.phoneNumber || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim())

                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    let amount_total = 0;
                    for(var j=0;j< row.FinancialRecords.length;j++){
                      amount_total += parseFloat(row.FinancialRecords[j].amount);
                    }
                    return (
                      <TableRow hover role="checkbox" key={row.id + "demj"}>
                        <TableCell align="center">{row.id}</TableCell>
                        <TableCell align="center">
                        <Avatar
                            sx={{ width: "85px", height: "85px" , margin:"auto" , display:"block" }}
                            src={`${process.env.REACT_APP_API_KEY}images/${row.image}`}
                        />
                        </TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">{amount_total}</TableCell>
                        <TableCell>
                          <Button onClick={() => navigate(`/admin/details-financial-records/${row.id}`)} style={{backgroundColor:"#000" , color:"#FFF" , display:"block" , borderRadius : "15px" , padding:"10px 20px" , margin:"auto"}}>
                           {t("Details")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                  : <TableRow>
                      <TableCell align="center" colSpan={7}>
                      <p>{t("cashbox_student_notfound")}</p>
                      </TableCell>
                    </TableRow>
                  }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={FinancialRecords?.length}
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
    <Box>
    <Paper sx={{ width: "100%", padding: "20px" , marginTop:"20px"}}>
      
      <table className="table_test">
        <tr>
          <td>{t("cash_box_total")}</td>
          <td><b>{total}</b></td>
        </tr>
      </table>
    </Paper>
    </Box>
    </>
  );
}
