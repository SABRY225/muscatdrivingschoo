import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Typography , Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import Loading from "../../components/Loading";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useParentStudentFinished } from "../../hooks/useParentStudent";
export default function ParentStudentFinished() {
  const { t } = useTranslation();

  const columns = [
    { id: "name_courseded",     label: t("student_name"), minWidth: 150 },
    { id: "name_course_endede", label: t("parent_name"), minWidth: 150 },
    { id: "name_teacherded",    label: t("status"), minWidth: 50 },
    { id: "actions",            label: t("actions"), minWidth: 50 },
  ];
  const { token } = useSelector((state) => state.admin);

  const [page, setPage] = React.useState(0);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { lang } = Cookies.get("i18next") || "en";

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  let { data, isLoading } = useParentStudentFinished(token);

  const [list, setList] = useState([]);

  useEffect(() => {
    if (data) {
      setList(data?.data);
    }
  }, [data]);

  // Added by eng.reem.shwky@gmail.com
  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/deleteParentStudent/${id}`,
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
        setList(list.filter((c) => c.id !== id));
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
                          {row?.Student?.name}
                        </TableCell>
                        <TableCell align="center">{row?.Parent.name}</TableCell>
                        <TableCell align="center">
                          {row.status == "1" ? (
                            <Typography color={"green"}>
                              {t("accept")}
                            </Typography>
                          ) : (
                            row.status == "-1" && (
                              <Typography color={"red"}>
                                {t("reject")}
                              </Typography>
                            )
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
