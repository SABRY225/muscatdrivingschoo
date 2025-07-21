import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import Loading from "../../Loading";
import LoadingButton from "@mui/lab/LoadingButton";
import { useLevels } from "../../../hooks/useLevels";

export default function PendingLessons() {
  const lang = Cookies.get("i18next") || "en";
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [Lesson, setLesson] = useState([]);
  const { teacher } = useSelector((state) => state.teacher);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingActionId, setLoadingActionId] = useState(null);
  const [loadingActionType, setLoadingActionType] = useState(null);
  const { data } = useLevels();

  const levelMap = useMemo(() => {
    const map = {};
    data?.data?.forEach(level => {
      map[level.id] = level;
    });
    return map;
  }, [data]);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function getAdminLessons() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/lesson/teacher/panding/${teacher.id}`,
          { signal }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setLesson(data.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch admin Lessons:", err);
          setError("Failed to fetch Lessons");
        }
      } finally {
        setLoading(false);
      }
    }

    getAdminLessons();
    return () => controller.abort();
  }, [teacher.id]);

  const columns = [
    { id: "#", label: t("#"), minWidth: 100 },
    { id: "student", label: t("student"), minWidth: 150 },
    { id: "email", label: t("email"), minWidth: 150 },
    { id: "city", label: t("city student"), minWidth: 150 },
    { id: "lessonType", label: t("lessonType"), minWidth: 150 },
    { id: "place", label: t("Place Lesson"), minWidth: 150 },
    { id: "date", label: t("date"), minWidth: 150 },
    { id: "Time", label: t("Time"), minWidth: 150 },
    { id: "price", label: t("price"), minWidth: 100 },
    { id: "Session number", label: t("Session number"), minWidth: 100 },
    { id: "status", label: t("status"), minWidth: 150 },
    { id: "actions", label: t("actions"), minWidth: 300 },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filterTeachers = (id) => {
    setLesson((prev) => prev.filter((lesson) => lesson.id !== id));
  };

  const handleLessonAction = useCallback(
    async (id, type) => {
      closeSnackbar();
      setLoadingActionId(id);
      setLoadingActionType(type);

      const url =
        type === "accept"
          ? `${process.env.REACT_APP_API_KEY}api/v1/lesson/accept-request/${id}`
          : `${process.env.REACT_APP_API_KEY}api/v1/lesson/reject-request/${id}`;

      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        ...(type === "accept" ? { body: JSON.stringify({ lang }) } : { body: JSON.stringify({ lang }) }),
      };

      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          enqueueSnackbar(
            t(type === "accept" ? "error" : "The Lesson has not been cancelled."),
            { variant: "error", autoHideDuration: 8000 }
          );
        } else {
          enqueueSnackbar(
            t(
              type === "accept"
                ? "The Lesson has been verified."
                : "The Lesson has been rejected."
            ),
            { variant: "success", autoHideDuration: 8000 }
          );
          filterTeachers(id);
        }
      } catch (error) {
        enqueueSnackbar(t("Something went wrong."), {
          variant: "error",
          autoHideDuration: 8000,
        });
      } finally {
        setLoadingActionId(null);
        setLoadingActionType(null);
      }
    },
    [lang, t]
  );

  const convertTo12Hour = (timeStr) => {
    if (!timeStr) return "";
    const [hourStr, minute] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      ></Box>
      {!isLoading ? (
        <Paper sx={{ padding: "20px" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="center"
                    style={{ top: 57, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
              <TableBody>
                {Lesson.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover key={row.id}>
                    <TableCell align="center">{row.id}</TableCell>
                    <TableCell align="center">{row?.student?.name}</TableCell>
                    <TableCell align="center">{row?.student?.email}</TableCell>
                    <TableCell align="center">{row?.student?.city}</TableCell>

                    {/* نوع الحصة */}
                     <TableCell align="center">
                                            {lang === "ar"
                                              ? levelMap[row?.typeLesson]?.titleAR
                                              : levelMap[row?.typeLesson]?.titleEN}
                                          </TableCell>

                    {/* مكان الحصة */}
                    <TableCell align="center">
                      {row?.place === "online"
                        ? t("online")
                        : row?.place === "teacher"
                        ? t("teacher location")
                        : row?.place === "student"
                        ? t("student location")
                        : row?.place}
                    </TableCell>

                    <TableCell align="center">
                      {new Date(row?.date).toLocaleDateString("en-EG")}
                    </TableCell>

                    <TableCell align="center">{convertTo12Hour(row?.time)}</TableCell>

                    <TableCell align="center">
                      {row?.price} {t(row?.currency)}
                    </TableCell>

                    <TableCell align="center">{row?.period}</TableCell>

                    {/* الحالة مع اللون */}
                    <TableCell align="center">
                      <Box
                        sx={{
                          backgroundColor: row.isVerified ? "#d4edda" : "#fff3cd",
                          color: row.isVerified ? "#155724" : "#856404",
                          borderRadius: "12px",
                          display: "inline-block",
                          px: 2,
                          py: 0.5,
                          fontWeight: "bold",
                          fontSize: "13px",
                        }}
                      >
                        {row.isVerified ? t("Available") : t("Review")}
                      </Box>
                    </TableCell>

                    {/* الإجراءات */}
                    <TableCell
                      align="center"
                      sx={{ display: "flex", justifyContent: "space-around" }}
                    >
                      <LoadingButton
                        variant="contained"
                        color="success"
                        loading={loadingActionId === row.id && loadingActionType === "accept"}
                        onClick={() => handleLessonAction(row.id, "accept")}
                        startIcon={<DoneIcon />}
                      >
                        {t("accept")}
                      </LoadingButton>

                      <LoadingButton
                        variant="contained"
                        color="error"
                        loading={loadingActionId === row.id && loadingActionType === "reject"}
                        onClick={() => handleLessonAction(row.id, "reject")}
                        startIcon={<ClearIcon />}
                      >
                        {t("reject")}
                      </LoadingButton>
                    </TableCell>
                  </TableRow>
                ))}
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
