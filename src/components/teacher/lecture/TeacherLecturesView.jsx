import React from "react";
import { Box, Button, Dialog , Avatar , Paper , Table, TableBody, TableCell , TablePagination , TableRow , TableContainer}   from "@mui/material";
import { useTranslation }         from "react-i18next";
import Loading          from "../../Loading";
import EditIcon         from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import TextField        from "@mui/material/TextField";
import DeleteIcon       from "@mui/icons-material/Delete";
import { useSelector }  from "react-redux";
import { useSnackbar }  from "notistack";
import Cookies          from "js-cookie";
import { useTeacherLectures }     from "../../../hooks/useTeacherLectures";
import TeacherLectureUpdate  from "./TeacherLectureUpdate";

export default function TeacherLecturesView() {
  const { t } = useTranslation();

  const columns = [
    { id: "image",             label: t("image"),             minWidth: 100 },
    { id: "titleAR",           label: t("titleAR"),           minWidth: 150 },
    { id: "titleEN",           label: t("titleEN"),           minWidth: 150 },
    { id: "descriptionAR",     label: t("descriptionAR"),     minWidth: 150 },
    { id: "descriptionEN",     label: t("descriptionEN"),     minWidth: 150 },
    { id: "update",            label: t("update"),            minWidth: 50 },
    { id: "delete",            label: t("delete"),            minWidth: 50 },
  ];
  const [ page, setPage] = React.useState(0);
  const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
  const [ searchInput, setSearchInput ] = React.useState("");
  const { teacher,token }         = useSelector((state)=>state.teacher);

  const { data, isLoading }       = useTeacherLectures( teacher?.id , token);
  const [ Lectures , setLectures] = useState([]);


  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { lang }    = Cookies.get("i18next") || "en";

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (data?.data) {
      setLectures(data.data);
    }
  }, [data]);

  /** handle open dialog */
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/deleteLecture/${id}`,
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
        setLectures( Lectures.filter((c) => c.id !== id) );
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar(t("somethingWentWrong"), { variant: "error" });
    }
  };
  return (
    <Box>
      {!isLoading ? (
        <Paper sx={{ width: "100%", padding: "20px" }}>
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
                {
                  Lectures.length > 0 ? 
                Lectures
                  ?.filter(
                    (row) =>
                      `${row.name || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim()) ||
                      `${row.subject || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                     
                      <TableRow hover role="checkbox" key={row.id + "demj"}>
                        <TableCell align="center">
                        <Avatar
                            sx={{ width: "85px", height: "85px" }}
                            src={`${process.env.REACT_APP_API_KEY}images/${row.image}`}
                        />
                        </TableCell>
                        <TableCell align="center">{row.titleAR}</TableCell>
                        <TableCell align="center">{row.titleEN}</TableCell>
                        <TableCell align="center">{row.descriptionAr}</TableCell>
                        <TableCell align="center">{row.descriptionEn}</TableCell>
                        <TableCell align="center">
                          <Button onClick={() => setOpen(row.id)}>
                            <EditIcon />
                          </Button>
                          <Dialog open={open === row.id} onClose={handleClose}>
                            <TeacherLectureUpdate
                              setLectures={setLectures}
                              Lectures={row}
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
                : <TableRow>
                    <TableCell align="center" colSpan={6}>
                    <p>{t("lectrue_notfound")}</p>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={Lectures?.length}
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
