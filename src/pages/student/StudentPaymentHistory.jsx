import React from "react";
import StudentLayout from "../../components/student/StudentLayout";
import { useTranslation } from "react-i18next";
import { Paper, Typography, Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useStudentHistory } from "../../hooks/useStudentHistory";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading";
import Cookies from "js-cookie";
import Moment from "moment";

export default function StudentPaymentHistory() {
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();
  const { student } = useSelector((state) => state.student);
  const { data, isLoading } = useStudentHistory(student.id);

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
                {data?.data.length > 0 &&
                  data?.data.map((row) => (
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
      )}
    </StudentLayout>
  );
}
