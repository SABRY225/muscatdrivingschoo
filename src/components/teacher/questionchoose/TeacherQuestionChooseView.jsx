import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Dialog  }   from "@mui/material";
import { useTranslation }         from "react-i18next";
import Loading                    from "../../Loading";
import EditIcon                   from "@mui/icons-material/Edit";
import { useState, useEffect }    from "react";
import TextField        from "@mui/material/TextField";
import DeleteIcon       from "@mui/icons-material/Delete";
import { useSelector }  from "react-redux";
import { useSnackbar }  from "notistack";
import Cookies          from "js-cookie";
import { useTeacherQuestionChoose }     from "../../../hooks/useTeacherQuestionChoose";
import TeacherQuestionChooseUpdate      from "./TeacherQuestionChooseUpdate";

export default function TeacherQuestionChooseView() {
  console.log("Teacher Questions");
  const { t } = useTranslation();

  const columns = [
    { id: "question",             label: t("question"),           minWidth: 100 },
    { id: "titleAr",             label: t("titleAr"),           minWidth: 150 },
    { id: "titleEN",             label: t("titleEn"),           minWidth: 150 },
    { id: "isCorrectAnswer",     label: t("isCorrectAnswer"),     minWidth: 150 },
    { id: "update",              label: t("update"),            minWidth: 50  },
    { id: "delete",              label: t("delete"),            minWidth: 50  },
  ];
  const [ page, setPage] = React.useState(0);
  const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
  const [ searchInput, setSearchInput ] = React.useState("");
  const { teacher,token }         = useSelector((state)=>state.teacher);

  const { data, isLoading }       = useTeacherQuestionChoose( teacher?.id , token);
  const [ Questions , setQuestionChooses] = useState([]);


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
      setQuestionChooses(data.data);
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
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/questionchoose/${id}`,
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
        setQuestionChooses( Questions.filter((c) => c.id !== id) );
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
                {Questions.length> 0 
                ? Questions
                  ?.filter(
                    (row) =>
                    `${row.titleAr || ""}`
                      .toLowerCase()
                      .includes(searchInput.toLowerCase().trim()) ||
                    `${row.titleEn || ""}`
                      .toLowerCase()
                      .includes(searchInput.toLowerCase().trim()) 
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                     
                      <TableRow hover role="checkbox" key={row.id + "demj"}>
                        <TableCell align="center">{ lang === "en" ? row.TeacherQuestion?.titleEN : row.TeacherQuestion?.titleAR}</TableCell>
                        <TableCell align="center">{row.titleAR}</TableCell>
                        <TableCell align="center">{row.titleEN}</TableCell>
                        <TableCell align="center">{row.isCorrectAnswer == "1" ? t("yes") : t("no")}</TableCell>
                        
                        <TableCell align="center">
                          <Button onClick={() => setOpen(row.id)}>
                            <EditIcon />
                          </Button>
                          <Dialog open={open === row.id} onClose={handleClose}>
                            <TeacherQuestionChooseUpdate
                              setQuestionChooses={setQuestionChooses}
                              QuestionChoose={row}
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
                   <TableCell align="center" colSpan={7}>
                    <p>{t("quseiton_choose_notfound")}</p>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={Questions?.length}
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
