import React from "react";
import { Box, Button, Dialog, Avatar, Paper, Table, TableBody, TableRow, TablePagination, TableContainer, TableCell } from "@mui/material";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import Loading from "../../Loading";
import { useDiscountsTeacher } from "../../../hooks/useDiscountsTeacher";
import { useNavigate } from "react-router-dom";


export default function View() {
  const { t } = useTranslation();

  const columns = [
    { id: "image", label: t("image"), minWidth: 150 },
    { id: "title", label: t("title"), minWidth: 150 },
    { id: "titleEN", label: t("discount_description"), minWidth: 150 },
    { id: "descriptionAR", label: t("conditions"), minWidth: 150 },
    { id: "descriptionEN", label: t("startDate"), minWidth: 150 },
    { id: "link", label: t("endDate"), minWidth: 170 },
    { id: "link", label: t("discount_percentage"), minWidth: 150 },
    { id: "link", label: t("discount_amountBeforeDiscount"), minWidth: 150 },
    { id: "link", label: t("discount_amountAfterDiscount"), minWidth: 150 },
    { id: "link", label: t("status"), minWidth: 150 },
    { id: "update", label: t("update"), minWidth: 50 },
    { id: "delete", label: t("delete"), minWidth: 50 },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { teacher, token } = useSelector((state) => state.teacher);
  const { data, isLoading } = useDiscountsTeacher(teacher?.id, token);
  const [Discounts, setDiscounts] = useState([]);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { lang } = Cookies.get("i18next") || "en";
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (data?.data) {
      setDiscounts(data.data);
    }
  }, [data]);

  const handleUpdate = (id) => {
    navigate(`/teacher/edit-discount/${id}`)
  }

  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/discount/${id}`,
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
        setDiscounts(Discounts.filter((c) => c.id !== id));
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
        <Paper sx={{padding: "20px" }}>
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
                {Discounts.length > 0 ?
                  Discounts
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
                      let txt_status = t("waiting");
                      if (row.status == "0") txt_status = t("rejected");
                      else if (row.status == "2") txt_status = t("accept");
                      return (
                        <TableRow hover role="checkbox" key={row.id + "demj"}>
                          <TableCell align="center">
                            <Avatar
                              sx={{ width: "85px", height: "85px" }}
                              src={`${process.env.REACT_APP_API_KEY}images/${row.image}`}
                            />
                          </TableCell>
                          <TableCell align="center">{(lang == "en") ? row.titleEN : row.titleAR}</TableCell>
                          <TableCell align="center">{(lang == "en") ? row.descriptionEN : row.descriptionAR}</TableCell>
                          <TableCell align="center">{(lang == "en") ? row.conditionsEN : row.conditionsAR}</TableCell>
                          <TableCell align="center">{new Date(row.startDate).toLocaleString()}</TableCell>
                          <TableCell align="center">{new Date(row.endDate).toLocaleString()}</TableCell>
                          <TableCell align="center">{row.percentage}</TableCell>
                          <TableCell align="center">{row.amountBeforeDiscount}</TableCell>
                          <TableCell align="center">{row.amountAfterDiscount}</TableCell>
                          <TableCell align="center">{txt_status}</TableCell>
                          <TableCell align="center">
                            <Button onClick={() => handleUpdate(row.id)}>
                              <EditIcon />
                            </Button>
                          </TableCell>
                          <TableCell align="center">
                            <Button color="error" onClick={() => handleDelete(row.id)}>
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  : <TableRow>
                    <TableCell align="center" colSpan={8}>
                      <p>{t("discounts_notfound")}</p>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={Discounts?.length}
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
