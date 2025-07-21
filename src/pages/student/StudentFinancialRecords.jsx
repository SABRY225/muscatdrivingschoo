import Cookies from "js-cookie";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useStudentFinancialRecords } from "../../hooks/useStudentFinancialRecords";
import StudentLayout from "../../components/student/StudentLayout";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import Loading from "../../components/Loading";
import Moment from "moment";
import { useStudentHistory } from "../../hooks/useStudentHistory";

function StudentFinancialRecords() {
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();
  const { student, token } = useSelector((state) => state.student);
  const { data, isLoading } = useStudentFinancialRecords(student.id, token);
  const { data: data2, isLoading: isLoading2 } = useStudentHistory(student.id);
  return (
    <StudentLayout>
      {!isLoading ? (
        <Paper sx={{ padding: "20px", marginBottom: "40px" }}>
          <Typography
            sx={{
              fontSize: "24px",
              marginTop: "12px",
              fontWeight: "600",
              marginBottom: "30px",
            }}
          >
            {t("paymentOperations")}
          </Typography>
          <Box sx={{ overflow: "auto" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("teacher")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("amount")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("currency")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("status")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("history")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.length > 0 &&
                  data?.data.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {row.Teacher?.firstName + " " + row.Teacher?.lastName}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {row.amount}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {row.currency}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {row.type}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {moment(row.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      ) : (
        <Loading />
      )}
      {/* {!isLoading2 ? (
        <Paper sx={{ padding: "20px", marginBottom: "40px" }}>
          <Typography
            sx={{
              fontSize: "24px",
              marginTop: "12px",
              fontWeight: "600",
              marginBottom: "30px",
            }}
          >
            {t("payment_history")}
          </Typography>
          <Box sx={{ overflow: "auto" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right" sx={{ color: "#005B8E" }}>
                    {t("history")}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#005B8E" }}>
                    {t("currency")}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#005B8E" }}>
                    {t("amount")}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "#005B8E" }}>
                    {t("status")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data2?.data.length > 0 &&
                  data2?.data.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="right">
                        {Moment(row.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </TableCell>
                      <TableCell align="right">{row.currency}</TableCell>
                      <TableCell align="right">{row.price}</TableCell>
                      <TableCell align="right">
                        {lang === "ar" ? row.typeAr : row.typeEn}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      ) : (
        <Loading />
      )} */}
    </StudentLayout>
  );
}

export default StudentFinancialRecords;
