import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";
import { useProcessedCheckouts } from "../../hooks/useCheckouts";

export default function CheckoutsProcessed() {
  const { t } = useTranslation();

  const columns = [
    { id: "teacher_name", label: t("teacher"), minWidth: 150 },
    { id: "value", label: t("price"), minWidth: 150 },
    { id: "status", label: t("status"), minWidth: 150 },
  ];
  const { token } = useSelector((state) => state.admin);
  let { data, isLoading } = useProcessedCheckouts(token);
  const [list, setList] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  useEffect(() => {
    if (data) {
      setList(data?.data);
    }
  }, [data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Box>
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
                {list
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" key={row.id + "denjhbmj"}>
                        <TableCell align="center">
                          {row?.Teacher?.firstName +
                            " " +
                            row?.Teacher?.lastName}
                        </TableCell>
                        <TableCell align="center">{row?.value}</TableCell>

                        <TableCell align="center">
                          {row.status === 1 ? (
                            <Typography color={"green"}>
                              {t("accept")}
                            </Typography>
                          ) : (
                            row.status === -1 && (
                              <Typography color={"red"}>
                                {t("reject")}
                              </Typography>
                            )
                          )}
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
        </Paper>
      ) : (
        <Loading />
      )}
    </Box>
  );
}
