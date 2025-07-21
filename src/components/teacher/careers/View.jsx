import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  Avatar,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableHead
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
import Loading from "../../Loading";
import countries from "../../../data/countries";
import CareerUpdate from "./Update";
import { useCareersTeacher } from "../../../hooks/useCareersTeacher";

export default function CareerView() {
  const { t } = useTranslation();
  const { teacher, token } = useSelector((state) => state.teacher);
  const { data, isLoading } = useCareersTeacher(teacher.id);
  const [Careers, setCareers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const lang = Cookies.get("i18next") || "en";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setCareers(data.data);
    }
  }, [data]);

  const columns = [
    { id: "image", label: t("image"), minWidth: 100 },
    { id: "careerDepartment", label: t("careerDepartment"), minWidth: 150 },
    { id: "country", label: t("country"), minWidth: 100 },
    { id: "title", label: t("title"), minWidth: 150 },
    { id: "description", label: t("description"), minWidth: 200 },
    { id: "status", label: t("status"), minWidth: 100 },
    { id: "update", label: t("update"), minWidth: 70 },
    { id: "delete", label: t("delete"), minWidth: 70 },
  ];

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClose = () => setOpen(false);

  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/career/${id}`,
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
        enqueueSnackbar(lang === "en" ? json.msg.english : json.msg.arabic, {
          variant: "success",
        });
        setCareers(Careers.filter((c) => c.id !== id));
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    } catch (err) {
      console.log("error: ", err);
      enqueueSnackbar(t("somethingWentWrong"), { variant: "error" });
    }
  };

  const filteredCareers = Careers.filter(
    (row) =>
      (row.titleAR || "").toLowerCase().includes(searchInput.toLowerCase()) ||
      (row.titleEN || "").toLowerCase().includes(searchInput.toLowerCase())
  );

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
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredCareers.length > 0 ? (
                  filteredCareers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const country = countries.find(
                        (e) => e.code === row?.country?.toLowerCase()
                      );

                      let txt_status = "";
                      if (row.status === 1) txt_status = t("waiting");
                      else if (row.status === 0) txt_status = t("reject");
                      else if (row.status === 2) txt_status = t("accept");

                      return (
                        <TableRow hover key={row.id}>
                          <TableCell align="center">
                            <Avatar
                              sx={{ width: "85px", height: "85px" }}
                              src={`${process.env.REACT_APP_API_KEY}images/${row.image}`}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {lang === "en"
                              ? row?.CareerDepartment?.titleEN
                              : row?.CareerDepartment?.titleAR}
                          </TableCell>
                          <TableCell align="center">
                            {country
                              ? lang === "en"
                                ? country.name_en
                                : country.name_ar
                              : ""}
                          </TableCell>
                          <TableCell align="center">
                            {lang === "ar" ? row.titleAR : row.titleEN}
                          </TableCell>
                          <TableCell align="center">
                            {lang === "ar"
                              ? row.descriptionAr
                              : row.descriptionEn}
                          </TableCell>
                          <TableCell align="center">{txt_status}</TableCell>
                          <TableCell align="center">
                            <Button onClick={() => setOpen(row.id)}>
                              <EditIcon />
                            </Button>
                            <Dialog open={open === row.id} onClose={handleClose}>
                              <CareerUpdate
                                setCareers={setCareers}
                                career={row}
                                handleClose={handleClose}
                              />
                            </Dialog>
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
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={columns.length}>
                      <p>{t("career_notfound")}</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredCareers.length}
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
