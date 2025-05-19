import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import { useNewCheckouts } from "../../hooks/useCheckouts";

export default function CheckoutsNew() {
  const { t } = useTranslation();

  const columns = [
    { id: "teacher_name", label: t("teacher"), minWidth: 150 },
    { id: "value", label: t("price"), minWidth: 150 },
    { id: "actions", label: t("actions"), minWidth: 150 },
  ];
  const { token } = useSelector((state) => state.admin);
  let { data, isLoading } = useNewCheckouts(token);
  const [list, setList] = useState([]);
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
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/checkout/accept/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("failed occured");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleReject(id) {
    filterList(id);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/checkout/reject/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("failed occured");
      }
    } catch (err) {
      console.log(err);
    }
  }

  function filterList(id) {
    setList((pre) => pre.filter((item) => item.id !== id));
  }

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
                          <Button
                            color="success"
                            onClick={() => handleAccept(row.id)}
                          >
                            <DoneIcon />
                          </Button>
                          <Button
                            color="error"
                            onClick={() => handleReject(row.id)}
                          >
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
        </Paper>
      ) : (
        <Loading />
      )}
    </Box>
  );
}
