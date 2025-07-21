import React, { useState, useEffect, useMemo } from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow,
  Box, Button
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Loading from "../../Loading";
import { useLevels } from "../../../hooks/useLevels";

export default function AllLesson() {
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const { teacher } = useSelector((state) => state.teacher);

  const [Lesson, setLesson] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          `${process.env.REACT_APP_API_KEY}api/v1/lesson/get-lessions-request-teacher/${teacher.id}`,
          { signal }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const result = await response.json();
        setLesson(result?.data || []);
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/lesson/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      console.log(data);
      setLesson(Lesson.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  const convertTo12Hour = (timeStr) => {
    const [hourStr, minute] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const columns = [
    { id: "#", label: t("#"), minWidth: 150 },
    { id: "student", label: t("student"), minWidth: 150 },
    { id: "email", label: t("email"), minWidth: 150 },
    { id: "city", label: t("city student"), minWidth: 150 },
    { id: "lessonType", label: t("lessonType"), minWidth: 150 },
    { id: "Place Lesson", label: t("Place Lesson"), minWidth: 150 },
    { id: "date", label: t("date"), minWidth: 150 },
    { id: "Time", label: t("Time"), minWidth: 150 },
    { id: "price", label: t("price"), minWidth: 150 },
    { id: "Session number", label: t("Session number"), minWidth: 150 },
    { id: "status", label: t("status"), minWidth: 150 },
    { id: "delete", label: t("delete"), minWidth: 150 },
  ];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }} />
      {!isLoading ? (
        <Paper sx={{ width: "100%", p: 2 }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="lessons table">
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align="center" style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
              <TableBody>
                {Lesson.length > 0 &&
                  Lesson.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center">{row?.student?.name}</TableCell>
                      <TableCell align="center">{row?.student?.email}</TableCell>
                      <TableCell align="center">
  <Box>
    <Box>{row?.student?.city || ""}</Box>
  </Box>
</TableCell>

                      <TableCell align="center">
                        {lang === "ar"
                          ? levelMap[row?.typeLesson]?.titleAR
                          : levelMap[row?.typeLesson]?.titleEN}
                      </TableCell>
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
                      <TableCell align="center">{row?.price} {t(row?.currency)}</TableCell>
                      <TableCell align="center">{row?.period}</TableCell>
                      <TableCell align="center">
  <Box
    sx={{
      backgroundColor:
        row.status === "pending"
          ? "#fff3cd" // أصفر فاتح
          : row.status === "approved"
          ? "#cce5ff" // أزرق فاتح
          : row.status === "paid"
          ? "#d4edda" // أخضر فاتح
          : "#f8d7da", // أحمر فاتح
      color:
        row.status === "pending"
          ? "#856404"
          : row.status === "approved"
          ? "#004085"
          : row.status === "paid"
          ? "#155724"
          : "#721c24",
      borderRadius: "12px",
      display: "inline-block",
      px: 2,
      py: 0.5,
      fontWeight: "bold",
      fontSize: "13px",
    }}
  >
    {row.status === "pending"
      ? t("pending")
      : row.status === "approved"
      ? t("Waiting for payment")
      : row.status === "paid"
      ? t("paid")
      : t("canceled")}
  </Box>
</TableCell>

                      <TableCell align="center">
                        <Button variant="contained" color="error" onClick={() => handleDelete(row.id)}>
                          {t("delete")}
                        </Button>
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
