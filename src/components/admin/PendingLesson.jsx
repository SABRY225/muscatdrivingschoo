import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import Cookies from 'js-cookie';
import Loading from "../../components/Loading";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";

export default function PendingLesson() {
  const lang = Cookies.get("i18next") || "en";
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [Lesson, setLesson] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    async function getAdminLessons() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/lesson/panding`,
          { signal }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setLesson(data.data);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Failed to fetch admin Lessons:", err);
          setError("Failed to fetch Lessons");
        }
      } finally {
        setLoading(false);
      }
    }

    getAdminLessons();

    return () => {
      controller.abort(); // Cleanup to avoid memory leaks
    };
  }, []);

 
  const columns = [
    { id: "#", label: t("#"), minWidth: 150 },
    { id: "teacher", label: t("teacher"), minWidth: 150 },
    { id: "student", label: t("student"), minWidth: 150 },
    { id: "lessonType", label: t("lessonType"), minWidth: 150 },
    { id: "price", label: t("price"), minWidth: 150 },
    { id: "Session number", label: t("Session number"), minWidth: 150 },
    { id: "status", label: t("status"), minWidth: 150 },
    { id: "actions", label: t("actions"), minWidth: 300 },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };



async function acceptLesson(id) {
  closeSnackbar();

  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_KEY}api/v1/lesson/accept-request/${id}`,
      {lang}, 
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response);

    enqueueSnackbar(t("The Lesson has been verified."), {
      variant: "success",
      autoHideDuration: 8000,
    });

    filterTeachers(id);

  } catch (error) {
    console.error(error);

    enqueueSnackbar(t("error"), {
      variant: "error",
      autoHideDuration: 8000,
    });
  }
}


async function rejectLesson(id) {
  closeSnackbar();

  try {
    await axios.patch(
      `${process.env.REACT_APP_API_KEY}api/v1/lesson/reject-request/${id}`,
       {lang}, 
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    enqueueSnackbar(t("The lesson has been rejected."), {
      variant: "success",
      autoHideDuration: 8000,
    });

    filterTeachers(id);

  } catch (error) {
    console.error(error);

    enqueueSnackbar(t("Failed to reject the lesson."), {
      variant: "error",
      autoHideDuration: 8000,
    });
  }
}


  function filterTeachers(id) {
    const filteredTeachers = Lesson.filter(
      (teacher) => teacher.id.toString() !== id.toString()
    );
    setLesson(filteredTeachers);
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          marginTop: "0px",
        }}
      >
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
                {Lesson.length > 0 &&
                  Lesson
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow hover role="checkbox" key={row.id + "demj"}>
                          <TableCell align="center">{t(row.id)}</TableCell>
                          <TableCell align="center">{row?.teacher.firstName}{" "}{row?.teacher.lastName}</TableCell>
                          <TableCell align="center">{t(row?.student.name)}</TableCell>
                          <TableCell align="center">{t(row?.type)}</TableCell>
                          <TableCell align="center">{row?.price}{" "}{t(row.currency)}</TableCell>
                          <TableCell align="center">{row?.period}</TableCell>
                            <TableCell align="center">
                              {t(row.status)}
                            </TableCell>
                          <TableCell align="center">
                            <Button color="success">
                              <DoneIcon 
                              onClick={() => acceptLesson(row.id)} 
                              />
                            </Button>
                            <Button
                              color="error"
                              onClick={() => rejectLesson(row.id)}
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
            count={Lesson.length}
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
}