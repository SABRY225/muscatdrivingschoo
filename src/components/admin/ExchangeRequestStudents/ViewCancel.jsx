import React from "react";
import { Box, Button, Dialog ,Avatar  ,TableRow ,Table , TextField ,Paper , TableContainer  , TableBody, TablePagination , TableCell} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Loading            from "../../Loading";
import { useExchangeRequestsStudents } from "../../../hooks/useExchangeRequestsStudents";

export default function ViewCancelStudent() {
  const { t }     = useTranslation();
  const columns = [
    { id: "image",         label: t("image"),        minWidth: 100 },
    { id: "name",          label: t("team"),         minWidth: 150 },
    { id: "amount",        label: t("amount"),       minWidth: 50 },
    { id: "currency",      label: t("currency"),     minWidth: 50 },
    { id: "status",        label: t("status"),       minWidth: 50 },
    { id: "reason",        label: t("reason"),       minWidth: 50 },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { data, isLoading }           = useExchangeRequestsStudents();
  const [ExchangeRequestsStudents, setExchangeRequestsStudents] = useState([]);

  const {  admin , token } = useSelector((state) => state.admin);
  console.log(admin);

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
      setExchangeRequestsStudents(data.data);
    }
  }, [data]);

  return (
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
                    style={{ top: 57, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
              <TableBody>
  {ExchangeRequestsStudents.length > 0 ? (
    ExchangeRequestsStudents
      ?.filter(
        (row) =>
          row.status === 0 &&
          (
            `${row.titleAR || ""}`.toLowerCase().includes(searchInput.toLowerCase().trim()) ||
            `${row.titleEN || ""}`.toLowerCase().includes(searchInput.toLowerCase().trim())
          )
      )
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row) => {
        let status_txt = t("status_waiting");
        if (row.status == "0") {
          status_txt = t("status_rejected");
        } else if (row.status == "2") {
          status_txt = t("status_accept");
        } else if (row.status == "4") {
          status_txt = t("status_refund");
        }

        return (
          <TableRow hover role="checkbox" key={row.id + "demj"}>
            <TableCell align="center">
              <Avatar
                sx={{ width: "85px", height: "85px" }}
                src={`${process.env.REACT_APP_API_KEY}images/${row.Student?.image}`}
              />
            </TableCell>
            <TableCell align="center">{row.Student?.name}</TableCell>
            <TableCell align="center">{row.amount}</TableCell>
            <TableCell align="center">{row.currency}</TableCell>
            <TableCell align="center">{status_txt}</TableCell>
            <TableCell align="center">{row.reason}</TableCell>
          </TableRow>
        );
      })
  ) : (
    <TableRow>
      <TableCell align="center" colSpan={6}>
        <p>{t("ExchangeRequestsStudents_notfound")}</p>
      </TableCell>
    </TableRow>
  )}
</TableBody>

            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={ExchangeRequestsStudents?.length}
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
